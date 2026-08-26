import type { Metadata } from 'next';
import { PitchContent } from './pitch-content';

export const metadata: Metadata = {
  title: 'Pitch M6/M7',
  description: 'Borrador de pitch para los milestones M6 (Pitch, 28-ago-2026) y M7 (Demo Day, 31-ago-2026) del programa Solana Latam Labs / WayLearn.',
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <PitchContent />;
}
