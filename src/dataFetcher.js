/** Currently this module use mock data with user maxDelay and penaltyRation **/
const axios = require(axios);

const getCurrentTime = () => 1;

const getCurrentPrice = (timeId) => axios.get(`http://localhost:8082/get_price?time=${timeId}`);

const getMaxDelay = () => 10;

const getPenaltyRation = () => 11;

module.exports = {
  getCurrentPrice,
  getCurrentTime,
  getMaxDelay,
  getPenaltyRation,
}