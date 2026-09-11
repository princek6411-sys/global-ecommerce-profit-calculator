'use client';
import Link from 'next/link';
import { useState } from 'react';

const initial=[['Temu Profit Calculator',0,'Planned'],['Walmart Canada',0,'Planned'],['GST Calculator India',0,'Completed'],['Amazon Returns Simulator',0,'Under Review']];

export default function Page(){
  const [items,setItems]=useState(initial);
  return <main className="container section"><div className="card panel" style={{maxWidth:900,margin:'40px auto'}}><span className="eyebrow">Public roadmap</span><h1>Feature Roadmap</h1><p className="section-copy">Vote on what should be added next. Votes are stored locally in this MVP and are not presented as global usage statistics.</p><div className="vote-list">{items.map((x,i)=><div className="vote-item" key={x[0] as string}><div><strong>{x[0]}</strong><div className="input-note">{x[2]}</div></div><button className="small-btn" onClick={()=>setItems(v=>v.map((it,j)=>j===i?[it[0],Number(it[1])+1,it[2]]:it))}>👍 {x[1]} local votes</button></div>)}</div><div className="cta-row"><Link className="btn primary" href="/">Back to calculator</Link></div></div></main>;
}
