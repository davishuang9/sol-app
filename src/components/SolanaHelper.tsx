import ConnectWallet from "@/src/components/ConnectWallet";
import SendTransaction from "@/src/components/SendTransaction";
import { Box, Button, Modal } from "@mui/material";
import { WalletIcon } from "@solana/wallet-adapter-material-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function SolanaHelper() {
  const [isOpenSendTransaction, setIsOpenSendTransaction] = useState(false);
  const openSendTransaction = () => setIsOpenSendTransaction(true);
  const closeSendTransaction = () => setIsOpenSendTransaction(false);

  const { publicKey, wallet } = useWallet();
  return (
    <div>
      <ConnectWallet />
      <Button
        color="primary"
        variant="contained"
        type="button"
        startIcon={<WalletIcon wallet={wallet} />}
        onClick={openSendTransaction}
        disabled={!wallet}
      >
        Send Solana
      </Button>
      <Modal
        open={isOpenSendTransaction && !!publicKey}
        onClose={closeSendTransaction}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 300,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <SendTransaction />
        </Box>
      </Modal>
    </div>
  );
}
