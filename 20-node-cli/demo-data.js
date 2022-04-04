const user = {
  username: 'petrovich',
  password: '$2a$10$xxyPuJOzt9/Mln4kFjR0juuRvP4RQ.5smg37Mu8oC/u6h7nBxrtqO',
};

const londonIpAddresses = [
  '137.136.75.241',
  '23.36.33.218',
  '67.181.143.163',
  '57.28.254.131',
  '218.52.33.230',
  '244.164.164.76',
  '98.70.14.9',
  '90.9.125.183',
  '11.22.203.52',
  '182.61.248.232',
];

const moscowIpAddresses = [
  '13.193.215.181',
  '89.64.137.36',
  '138.49.197.118',
  '210.240.214.196',
];

const cities = [{
  title: 'London',
  addresses: londonIpAddresses,
}, {
  title: 'Moscow',
  addresses: moscowIpAddresses,
}];

module.exports = {
  user,
  cities,
};
