import type { NisabStandard, ZakatResult } from "@/lib/zakatCalculator";

type Props = {
  result: ZakatResult;
  nisabStandard: NisabStandard;
  isEligibleByConditions: boolean;
  finalZakatAmount: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);

export default function ResultCard({
  result,
  nisabStandard,
  isEligibleByConditions,
  finalZakatAmount,
}: Props) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6">
      <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">ফলাফল</h3>

      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-xl bg-[#0a1226] p-4">
          <p className="text-[#b7c6ea]">মোট সম্পদ</p>
          <p className="f-number mt-1 text-xl font-semibold text-white">৳ {formatCurrency(result.netAssets)}</p>
        </div>

        <div className="rounded-xl bg-[#0a1226] p-4">
          <p className="text-[#b7c6ea]">নিসাব ({nisabStandard === "gold" })</p>
          <p className="f-number mt-1 text-xl font-semibold text-white">৳ {formatCurrency(result.selectedNisab)}</p>
        </div>

        <div className="rounded-xl bg-[#0a1226] p-4 md:col-span-2">
          <p className="text-[#b7c6ea]">যাকাত (2.5%)</p>
          <p className="f-number mt-1 text-3xl font-bold text-[#d4af37]">৳ {formatCurrency(finalZakatAmount)}</p>
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl px-4 py-3 text-sm ${
          result.isZakatApplicable && isEligibleByConditions
            ? "bg-[#0e2f29] text-[#7df1c4]"
            : "bg-[#2f1a1a] text-[#ffb2b2]"
        }`}
      >
        স্ট্যাটাস:{" "}
        {result.isZakatApplicable && isEligibleByConditions
          ? "আপনার যাকাত ফরজ হয়েছে"
          : "নিসাব/শর্ত পূর্ণ হয়নি"}
      </div>
    </section>
  );
}
