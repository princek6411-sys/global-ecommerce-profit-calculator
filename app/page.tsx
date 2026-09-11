'use client'
import { useState } from 'react'

export default function Page() {
  const [price, setPrice] = useState(25)
  const [cost, setCost] = useState(8)
  const [ads, setAds] = useState(5)
  const [ship, setShip] = useState(2)
  const profit = price - cost - ads - ship
  const margin = price > 0 ? (profit/price)*100 : 0
  return (
    <main className="min-h-screen bg-white text-black p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-black text-xl">ProfitPilot</h1>
        <p>Profit: ${profit.toFixed(2)} | {margin.toFixed(1)}%</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} className="border p-2 rounded" />
          <input type="number" value={cost} onChange={e=>setCost(Number(e.target.value))} className="border p-2 rounded" />
          <input type="number" value={ads} onChange={e=>setAds(Number(e.target.value))} className="border p-2 rounded" />
          <input type="number" value={ship} onChange={e=>setShip(Number(e.target.value))} className="border p-2 rounded" />
        </div>
        <div className="mt-6 bg-black text-white p-4 rounded-xl">
          Net: ${profit.toFixed(2)} | {margin.toFixed(1)}%
        </div>
      </div>
    </main>
  )
}
