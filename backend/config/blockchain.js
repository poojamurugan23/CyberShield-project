// SIMULATED BLOCKCHAIN
let chain = [];

const addBlock = (data) => {
  const block = {
    id: chain.length + 1,
    data,
    timestamp: Date.now(),
  };
  chain.push(block);
  return block;
};

module.exports = { addBlock, chain };