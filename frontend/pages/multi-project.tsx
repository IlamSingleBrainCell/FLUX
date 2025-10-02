import React from 'react';
import Head from 'next/head';
import { MultiProjectWorkspace } from '../components/MultiProject/MultiProjectWorkspace';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';

export default function MultiProjectPage() {
  useCommandPalette();

  return (
    <>
      <Head>
        <title>Multi-Project Workspace - FLUX Enterprise</title>
      </Head>

      <MultiProjectWorkspace />
    </>
  );
}
