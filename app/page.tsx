'use client'
import { useState } from 'react'

export default function Page() {
  const [s, setS] = useState({ price: 29.99, cost: 8, ship: 3.5, fees: 15, ads: 6, returns: 2 })
  const profit = s.price - s.cost - s.ship - (s.price * s.fees / 100) - s.ads - (s.price * s.returns / 100)
  const margin = s.price? (profit / s.price) * 100 : 0
  const update = (k: string, v: number) => setS({...s, [k]: v})

  return (
    <main className="min-h-screen bg-[#f6f6f6] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">ProfitPilot</h1>
          <div className="bg-black text-white px-4 py-2 rounded-full text-sm">Profit: ${profit.toFixed(2)} | {margin.toFixed(1)}%</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-4">Product Costs</h2>
            <div className="space-y-4">
              {[
                ['Selling Price ($)', 'price'],
                ['Product Cost ($)', 'cost'],
                ['Shipping Cost ($)', 'ship'],
                ['Platform Fees (%)', 'fees'],
                ['Ad Cost per Sale ($)', 'ads'],
                ['Return Rate Loss (%)', 'returns'],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{label}</span>
                  <input type="number" value={(s as any)[key]} onChange={e=>update(key, Number(e.target.value))} className="w-28 border rounded-lg p-2 text-right font-bold" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black text-white rounded-2xl p-6">
            <p className="text-gray-400 text-sm">Net Profit</p>
            <p className="text-4xl font-black mt-2">${profit.toFixed(2)}</p>
            <p className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold ${margin>20?'bg-green-500':'bg-red-500'}`}>{margin.toFixed(1)}% Margin</p>
            <div className="mt-6 text-sm text-gray-400 space-y-2">
              <div className="flex justify-between"><span>Revenue</span><span className="text-white">${s.price}</span></div>
              <div className="flex justify-between"><span>Total Cost</span><span className="text-white">${(s.price-profit).toFixed(2)}</span></div>
            </div>
            <div className="mt-6 bg-white text-black text-center py-3 rounded-xl font-bold">{profit>0?'✅ PROFITABLE':'❌ LOSS'}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
