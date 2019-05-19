const _ = require('lodash')
const {
  getCurrentPrice,
  getMaxDelay,
  getPenaltyRation
} = require('./dataFetcher')
const t = require('./strings')

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

const oneTime = (startTime = 0, parentSumPayment = 0, parentSumSuccess = 0, parentSumFailure = 0) => {
  
  let resultList = [];
  
  for (let j = 0; j < getMaxDelay(); j++) {
    const currentTime = startTime + j;
    const currentPrice = getCurrentPrice(currentTime);
    const sumPenalty = parentSumFailure * getPenaltyRation();
    const successCost = calculateTotalCostSuccess(parentSumPayment, parentSumSuccess, currentPrice, sumPenalty);
    const failureCost = calculateTotalCostFail(parentSumPayment, parentSumSuccess, currentPrice, sumPenalty);
    resultList.push({
      [t.ACCEPT_DELAY]: j,
      [t.MAX_BID]: currentPrice,
      [t.IS_SUCCESS]: true,
      [t.TOTAL_COST]: successCost
    })
    resultList.push({
      [t.ACCEPT_DELAY]: j,
      [t.MAX_BID]: calculateBidWhenFailure(failureCost),
      [t.IS_SUCCESS]: false,
      [t.TOTAL_COST]: failureCost
    })
  }
  
  // get the max_bid and accept_delay with minimum totalCost
  // return value would have three property: maxBid, acceptDelay, isSuccess
  return resultList.reduce((result, current)=> {
    if(result.hasOwnProperty(t.TOTAL_COST) && result[t.TOTAL_COST] < current[t.TOTAL_COST]){
      return result
    }
    return current;
  }, {})
};

module.exports = oneTime;
