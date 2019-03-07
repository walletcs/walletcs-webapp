
export const styles = theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainerContractInput:{
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 46
  },
  
  inputContainerPublicKeyInput: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 46
  },
  header: {
    display: 'flex',
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginLeft: 20,
    marginTop: 20
  },
  input: {
    width: 468,
    height: 64
  },
  details:{
    height: 108
  },
  dropDown: {
    width: 956,
    height: 64,
    marginLeft: 20,
    marginTop: 80
  },
  button: {
    fontWeight: 'bold',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 20
  },
  result: {
    marginTop: 5
  },
  addTransaction: {
    '& a': {
      textDecoration: 'none',
      color: theme.palette.primary.main
    }
  },
  containerAddTransaction: {
    display: 'flex',
    justifyContent: 'start',
    alignSelf: 'center',
    width: 467,
    marginTop: 10
  },
  containerButtons: {
    display: 'flex',
    flexDirection: 'center',
    justifyContent: 'space-around'
  }
});
