import React, {useContext} from "react";
import cx from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import InputWCS from "../../components/InputWCS";
import ButtonWCS from "../../components/ButtonWCS";
import ContentCardWCS from "../../components/ContentCardWCS";
import DetailInformation from "../SingleTransactionEtherC/DetailInformation"
import {checkAddress, isAddingTransaction} from 'walletcs';
import Web3Context from "../../contexts/Web3Context";
import GlobalReducerContext from "../../contexts/GlobalReducerContext";
import {recalculateGasLimit} from "../SingleTransactionEtherC/actionsSingleTransaction";


const DEFAULT_SETTING = {
  root: 'root'
};

const styles = theme => ({
  default: {
  
  }
});

const AddTransactionEther = ({className, ...props}) => {
  const {classes, stateContract, dispatchContract, stateMethod, dispatchMethod} = props;
  const {provider} = useContext(Web3Context);
  const {dispatchGlobal} = useContext(GlobalReducerContext);
  
  return (
      <ContentCardWCS
          className={cx(
              classes.content,
              className
          )}>
        <div className={classes.inputContainer}>
          <InputWCS
              key='contractInput'
              className={classes.input}
              label="Contract"
              value={stateContract.contractAddress}
              error={stateContract.contractAddress ? !checkAddress(stateContract.contractAddress): false}
              helperText={stateContract.contractAddress && !checkAddress(stateContract.contractAddress) ? 'Not correct address format': ''}
              onChange={e =>
                  dispatchContract({type: 'set_contract_address', payload: e.target.value})
              }/>
          <DetailInformation
              stateMethod={stateMethod}
              stateContract={stateContract}
              dispatchMethod={dispatchMethod}
              recalculateButton={e =>
                  recalculateGasLimit(stateContract, stateMethod, dispatchMethod, dispatchGlobal, provider)}/>
          <div className={classes.containerButtons}>
            <ButtonWCS
                className={classes.button}
                disabled={!(!!stateContract.contractAddress && !!stateMethod.methodName && !!stateMethod.methodParams.length)}
                onClick={e => {
                  dispatchContract(
                      {type: 'add_to_table',
                        payload: {
                          contractAddress: stateContract.contractAddress,
                          methodName: stateMethod.methodName,
                          params: stateMethod.methodParams,
                          abi: stateContract.abi}}
                  );
                  props.onCancel(e)
                }}>
              Save
            </ButtonWCS>
            <ButtonWCS
                className={classes.button}
                onClick={props.onCancel}>
              Cancel
            </ButtonWCS>
          </div>
        </div>
      </ContentCardWCS>
  )
};

AddTransactionEther.propTypes = {
  classes: PropTypes.object.isRequired,
  stateContract: PropTypes.object.isRequired,
  dispatchContract: PropTypes.object.isRequired,
  stateMethod: PropTypes.object.isRequired,
  dispatchMethod: PropTypes.object.isRequired,
  onCancel: PropTypes.object.isRequired
};

export default withStyles(styles)(AddTransactionEther);
