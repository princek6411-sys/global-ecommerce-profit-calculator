import { Suspense } from 'react';
import ResultClient from './ResultClient';
export default function ResultPage(){ return <Suspense fallback={<main className="container section"><div className="card panel">Loading result…</div></main>}><ResultClient /></Suspense>; }
