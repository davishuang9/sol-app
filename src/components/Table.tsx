import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Autocomplete, TextField } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { SerializableTransaction } from "../pages/api/transaction";
import Fuse from "fuse.js";
import TransactionDetails from "./TransactionDetail";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { TransactionStateType, setAllTransactions, transactionStateComparator } from "@/src/reducers/transaction";

const COLUMNS: GridColDef[] = [
  { field: "signature", headerName: "Signature", width: 200 },
  { field: "amount", headerName: "Amount", width: 100 },
  { field: "createdAt", headerName: "Sent at", width: 300 },
  { field: "from", headerName: "From address", width: 500 },
  { field: "to", headerName: "To address", width: 500 },
];

const FUSE_OPTIONS = {
  keys: ["signature", "from", "to"]
};
const fuse = new Fuse([] as SerializableTransaction[], FUSE_OPTIONS);

export default function Table() {
  const { publicKey } = useWallet();
  // const [transactions, setTransactions] = useState<SerializableTransaction[]>([]);
  const transactions = useSelector((state: { transaction: TransactionStateType; }) => state.transaction.transactions, transactionStateComparator);
  // console.log("transactions", transactions);
  const dispatch = useDispatch();
  const [filteredTransactions, setFilteredTransactions] = useState<SerializableTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [transactionForDetail, setTransactionForDetail] = useState<SerializableTransaction | null>(null);

  useEffect(() => {
    if (!publicKey) {
      dispatch(setAllTransactions([]));
      setFilteredTransactions([]);
      setSearchText("");
      return;
    }

    const getTransactions = async () => {
      const response = await axios.get(`/api/transaction?publicKey=${publicKey}`);
      const _transactions = response.data;
      fuse.setCollection(_transactions);
      dispatch(setAllTransactions(_transactions));
      setFilteredTransactions(_transactions);
      setIsLoading(false);
    };
    getTransactions();
  }, [publicKey, transactions]);

  useEffect(() => {
    if (searchText.length > 0) {
      console.log("searching for", searchText);
      const results = fuse.search(searchText).map(result => result.item);
      setFilteredTransactions(results);
    }
  }, [searchText, setFilteredTransactions]);

  const handleRowClick = ({ row: { id } }: { row: { id: string; }; }) => {
    const transaction = transactions.find((t) => (t.id === id));
    if (transaction) setTransactionForDetail(transaction);
  };

  const handleDetailClose = () => {
    setTransactionForDetail(null);
  };

  // console.log("filteredTransactions", filteredTransactions);
  return (
    <div>
      {/* TOOD: improve autocomplete options with some kind of fuzzy search with search score */}
      <Autocomplete
        disablePortal
        options={transactions.flatMap((transaction: SerializableTransaction) => ([
          { label: transaction.signature },
          { label: transaction.from },
          { label: transaction.to }
        ]))}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search for transactions" />}
        onChange={(_: any, value) => { if (value !== null) setSearchText(value.label); }}
      />
      <DataGrid
        rows={filteredTransactions}
        columns={COLUMNS}
        autoHeight
        loading={!!publicKey && isLoading}
        onRowClick={handleRowClick}
      />
      <TransactionDetails transaction={transactionForDetail} isOpen={!!transactionForDetail} handleClose={handleDetailClose} />
    </div>
  );
}
