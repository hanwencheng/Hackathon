# Longhash Hackathon Challenge 2

## Branch Predicting

### QuickStart

##### Build

Build the predictor with the build function:

```javascript
build(3, 1000)
```

that means we will start build our predictor start from time 3 to time 1003.

first param is the start time, second param is the window size. They are both optional.

##### Predict

Currently, we made the input to be the same length of the max_delay, which may be changed in
the future.

For example, we want to predict the max_bid and accept_delay at time 1011,
 we start with a input array of 5, which is the previous price at [1006, 1007, 1008, 1009, 1010]

```javascript
predict([5,4, 11, 5, 7])
```


## RNN

### Quick Start




