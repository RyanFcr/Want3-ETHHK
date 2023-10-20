const {Web3} = require('web3');
const fs = require('fs');
// var Contract = require('web3-eth-contract');

var web3 = new Web3('https://ethereum-holesky.publicnode.com');
var contractABI = JSON.parse(fs.readFileSync('../ContractABI.json', 'utf8'));
var contractAddress = '0xbef40f131a17b916a82239cfefafe1487fa54b49'; // 替换为你的智能合约地址
var contract = new web3.eth.Contract(contractABI, contractAddress);

console.log(contract)

const methodName = 'donateFund'; // 替换为你的合约方法名
const methodArguments = ['0x4F1A18E83ABFB281Cc2af30BaFd513a3192AFA36',1.5]; // 替换为你的方法参数
const res = '';
contract.methods[methodName](...methodArguments).call((error, result) => {
  if (error) {
    console.error('Error:', error);
    return error
  } else {
    console.log('Result:', result);
  }
});
