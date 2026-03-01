import { NextResponse } from "next/server";

type PricePayload = {
  goldPricePerGramBDT: number;
  silverPricePerGramBDT: number;
  source: string;
  updatedAt: string;
};

const TEN_MIN_MS = 10 * 60 * 1000;
let cache: { at: number; data: PricePayload } | null = null;

const FALLBACK: PricePayload = {
  goldPricePerGramBDT: 20000,
  silverPricePerGramBDT: 335,
  source: "fallback",
  updatedAt: new Date().toISOString(),
};

const OUNCE_TO_GRAM = 31.1034768;

async function fetchUsdToBdt(): Promise<number> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("USD/BDT rate fetch failed");
  const data = (await res.json()) as { rates?: Record<string, number> };
  const rate = data?.rates?.BDT;
  if (!rate || Number.isNaN(rate)) throw new Error("USD/BDT rate missing");
  return rate;
}

async function fetchFromMetalsLive(): Promise<{ gold: number; silver: number }> {
  const res = await fetch("https://api.metals.live/v1/spot", {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Metals spot fetch failed");

  const data = (await res.json()) as Array<Record<string, number>>;
  let gold = 0;
  let silver = 0;

  for (const row of data) {
    if (typeof row.gold === "number") gold = row.gold;
    if (typeof row.silver === "number") silver = row.silver;
  }

  if (!gold || !silver) throw new Error("Metals spot payload invalid");
  return { gold, silver };
}

async function fetchFromGoldApi(): Promise<{ gold: number; silver: number } | null> {
  const apiKey = process.env.GOLDAPI_KEY;
  if (!apiKey) return null;

  const [goldRes, silverRes] = await Promise.all([
    fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 600 },
    }),
    fetch("https://www.goldapi.io/api/XAG/USD", {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 600 },
    }),
  ]);

  if (!goldRes.ok || !silverRes.ok) throw new Error("GoldAPI fetch failed");

  const goldJson = (await goldRes.json()) as { price?: number };
  const silverJson = (await silverRes.json()) as { price?: number };

  if (!goldJson.price || !silverJson.price) throw new Error("GoldAPI payload invalid");

  return { gold: goldJson.price, silver: silverJson.price };
}

function toBdtPerGram(usdPerOunce: number, usdToBdt: number): number {
  return Number(((usdPerOunce / OUNCE_TO_GRAM) * usdToBdt).toFixed(2));
}

async function getLivePrices(): Promise<PricePayload> {
  const usdToBdt = await fetchUsdToBdt();

  let ounces: { gold: number; silver: number } | null = null;
  let source = "metals.live";

  try {
    ounces = await fetchFromGoldApi();
    if (ounces) source = "goldapi.io";
  } catch {
    ounces = null;
  }

  if (!ounces) {
    ounces = await fetchFromMetalsLive();
  }

  return {
    goldPricePerGramBDT: toBdtPerGram(ounces.gold, usdToBdt),
    silverPricePerGramBDT: toBdtPerGram(ounces.silver, usdToBdt),
    source,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.at < TEN_MIN_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await getLivePrices();
    cache = { at: now, data };
    return NextResponse.json(data);
  } catch {
    const fallback = { ...FALLBACK, updatedAt: new Date().toISOString() };
    cache = { at: now, data: fallback };
    return NextResponse.json(fallback);
  }
}
