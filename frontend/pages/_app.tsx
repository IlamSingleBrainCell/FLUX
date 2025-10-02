// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AICoPilot, { useCurrentPage } from '../components/AICoPilot/AICoPilot';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <AICoPilotWrapper />
    </>
  );
}

function AICoPilotWrapper() {
  const currentPage = useCurrentPage();
  return <AICoPilot currentPage={currentPage} />;
}