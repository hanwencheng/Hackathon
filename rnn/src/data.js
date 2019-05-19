const { getCurrentPrice, getPriceList } = require('./dataFetcher');

let data = [];

const ComputeSMA = (data, window_size) =>
{
  let r_avgs = [], avg_prev = 0;
  for (let i = 0; i <= data.length - window_size; i++){
    let curr_avg = 0.00, t = i + window_size;
    for (let k = i; k < t && k <= data.length; k++){
      curr_avg += data[k]['price'] / window_size;
    }
    r_avgs.push({ set: data.slice(i, i + window_size), avg: curr_avg });
    avg_prev = curr_avg;
  }
  return r_avgs;
};

const generateOneData = (startTime = 0, windowSize) => {
  const result = {
    input: [],
    output: 0,
  };
  
  for (let i = 0; i <  windowSize; i ++){
    if(data.length < startTime + i) {
      const newList = getPriceList(i, 60); // each time fetch 60 data
      data = _.concat(data, newList);
    }
    result.input.push(data[i])
  }
  
  result.output = ComputeSMA(result.input, windowSize);
  return result;
};

const generateDataSets = (startTime, inputSize, windowSize) => {
  let inputs = [], outputs = [];
  for (let i = startTime; i < startTime + inputSize; i ++) {
    const { input, output} = generateOneData(i, windowSize);
    inputs.push(input);
    outputs.push(output);
  }
  return {
    inputs, outputs,
  }
};
