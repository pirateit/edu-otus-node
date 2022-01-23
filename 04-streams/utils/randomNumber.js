module.exports = getRandomNumber = (min = 0, max = 99999) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
