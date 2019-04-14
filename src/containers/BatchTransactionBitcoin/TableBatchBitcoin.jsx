import React, { useState} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {Button} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { checkBitcoinAddress, FileTransactionGenerator, BitcoinTransaction} from "walletcs"
import {downloadFile } from "../SingleTransactionEtherC/actionsSingleTransaction";
import ContentCardWCS from "../../components/ContentCardWCS";
import TableWCS from "../../components/TableWCS";
import ButtonWCS from "../../components/ButtonWCS";
import ModalWrappedWCS from "../../components/ModalWCS"

const styles = theme => ({});

const TableBatchBitcoin = ({className, ...props}) => {
  const {classes, stateParent, dispatchParent} = props;
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  
  const onCloseModal = () => {
    setModalIsOpen(false)
  };
  
   const downloadBatchTransaction = async () => {
     let fileGenerator = new FileTransactionGenerator(stateParent.from_address);
     let bttx = new BitcoinTransaction(stateParent.from_address); // TODO: Change network to the main network
     
     for(let key in stateParent.table){
       let transaction = await bttx.createTx(stateParent.amount, stateParent.to_address);
       fileGenerator.addTx(null, transaction);
     }
     
     downloadFile('bt-', fileGenerator.generateJson())
   };
  
  const onOpenModal = (index) => {
    let data = stateParent.table[index];
    let formatedData = {details: []};
    formatedData.contractAddress = data.contractAddress;
  
    for(let key in data.params){
      let obj = {};
      obj['key'] = data.params[key].name;
      obj['value'] = data.params[key].value;
      formatedData.details.push(obj)
    }
  
    setModalData(formatedData);
    setModalIsOpen(true)
  };
  
  const onDelete = (index) => {
    dispatchParent({type: 'delete_from_table', payload: index});
  };
  
  return (
      <ContentCardWCS
          className={cx(
              classes.content,
              className
          )}>
        <div className={classes.inputContainer}>
          {/*<InputWCS*/}
              {/*key="from-batch"*/}
              {/*className={classes.input}*/}
              {/*isQuestion={true}*/}
              {/*label='from'*/}
              {/*value={stateParent.from_address}*/}
              {/*error={stateParent.from_address ? !checkBitcoinAddress(stateParent.from_address): false}*/}
              {/*helperText={stateParent.from_address && !checkBitcoinAddress(stateParent.from_address) ? 'Not correct address format': ''}*/}
              {/*onChange={e => {*/}
                {/*dispatchParent({type: 'set_from', payload: e.target.value})}*/}
              {/*}/>*/}
          
          <TableWCS
              headers={['CONTRACT', 'METHOD']}
              rows={stateParent.table}
              isDelete={true}
              onDelete={onDelete}
              onClick={onOpenModal}/>
          
          <div className={classes.containerAddTransaction}>
            <Button
                color="secondary"
                onClick={props.onAddTransation}>
              Add Transaction
            </Button>
          </div>
          
          <ButtonWCS
              className={classes.button}
              disabled={!(!!stateParent.from_address && !!stateParent.table.length)}
              onClick={downloadBatchTransaction}>
            Download Transactions
          </ButtonWCS>
        </div>
        {modalIsOpen ? <ModalWrappedWCS
            isOpen={modalIsOpen}
            onClose={onCloseModal}
            data={{header: 'Transaction information', details: modalData}}/>: '' }
      </ContentCardWCS>
  )
};

TableBatchBitcoin.propTypes = {
  classes: PropTypes.object.isRequired,
  stateParent: PropTypes.object.isRequired,
  dispatchParent: PropTypes.object.isRequired
};

export default withStyles(styles)(TableBatchBitcoin);
