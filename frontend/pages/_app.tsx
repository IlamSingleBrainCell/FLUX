// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AICoPilot, { useCurrentPage } from '../components/AICoPilot/AICoPilot';
import { ConversationMemoryProvider } from '../contexts/ConversationMemoryContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConversationMemoryProvider>
      <Component {...pageProps} />
      <AICoPilotWrapper />
    </ConversationMemoryProvider>
  );
}

function AICoPilotWrapper() {
  const currentPage = useCurrentPage();
  return <AICoPilot currentPage={currentPage} />;
}