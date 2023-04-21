import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SerializableTransaction } from '@/src/pages/api/transaction';

export type TransactionStateType = {
  transactions: SerializableTransaction[];
};

// TODO: ideally not storing the whole transaction body in the state but just ID
const initialState: TransactionStateType = {
  transactions: []
};

// TODO: optimize state comparison
export function transactionStateComparator(a: SerializableTransaction[], b: SerializableTransaction[]) {
  const aSet = new Set(a.map((t: SerializableTransaction) => t.id));
  const bSet = new Set(b.map((t: SerializableTransaction) => t.id));
  const isEqual = aSet.size === bSet.size && Array.from(aSet).every((x) => bSet.has(x));
  return isEqual;
}

// TODO: add other actions; e.g. removing a transaction
export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<SerializableTransaction>) {
      state.transactions.push(action.payload);
    },
    setAllTransactions(state, action: PayloadAction<SerializableTransaction[]>) {
      state.transactions = action.payload;
    }
  },
});

export const { addTransaction, setAllTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
