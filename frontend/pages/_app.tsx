// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AICoPilot, { useCurrentPage } from '../components/AICoPilot/AICoPilot';
import { ConversationMemoryProvider } from '../contexts/ConversationMemoryContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OnboardingProvider>
      <ConversationMemoryProvider>
        <Component {...pageProps} />
        <AICoPilotWrapper />
      </ConversationMemoryProvider>
    </OnboardingProvider>
  );
}

function AICoPilotWrapper() {
  const currentPage = useCurrentPage();
  return <AICoPilot currentPage={currentPage} />;
}