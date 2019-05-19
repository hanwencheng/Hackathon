/** Currently this module use mock data with user maxDelay and penaltyRation **/
const axios = require(axios);

const getCurrentPrice = (timeId) => axios.get(`http://localhost:8082/get_price?time=${timeId}`).then(data=> {
  const priceString = JSON.parse(data).Price;
  return parseFloat(priceString);
});

const getPriceList = (startTime, windowSize) => {
  const result = [];
  for (let i = startTime; i < startTime + windowSize; i ++) {
    result.push(getCurrentPrice(i))
  }
  return result;
};

module.exports = {
  getCurrentPrice,
};