const _ = require('lodash')

const config = {
  learnArrange : 100,
};

const getCurrentTime = () => 1;

const getCurrentPrice = (timeId) => 100;

const getSumSuccessFul = () => 0;

const getMaxDelay = () => 10;

const getPenaltyRation = () => 2;

const calculateTotalCostSuccess = (sum_payment, currentPrice, sum_successful, sum_penalty) => {
  const average = (sum_payment + currentPrice) / sum_successful;
  return (sum_payment + currentPrice) + average * sum_penalty;
};

const calculateTotalCostFail = (sum_payment, currentPrice, sum_num, sum_penalty) => {
  const average = sum_payment / sum_num;
  return sum_payment + average * (sum_penalty + getPenaltyRation())
};

//accroding to our math formation[failureBid.png]:
const calculateBidWhenFailure = (totalCost, sum_payment, sum_successful, sum_penalty) => {
  const constantPart = sum_payment * sum_penalty / (sum_successful + 1) + sum_payment
  const restPart = totalCost - constantPart
  return (restPart - 1) * (sum_successful + 1) / sum_penalty
};

const buildTrie = (maxBid, acceptDelay, isSuccess, priceList, rootTrie) => {
  priceList.reduce((currentRoot, price) => {
    const propName = `${price}_${isSuccess}`;
    if(!currentRoot.hasOwnProperty(propName)){
      currentRoot[propName] = {
        maxBid,
        acceptDelay,
        isSuccess,
      }
    } else {
      //this should never happen!;
      debugger;
    }
    return currentRoot[propName]
  }, rootTrie )
};

const getBestResult = (trie) => {

};

const buildPredictor = () => {

};

const main = () => {
  let sumPayment = 0, sumSuccess = 0, sumFailure = 0;
  for (let i = 0; i < config.learnArrange; i++) {
    const calculateResult = oneTime(sumPayment, sumSuccess, sumFailure)
    sumPayment += calculateResult.maxBid;
    calculateResult.isSuccess ? sumSuccess++ : sumFailure++
  }
  buildPredictor()
};

const oneTime = (parentSumPayment = 0, parentSumSuccess = 0, parentSumFailure = 0) => {
  
  let sumPayment = 0, sumSuccessful = 0, sumFailure = 0, trie = {};
  const priceList = [];
  
  for (let j = 0; j < getMaxDelay(); j++) {
    const currentTime = getCurrentTime() + j;
    const currentPrice = getCurrentPrice(currentTime);
    priceList.push(currentPrice);
    const sumPenalty = (parentSumFailure + sumFailure) * getPenaltyRation();
    const successCost = calculateTotalCostSuccess(parentSumPayment + sumPayment, parentSumSuccess + sumSuccessful, currentPrice, sumPenalty);
    const failureCost = calculateTotalCostFail(parentSumPayment + sumPayment, parentSumSuccess + sumSuccessful, currentPrice, sumPenalty);
    if(successCost > failureCost){
      buildTrie(currentPrice, j, true, priceList, trie);
      sumPayment += currentPrice;
      sumSuccessful ++;
    } else {
      //if failed, it only worth to send the transaction only if the max_bid is at this number
      buildTrie(calculateBidWhenFailure(failureCost), j, false, priceList, trie);
      sumFailure ++
    }
  }
  
  // return value would have three property: maxBid, acceptDelay, isSuccess
  return getBestResult(trie);
};

