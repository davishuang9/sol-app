import '@/src/styles/globals.css';
import type { AppProps } from 'next/app';
import SolanaWalletProvider from '@/src/components/SolanaWalletProvider';
import { Provider } from 'react-redux';
import store from '@/src/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaWalletProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SolanaWalletProvider>
  );
}
