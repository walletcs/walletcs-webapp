import { ethers } from 'ethers';
import { Transaction, address } from 'bitcoinjs-lib';
import { InfuraProvider } from '@exiliontech/walletcs-lib-ext';
import * as _ from 'lodash';

const GAS_LIMIT = 21000;

export function checkEtherAddress(address) {
  if (!address) {
    return false;
  }
  const re = /^0x[A-Fa-f0-9]{40}$/i;

  return re.test(address);
}

export function checkEtehrPrivateKey(key) {
  try {
    new ethers.utils.SigningKey(key);
  } catch (e) {
    return false;
  }
  return true;
}

export const checkBitcoinAddress = (address) => {
  if (address.length < 26 || address.length > 35) {
    return false;
  }
  const re = /^[A-Z0-9]+$/i;

  return re.test(address);
};

export const addressIsMainNet = (address) => {
  const prefixes = ['1', '3', 'xpub', 'bc1'];
  for (let i = 0; i < prefixes.length; i += 1) {
    if (address.startsWith(prefixes[i])) {
      return true;
    }
  }
  return false;
};

export const privateKeyIsMainNet = (pr) => {
  const prefixes = ['K', 'L', '5', 'xprv'];
  for (let i = 0; i < prefixes.length; i += 1) {
    if (pr.startsWith(pr[i])) {
      return true;
    }
  }
  return false;
};

export const combineFromObjec = (fromAddress, changeAddress) => _.map(fromAddress, from => ({ address: from, change: from === changeAddress }));

export const combineToObject = (toAddresses, amounts) => _.map(toAddresses, (to, index) => ({ address: to, amount: amounts[index] ? amounts[index] : 0 }));

export const getBitcoinOutxs = async (fromAddresses, provider) => {
  const uniqFromAddresses = _.uniq(fromAddresses);

  const result = await Promise.all(uniqFromAddresses.map(async from => {
    return await provider.getOutxs(from);
  }));

  return Array.prototype.concat.apply([], result);

};

const onRedirectToEtherscan = (address) => {
  if (!address) return;
  const network = process.env.REACT_APP_ETH_NETWORK_SEND === 'rinkeby' ? 'rinkeby.' : '';
  window.open(`https://${network}etherscan.io/address/${address}`, '_blank');
};

const onRedirectToEtherscanTx = (address) => {
  if (!address) return;
  const network = process.env.REACT_APP_ETH_NETWORK_SEND === 'rinkeby' ? 'rinkeby.' : '';
  window.open(`https://${network}etherscan.io/tx/${address}`, '_blank');
};

const onRedirectToBlockcypher = (address) => {
  if (!address) return;
  const network = process.env.REACT_APP_BITCOIN_NETWORK === 'BTC_TESTNET' ? 'btc-testnet' : 'btc';
  window.open(`https://live.blockcypher.com/${network}/address/${address}/`, '_blank');
};

const CurrencyViewiers = {
  ether_tx: { text: 'View tx on etherscan', redirect: onRedirectToEtherscanTx },
  ether: { text: 'View on etherscan', redirect: onRedirectToEtherscan },
  bitcoin: { text: 'View on blockcypher', redirect: onRedirectToBlockcypher },
};

export const parserBitcoinFile = (file) => {
  const json = JSON.parse(file);

  // Decode all transaction from file
  const { transactions } = json;

  const arrr = transactions.map((rawTx) => {
    const tx = Transaction.fromHex(rawTx);

    const params = tx.outs.map((out) => {
      let to;

      try {
        to = address.fromOutputScript(out.script);
      } catch (e) {
        console.warn(e);
      }

      return { value: out.value, to };
    });

    return { contract: null, transaction: tx, params };
  });

  return arrr;
};

export const parserEtherFile = (file) => {
  const json = JSON.parse(file);
  
  // Decode all transaction from file
  const transactions = [];
  _.each(json.transactions, (rawTx) => {
    const tx = ethers.utils.parseTransaction(rawTx);

    if (tx.data !== '0x') {
      const abi = json.contracts.find(obj => obj.address === tx.to).abi;
      InfuraProvider.addABI(abi);
      tx.data = InfuraProvider.decodeMethod(tx.data);
    }
    transactions.push({ contract: tx.to, transaction: tx });
  });
  return transactions;
};


const decimal = /^[-+]?[0-9]+\.[0-9]+$/;

export const isDecimal = val => val.match(decimal);

export default CurrencyViewiers;
