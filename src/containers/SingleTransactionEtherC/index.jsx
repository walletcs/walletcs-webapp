import React, {useContext} from 'react';
import cx from 'classnames';
import ContentCardWCS from "../../components/ContentCardWCS";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {CircularProgress, Typography} from "@material-ui/core";
import {checkAddress} from "walletcs";
import InputWCS from "../../components/InputWCS";
import ButtonWCS from "../../components/ButtonWCS";
import SnackbarWCS from "../../components/SnackbarWCS";
import {useContractInfo, useMethodInfo, downloadOneTransaction, RecalculateGasLimit} from './actionsSingleTransaction'
import Web3Context from '../../contexts/Web3Context'
import GlobalReducerContext from "../../contexts/GlobalReducerContext"

import {styles} from './styles'
import DetailInformation from "./DetailInformation";

const SingleTransactionEtherC = ({className, ...props}) => {
  const {classes} = props;
  const [state, dispatch] = useContractInfo();
  const {provider} = useContext(Web3Context);
  const [stateMethod, dispatchMethod] = useMethodInfo(state);
  const {stateGlobal, dispatchGlobal} = useContext(GlobalReducerContext);
  
  return (
      <>
        <ContentCardWCS
            className={cx(
                classes.content,
                className
            )}>
          <Typography
              className={classes.header}>
            Smart Contract Transaction
          </Typography>
          <div className={classes.inputContainer}>
            <InputWCS
                className={classes.input}
                isQuestion={true}
                label='Public key of a signatory *'
                value={stateMethod.publicKey}
                error={stateMethod.publicKey ? !checkAddress(stateMethod.publicKey): false}
                helperText={stateMethod.publicKey && !checkAddress(stateMethod.publicKey) ? 'Not correct address format': ''}
                onChange={e => {
                  dispatchMethod({type: 'set_public_key', payload: e.target.value})}
                }/>
            <InputWCS
                className={classes.input}
                label="Contract *"
                value={state.contractAddress}
                error={state.contractAddress ? !checkAddress(state.contractAddress): false}
                helperText={state.contractAddress && !checkAddress(state.contractAddress) ? 'Not correct address format': ''}
                onChange={e =>
                    dispatch({type: 'set_contract_address', payload: e.target.value})
                }/>
          </div>
          <DetailInformation
              dispatchMethod={dispatchMethod}
              state={state}
              stateMethod={stateMethod}
              recalculateButton={e => RecalculateGasLimit(state,
                  stateMethod, dispatchMethod, dispatchGlobal, provider)}/>
          <ButtonWCS
              className={classes.button}
              disabled={!(!!stateMethod.publicKey &&
                  !!state.contractAddress &&
                  stateMethod.methodType === 'transaction')}
              onClick={e => downloadOneTransaction(state, stateMethod)}>
            Download Transaction
          </ButtonWCS>
          
          {/*Error snackbar*/}
          {stateGlobal.error ?
              <SnackbarWCS
                  message={stateGlobal.error}
                  variant='error'
                  isOpen={true}
                  onClose={e => dispatchGlobal({type: 'set_global_error', payload: undefined})}/> : ''}
        </ContentCardWCS>
      </>
  )
};

SingleTransactionEtherC.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleTransactionEtherC);
