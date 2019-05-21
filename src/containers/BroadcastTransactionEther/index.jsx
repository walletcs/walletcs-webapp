import React, { useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { checkAddress, FileTransactionReader } from 'walletcs';
import { withStyles } from '@material-ui/core/styles';
import { utils } from 'ethers';
import { broadcastReducer, initStateBroadcast } from '../../reducers';
import Web3Context from '../../contexts/Web3Context';
import BroadcastWCS from '../../components/BroadcastWCS';
import GlobalReducerContext from '../../contexts/GlobalReducerContext';

import { styles } from './styles.js';


const BroadcastTransactionEther = ({ className, ...props }) => {
  const { classes } = props;
  const [state, dispatch] = useReducer(broadcastReducer, initStateBroadcast);
  const { stateGlobal, dispatchGlobal } = useContext(GlobalReducerContext);

  const { provider } = useContext(Web3Context);

  const onDelete = (index) => {
    dispatch({ type: 'delete_transaction', payload: index });
  };

  const handleLoadFile = (e) => {
    try {
      const parser = new FileTransactionReader(e.target.result);
      parser.parserFile();

      dispatch({ type: 'set_origin_transactions', payload: JSON.parse(e.target.result).transactions });
      dispatch({ type: 'set_table', payload: parser.transactions });

      const rows = [];
      for (const key in parser.transactions) {
        const contractAddress = parser.transactions[key].transaction.to;
        const methodName = parser.transactions[key].transaction.data.name || 'Transfer';
        rows.push({ contractAddress, methodName });
      }

      dispatch({ type: 'set_rows', payload: rows });
    } catch (e) {
      const msg = e.message ? e.message : e;
      dispatchGlobal({ type: 'set_global_error', payload: msg.split('(')[0] });
    }
  };

  const onAttachFile = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = e => handleLoadFile(e);
    if (!file.name.endsWith('.json')) {
      dispatchGlobal({ type: 'set_global_error', payload: 'File type is not correct' });
    } else {
      dispatch({ type: 'set_filename', payload: file.name });
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const onCloseModal = () => {
    dispatch({ type: 'set_modal_open' });
  };

  const onBroadcast = async (event) => {
    try {
      for (const key in state.originTransactions) {
        await provider.sendTransaction(state.originTransactions[key].transaction);
      }
      dispatchGlobal({ type: 'set_global_success', payload: 'Success send transactions.' });
    } catch (e) {
      const msg = e.message ? e.message : e;
      dispatchGlobal({ type: 'set_global_error', payload: msg.split('(')[0] });
    }
  };

  const onOpenModal = (index) => {
    const data = state.table[index];
    const formatedData = { details: [] };
    formatedData.contractAddress = data.transaction.to;

    const { transaction } = data;

    const parse = (data) => {
      const list = [];
      for (const key in data) {
        const obj = {};
        obj.key = data[key].name;
        obj.value = data[key].value;
        list.push(obj);
      }
      return list;
    };

    const params = parse(transaction.data.params);
    params.push({ key: 'gasLimit', value: transaction.gasLimit });
    params.push({ key: 'gasPrice', value: transaction.gasPrice });
    params.push({ key: 'nonce', value: transaction.nonce });
    if (transaction.value) params.push({ key: 'value', value: utils.formatEther(transaction.value) });
    formatedData.details = params;

    dispatch({ type: 'set_modal_data', payload: formatedData });
    dispatch({ type: 'set_modal_open' });
  };

  return (
      <BroadcastWCS
        classes={classes}
        onAttachFile={onAttachFile}
        onBroadcast={onBroadcast}
        onCloseModal={onCloseModal}
        onDelete={onDelete}
        onOpenModal={onOpenModal}
        parentState={state}/>
  );
};

BroadcastTransactionEther.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BroadcastTransactionEther);
