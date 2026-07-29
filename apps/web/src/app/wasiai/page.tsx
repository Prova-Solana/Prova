import type { Metadata } from 'next';
import { WasiaiContent } from './wasiai-content';

export const metadata: Metadata = {
  title: 'Prova × wasiai',
  description: 'Verifiable behavior traceability for every agent in the wasiai marketplace.',
};

export default function WasiaiPage() {
  return <WasiaiContent />;
}
