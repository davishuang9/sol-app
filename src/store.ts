import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './reducers/transaction';

export default configureStore({
  reducer: {
    transaction: transactionReducer
  },
});
