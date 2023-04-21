import { SerializableTranaction } from "@/src/pages/api/transaction";
import { Box, Modal, Typography } from "@mui/material";
import { ReactEventHandler } from "react";

export default function TransactionDetails({ transaction, isOpen, handleClose }: { transaction: SerializableTranaction | null; isOpen: boolean; handleClose: ReactEventHandler; }) {
  const nonNullTransaction = transaction || {};
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "fit-content",
        height: "fit-content",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <div>
          <Typography variant="h6" gutterBottom>
            Transaction details
          </Typography>
          {Object.entries(nonNullTransaction).map((entry: any) => (
            <Typography variant="body1" gutterBottom>
              {entry[0]}: {entry[1]}
            </Typography>
          ))}
          <Typography variant="caption" gutterBottom>
            See more details <a href={`https://explorer.solana.com/tx/${transaction?.signature}?cluster=devnet`} target="_blank">here</a>
          </Typography>
        </div>
      </Box>
    </Modal>
  );
};
