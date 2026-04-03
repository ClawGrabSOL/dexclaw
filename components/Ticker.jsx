'use client';
import { useEffect, useState } from 'react';

const COINS = [
  { id: 'bitcoin',  symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana',   symbol: 'SOL' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'the-open-network', symbol: 'TON' },
  { id: 'avalanche-2', symbol: 'AVAX' },
  { id: 'chainlink', symbol: 'LINK' },
  { id: 'uniswap',  symbol: 'UNI' },
];

function fmtPrice(n) {
  const num = parseFloat(n);
  if (num >= 1000) return '$' + num.toLocaleString('en', { maximumFractionDigits: 0 });
  if (num >= 1)    return '$' + num.toFixed(2);
  return '$' + num.toFixed(4);
}

export default function Ticker() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const ids = COINS.map(c => c.id).join(',');
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
      .then(r => r.json())
      .then(data => {
        const result = COINS.map(c => ({
          symbol: c.symbol,
          price:  data[c.id]?.usd,
          change: data[c.id]?.usd_24h_change,
        })).filter(c => c.price);
        setPrices(result);
      })
      .catch(() => {});
  }, []);

  if (!prices.length) return (
    <div className="h-8 bg-dc-surface border-b border-dc-border flex items-center px-4">
      <div className="skeleton h-3 w-48 opacity-50" />
    </div>
  );

  const items = [...prices, ...prices]; // duplicate for seamless loop

  return (
    <div className="h-8 bg-dc-surface border-b border-dc-border ticker-wrap relative z-50">
      <div className="ticker-inner h-full items-center flex gap-8">
        {items.map((c, i) => {
          const isPos = c.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-white tracking-wider">{c.symbol}</span>
              <span className="text-[11px] font-mono text-dc-white2">{fmtPrice(c.price)}</span>
              <span className={`text-[10px] font-semibold font-mono ${isPos ? 'positive' : 'negative'}`}>
                {isPos ? '+' : ''}{c.change?.toFixed(2)}%
              </span>
              <span className="text-dc-border2 text-[10px]">·</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
