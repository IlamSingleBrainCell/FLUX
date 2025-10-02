import React from 'react';
import Head from 'next/head';
import { CodeReviewAssistant } from '../components/CodeReview/CodeReviewAssistant';
import { useCommandPalette } from '../components/CommandPalette/CommandPalette';

export default function CodeReviewPage() {
  useCommandPalette();

  return (
    <>
      <Head>
        <title>Code Review Assistant - FLUX Enterprise</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto">
          <CodeReviewAssistant />
        </div>
      </div>
    </>
  );
}
