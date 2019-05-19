const oneTime = require('./model');
const config = require('./config');
const t = require('./strings')
const dataFetcher = require('./dataFetcher')
const _ =  require('lodash')

/** There will be multiple ways to build the leave node, here we use the average value for it **/
const buildLeaveNode = (leaveNode, calculateResult) => {
  if(!leaveNode.hasOwnProperty("value")){
    return {
      value: {
        [t.MAX_BID]: calculateResult[t.MAX_BID],
        [t.ACCEPT_DELAY]: calculateResult[t.ACCEPT_DELAY],
      },
      times: 1
    }
  } else{
    const {value, times} = leaveNode.value
    return {
      value: _.map(value, (value, key)=> (value * times + calculateResult[key]) / (times + 1)), //calculate Average
      times: times + 1,
    }
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

const build = (maxDelay) => {
  let sumPayment = 0, sumSuccess = 0, sumFailure = 0;
  let priceList = []
  const rootTrie = {};
  // construct CNN model
  for (let i = 0; i < config.learnArrange; i++) {
    if(i < maxDelay) continue;
    
    const calculateResult = oneTime(sumPayment, sumSuccess, sumFailure)
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

const predict = (price) => {

}

