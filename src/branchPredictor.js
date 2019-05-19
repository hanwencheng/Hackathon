const oneTime = require('./model');
const config = require('./config');
const t = require('./strings')
const dataFetcher = require('./dataFetcher')
const _ =  require('lodash')

let rootTrie = {};

/** There will be multiple ways to build the leave node, here we use the average value for it **/
const buildLeaveNode = (leaveNode, calculateResult) => {
  if(!leaveNode.hasOwnProperty("value")){
    return {
      value: {
        [t.MAX_BID]: calculateResult[t.MAX_BID],
        [t.ACCEPT_DELAY]: calculateResult[t.ACCEPT_DELAY],
        times: 1
      },
    }
  } else{
    const {value, times} = leaveNode.value
    return _.map(value, (value, key) => {
      if (key !== 'times') {
        //calculate Average
        return (value * times + calculateResult[key]) / (times + 1)
      }
      return value + 1
    });
  }
}

const buildPredictor = (rootTrie, calculateResult, priceList) => {
  priceList.reduce((currentRoot, price, i) => {
    const propName = price; // could be optimized if we use arrange like 'a little bit higher'
    if(!currentRoot.hasOwnProperty(propName)){
      currentRoot[propName] = {}
    }
    if(i === priceList.length - 1){
      currentRoot[propName] = Object.assign(buildLeaveNode(currentRoot[propName], calculateResult))
    } else {
      return currentRoot[propName]
    }
  }, rootTrie )
}

const build = (startTime = 0, learnArrange = config.learnArrange) => {
  let sumPayment = 0, sumSuccess = 0, sumFailure = 0;
  let priceList = []
  rootTrie = {}
  // construct CNN model
  for (let i = 0; i < learnArrange; i++) {
    if(priceList.length < dataFetcher.getMaxDelay()) continue;
    
    const calculateResult = oneTime(startTime + i, sumPayment, sumSuccess, sumFailure)
    if(calculateResult[t.IS_SUCCESS]){
      sumSuccess ++;
      sumPayment += calculateResult[t.MAX_BID]
    }else{
      sumFailure ++;
    }
    priceList.push(dataFetcher.getCurrentPrice());
    priceList = priceList.slice(1);
    buildPredictor(rootTrie, calculateResult, priceList)
  }
};

const predict = (priceList) => {
  return priceList.reduce((result, current, i)=>{
    if(i === priceList.length - 1) {
      return result.value
    } else if (result.hasOwnProperty(current)){
      return result[current]
    } else {
      return {
        [t.MAX_BID]: t.EMPTY_DATA_PLACEHOLDER,
        [t.ACCEPT_DELAY]: t.EMPTY_DATA_PLACEHOLDER,
      }
    }
  }, rootTrie)
}

module.exports = {
  build,
  predict
}

