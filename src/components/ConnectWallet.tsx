import { WalletDialogProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import { useEffect, useState } from "react";

export default function ConnectWallet() {
  // wrapper to prevent wallet adapter components from rendering until after first render
  // workaround to prevent hydration error (SSR != first render error) due to wallet connection state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) setIsLoading(false);
  }, [isLoading]);

  return !isLoading ? (
    <WalletDialogProvider>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </WalletDialogProvider>
  ) : <div>Loading...</div>;
}
