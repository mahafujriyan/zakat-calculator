export type Carat = 21 | 22 | 23 | 24;
export type NisabStandard = "gold" | "silver";

export type ZakatInput = {
  goldVori: number;
  goldGrams: number;
  goldCarat: Carat;
  silverVori: number;
  silverGrams: number;
  cashInHand: number;
  bankBalance: number;
  loans: number;
  immediateDebts: number;
  nisabStandard: NisabStandard;
};

export type MarketPrices = {
  goldPricePerGramBDT: number;
  silverPricePerGramBDT: number;
};

export type ZakatResult = {
  totalGoldGrams: number;
  pureGoldGrams: number;
  totalSilverGrams: number;
  goldValue: number;
  silverValue: number;
  cashValue: number;
  liabilities: number;
  netAssets: number;
  goldNisab: number;
  silverNisab: number;
  selectedNisab: number;
  zakatAmount: number;
  isZakatApplicable: boolean;
};

const VORI_TO_GRAM = 11.66;
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

const sanitize = (value: number): number => {
  if (!Number.isFinite(value) || Number.isNaN(value) || value < 0) return 0;
  return value;
};

const round2 = (value: number): number => Number(value.toFixed(2));

export function calculateZakat(input: ZakatInput, prices: MarketPrices): ZakatResult {
  const goldVori = sanitize(input.goldVori);
  const goldGrams = sanitize(input.goldGrams);
  const silverGrams = sanitize(input.silverGrams);
  const silverVori = sanitize(input.silverVori);
  const cashInHand = sanitize(input.cashInHand);
  const bankBalance = sanitize(input.bankBalance);
  const loans = sanitize(input.loans);
  const immediateDebts = sanitize(input.immediateDebts);
  const goldPrice = sanitize(prices.goldPricePerGramBDT);
  const silverPrice = sanitize(prices.silverPricePerGramBDT);
  const carat = [21, 22, 23, 24].includes(input.goldCarat) ? input.goldCarat : 24;

  const totalGoldGrams = goldVori * VORI_TO_GRAM + goldGrams;
  const pureGoldGrams = totalGoldGrams * (carat / 24);
  const goldValue = pureGoldGrams * goldPrice;
  const totalSilverGrams = silverVori * VORI_TO_GRAM + silverGrams;
  const silverValue = totalSilverGrams * silverPrice;
  const cashValue = cashInHand + bankBalance;
  const liabilities = loans + immediateDebts;
  const netAssets = goldValue + silverValue + cashValue - liabilities;

  const goldNisab = GOLD_NISAB_GRAMS * goldPrice;
  const silverNisab = SILVER_NISAB_GRAMS * silverPrice;
  const selectedNisab = input.nisabStandard === "gold" ? goldNisab : silverNisab;
  const isZakatApplicable = netAssets >= selectedNisab;
  const zakatAmount = isZakatApplicable ? netAssets * 0.025 : 0;

  return {
    totalGoldGrams: round2(totalGoldGrams),
    pureGoldGrams: round2(pureGoldGrams),
    totalSilverGrams: round2(totalSilverGrams),
    goldValue: round2(goldValue),
    silverValue: round2(silverValue),
    cashValue: round2(cashValue),
    liabilities: round2(liabilities),
    netAssets: round2(netAssets),
    goldNisab: round2(goldNisab),
    silverNisab: round2(silverNisab),
    selectedNisab: round2(selectedNisab),
    zakatAmount: round2(zakatAmount),
    isZakatApplicable,
  };
}
