import React, { useReducer, useState } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Web3Provider, ErrorTemplate } from 'react-web3';

import './App.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import WalletCSTheme from './themes';
import Header from './components/Header';
import Web3Context from './contexts/Web3Context';
import GlobalReducerContext from './contexts/GlobalReducerContext';
import RedirectMainNet from './components/RedirectMainNet';
import { globalReducer, initStateGlobal } from './reducers';
import { BITCOIN_LINKS, LINKS, ETHER_LINKS } from './links';

const Web3Unavailable = ErrorTemplate.bind(null, {
  title: 'MetaMask not found',
  message: `This website requires MetaMask plugin.
  Please download it from metamask.io .`,
});

const listCurrencies = ['ether', 'bitcoin'];

const getCurrentCurrency = () => {
  for (let i = 0; i < listCurrencies.length; i += 1) {
    if (window.location.pathname.indexOf(listCurrencies[i]) > -1) {
      return listCurrencies[i];
    }
  }
  return 'ether';
};

const App = () => {
  const [state, dispatch] = useReducer(globalReducer, initStateGlobal);
  const [stateCurrency, setCurrency] = useState(getCurrentCurrency());
  document.title = 'WalletCS';

  const handleCurrency = (val) => {
    setCurrency(val);
  };

  const initMetaMask = () => {
    const network = process.env.REACT_APP_ETH_NETWORK_SEND === 'rinkeby'
      ? 'https://rinkeby.infura.io/v3/15397ed5cc24454d92a27f16c5445692'
      : 'https://mainnet.infura.io/v3/15397ed5cc24454d92a27f16c5445692';
    try {
      const provider = new ethers.providers.JsonRpcProvider(network, 'rinkeby');
      return { provider };
    } catch (e) {
      return { provider: null };
    }
  };

  return (
        <Router>
          <div className="App">
            <div className="content">
            <GlobalReducerContext.Provider
                value={{
                  stateGlobal: state,
                  dispatchGlobal: dispatch,
                  currentCurrency: stateCurrency,
                }}>
              <Web3Context.Provider value={initMetaMask()}>
                <MuiThemeProvider theme={WalletCSTheme}>
                  <Header
                      handleCurrency={handleCurrency}
                      currentCurrency={stateCurrency}
                      links={LINKS}/>
                    {stateCurrency === 'ether'
                      ? <Switch>{ETHER_LINKS}</Switch>
                      : <Switch>{BITCOIN_LINKS}</Switch>}
                </MuiThemeProvider>
              </Web3Context.Provider>
            </GlobalReducerContext.Provider>
            </div>
            <RedirectMainNet />
          </div>
        </Router>
  );
};

export default App;
