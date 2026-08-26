import type { Metadata } from 'next';
import { PitchProContent } from './pitch-pro-content';

export const metadata: Metadata = {
  title: 'Pitch',
  description: 'Prova pitch deck: problem, solution, architecture, traction evidence, business model, and integrity practices — for any Solana ecosystem grant or fund reviewer.',
  robots: { index: false, follow: false },
};

export default function PitchProPage() {
  return <PitchProContent />;
}
