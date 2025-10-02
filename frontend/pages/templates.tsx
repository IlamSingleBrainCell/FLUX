import React from 'react';
import Head from 'next/head';
import { TemplatesAndSnippets } from '../components/Templates/TemplatesAndSnippets';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';

export default function TemplatesPage() {
  useCommandPalette();

  return (
    <>
      <Head>
        <title>Templates & Snippets - FLUX Enterprise</title>
      </Head>

      <TemplatesAndSnippets />
    </>
  );
}
