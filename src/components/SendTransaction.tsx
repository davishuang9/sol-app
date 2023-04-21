import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { FormEvent, useCallback, useState } from "react";
import { WalletIcon } from "@solana/wallet-adapter-material-ui";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addTransaction } from "@/src/reducers/transaction";

export default function SendTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const dispatch = useDispatch();

  const handleSendTransaction = useCallback(async (toAddressString: string, solAmount: number) => {
    if (!publicKey) throw new WalletNotConnectedError();

    const lamportsPerSol = await connection.getMinimumBalanceForRentExemption(0);
    const toPublicKey = new PublicKey(toAddressString);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: toPublicKey,
        lamports: solAmount * lamportsPerSol,
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight }
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, { minContextSlot });
    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

    return {
      signature
    };
  }, [publicKey, sendTransaction, connection]);

  const handleSubmit = async (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    const { address, amount } = event.target as typeof event.target & {
      address: { value: string; },
      amount: { value: number; },
    };
    // TODO: handle address validation here?
    console.log("handleSubmit", address.value, amount.value);

    let signature: string;
    try {
      const response = await handleSendTransaction(address.value, amount.value);
      signature = response.signature;
    } catch (e) {
      console.error(`Error: ${e}`);
      return;
    }

    const transactionData = {
      signature,
      amount: amount.value,
      from: publicKey,
      to: address.value
    };
    const response = await axios.post("/api/transaction", transactionData);
    dispatch(addTransaction(response.data));
    setIsLoading(false);
    setSignature(signature);
  };

  console.log((Keypair.generate().publicKey.toString()));
  return (
    <div>
      <div>
        <Typography variant="h5"><WalletIcon wallet={wallet} /> Send transaction </Typography><br /><br />
      </div>
      <form onSubmit={handleSubmit}>
        {/* TODO: validate the address */}
        <TextField label="Recipient address" name="address" />
        <br />
        <TextField label="Amount" name="amount" />
        <br /><br />
        {isLoading ?
          <LoadingButton
            loading
            loadingPosition="end"
            variant="contained"
          >
            Sending transaction&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </LoadingButton> :
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!publicKey}
          >
            Send transaction
          </Button>
        }
      </form>
      {signature ? (
        <Snackbar open={!!signature} autoHideDuration={6000} onClose={() => setSignature("")}>
          <Alert severity="success">
            Transaction sent! Explore it <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank">here</a>
          </Alert>
        </Snackbar>
      ) : null}
    </div>
  );
}
