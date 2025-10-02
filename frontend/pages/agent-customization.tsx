import React from 'react';
import Head from 'next/head';
import { AgentCustomizationStudio } from '../components/AgentCustomization/AgentCustomizationStudio';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';

export default function AgentCustomizationPage() {
  useCommandPalette();

  return (
    <>
      <Head>
        <title>Agent Customization - FLUX Enterprise</title>
      </Head>

      <AgentCustomizationStudio />
    </>
  );
}
