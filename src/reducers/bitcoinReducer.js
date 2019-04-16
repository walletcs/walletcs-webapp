export const initStateBitcoin = {
  from_address: null,
  to_address: null,
  amount: 0,
  table: []
};

export const bitcoinReducer = (state, action) => {
  switch (action.type) {
    case 'set_from':
      return ({...state, from_address: action.payload});
    case 'set_to':
      return ({...state, to_address: action.payload});
    case 'set_amount':
      return ({...state, amount: action.payload});
    case 'set_table':
      return ({...state, table: action.payload});
    case 'add_to_table':
      let table = state.table;
      table.push(action.payload);
      return {...state, table:  table};
    case 'delete_from_table':
      table = state.table;
      table.splice(action.payload, 1);
      return {...state, table: table};
  }
};
