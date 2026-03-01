"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Footer from "@/components/Footer";
import GoldInput from "@/components/GoldInput";
import HowToUseModal from "@/components/HowToUseModal";
import ResultCard from "@/components/ResultCard";
import SilverInput from "@/components/SilverInput";
import {
  calculateZakat,
  type Carat,
  type MarketPrices,
  type NisabStandard,
  type ZakatInput,
} from "@/lib/zakatCalculator";

type FormValues = ZakatInput & {
  isMuslimAdultSoundMind: boolean;
  completedHawl: boolean;
};

type PriceApiResponse = MarketPrices & {
  source: string;
  updatedAt: string;
};

const fallbackPrices: MarketPrices = {
  goldPricePerGramBDT: 20000,
  silverPricePerGramBDT: 335,
};

export default function CalculatorPage() {
  const [prices, setPrices] = useState<MarketPrices>(fallbackPrices);
  const [priceMeta, setPriceMeta] = useState<{ source: string; updatedAt: string } | null>(null);
  const [priceError, setPriceError] = useState<string>("");
  const [isHowToOpen, setIsHowToOpen] = useState<boolean>(false);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      goldVori: 0,
      goldGrams: 0,
      goldCarat: 22,
      silverVori: 0,
      silverGrams: 0,
      cashInHand: 0,
      bankBalance: 0,
      loans: 0,
      immediateDebts: 0,
      nisabStandard: "gold",
      isMuslimAdultSoundMind: false,
      completedHawl: false,
    },
  });

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) throw new Error("price request failed");
        const data = (await res.json()) as PriceApiResponse;
        setPrices({
          goldPricePerGramBDT: data.goldPricePerGramBDT,
          silverPricePerGramBDT: data.silverPricePerGramBDT,
        });
        setPriceMeta({ source: data.source, updatedAt: data.updatedAt });
        setPriceError("");
      } catch {
        setPriceError("লাইভ দর লোড করা যায়নি, fallback দর ব্যবহার করা হচ্ছে।");
      }
    };

    loadPrices();
  }, []);

  useEffect(() => {
    if (!isHowToOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isHowToOpen]);

  const values = watch();
  const parsedValues: ZakatInput = {
    goldVori: Number(values.goldVori) || 0,
    goldGrams: Number(values.goldGrams) || 0,
    goldCarat: (Number(values.goldCarat) || 22) as Carat,
    silverVori: Number(values.silverVori) || 0,
    silverGrams: Number(values.silverGrams) || 0,
    cashInHand: Number(values.cashInHand) || 0,
    bankBalance: Number(values.bankBalance) || 0,
    loans: Number(values.loans) || 0,
    immediateDebts: Number(values.immediateDebts) || 0,
    nisabStandard: (values.nisabStandard as NisabStandard) || "silver",
  };

  const result = calculateZakat(parsedValues, prices);
  const isMuslimAdultSoundMind = watch("isMuslimAdultSoundMind");
  const completedHawl = watch("completedHawl");
  const isEligibleByConditions = Boolean(isMuslimAdultSoundMind) && Boolean(completedHawl);
  const finalZakatAmount = result.isZakatApplicable && isEligibleByConditions ? result.zakatAmount : 0;
  const selectedIsGold = parsedValues.nisabStandard === "gold";
  const selectedNisabGramText = selectedIsGold ? "87.48g" : "612.36g";
  const selectedNisabLabel = selectedIsGold ? "Gold" : "Silver";

  return (
    <main className="neon-grid relative min-h-screen px-4 py-8 md:px-8 md:py-12">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 rounded-3xl border border-[#3a528f] bg-[rgba(7,14,29,0.74)] p-6 md:p-10"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p className="f-number text-xs uppercase tracking-[0.2em] text-[#d4af37] md:text-sm">
              Bangladesh Zakat Platform
            </p>
            <button
              type="button"
              onClick={() => setIsHowToOpen(true)}
              className="rounded-full border border-[#3f5a95] bg-[#0a1226] px-4 py-2 text-xs font-semibold text-[#d8e4ff] transition hover:border-[#d4af37] hover:text-white md:text-sm"
            >
              কিভাবে ব্যবহার করবেন?
            </button>
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-5xl">যাকাত ক্যালকুলেটর (Bangladesh)</h1>
          <p className="max-w-3xl text-sm text-[#c3d1ef] md:text-base">
            প্রামাণ্য ইসলামিক রুলস অনুযায়ী স্বর্ণ, রূপা, নগদ অর্থ ও দায় বাদ দিয়ে আপনার
            যাকাত নির্ণয় করুন।
          </p>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p className="rounded-xl bg-[#0a1226] px-4 py-3 text-[#b5c4e8]">
              লাইভ স্বর্ণ দর: <span className="f-number text-[#d4af37]">৳ {prices.goldPricePerGramBDT.toLocaleString("en-US")}</span> /g
            </p>
            <p className="rounded-xl bg-[#0a1226] px-4 py-3 text-[#b5c4e8]">
              লাইভ রূপা দর: <span className="f-number text-[#d4af37]">৳ {prices.silverPricePerGramBDT.toLocaleString("en-US")}</span> /g
            </p>
          </div>

          {priceMeta && (
            <p className="f-number mt-3 text-xs text-[#90a4d7]">
              Source: {priceMeta.source} | Updated: {new Date(priceMeta.updatedAt).toLocaleString("en-US")}
            </p>
          )}

          {priceError && <p className="mt-2 text-sm text-[#ff9d9d]">{priceError}</p>}
        </motion.section>

        <div className="grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="space-y-5"
          >
            <GoldInput
              register={register}
              errors={errors as any}
              totalGoldGrams={result.totalGoldGrams}
              pureGoldGrams={result.pureGoldGrams}
            />

            <SilverInput
              register={register}
              errors={errors as any}
              silverPricePerGramBDT={prices.silverPricePerGramBDT}
              totalSilverGrams={result.totalSilverGrams}
            />

            <section className="glass rounded-2xl p-5 md:p-6">
              <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">নগদ অর্থ</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-[#c8d4f1]">হাতে নগদ (BDT)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
                    {...register("cashInHand", {
                      valueAsNumber: true,
                      min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
                    })}
                  />
                  {errors.cashInHand && <p className="mt-1 text-xs text-[#ff8484]">{errors.cashInHand.message}</p>}
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#c8d4f1]">ব্যাংক ব্যালেন্স (BDT)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
                    {...register("bankBalance", {
                      valueAsNumber: true,
                      min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
                    })}
                  />
                  {errors.bankBalance && <p className="mt-1 text-xs text-[#ff8484]">{errors.bankBalance.message}</p>}
                </label>
              </div>
            </section>

            <section className="glass rounded-2xl p-5 md:p-6">
              <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">দায়-দেনা</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-[#c8d4f1]">লোন (BDT)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
                    {...register("loans", {
                      valueAsNumber: true,
                      min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
                    })}
                  />
                  {errors.loans && <p className="mt-1 text-xs text-[#ff8484]">{errors.loans.message}</p>}
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#c8d4f1]">তাৎক্ষণিক ঋণ (BDT)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
                    {...register("immediateDebts", {
                      valueAsNumber: true,
                      min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
                    })}
                  />
                  {errors.immediateDebts && <p className="mt-1 text-xs text-[#ff8484]">{errors.immediateDebts.message}</p>}
                </label>
              </div>
            </section>

            <section className="glass rounded-2xl p-5 md:p-6">
              <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">নিসাব স্ট্যান্ডার্ড</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {/* <label className="flex items-center gap-3 rounded-xl border border-[#28437a] bg-[#0a1226] px-4 py-3 text-sm">
                  <input type="radio" value="gold" {...register("nisabStandard")} />
                  <span>Gold ভিত্তিক (87.48g)</span>
                </label> */}
                <label className="flex items-center gap-3 rounded-xl border border-[#28437a] bg-[#0a1226] px-4 py-3 text-sm">
                  <input type="radio" value="silver" {...register("nisabStandard")} />
                  <span>Silver ভিত্তিক (612.36g)</span>
                </label>
              </div>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="space-y-5"
          >
            <ResultCard
              result={result}
              nisabStandard={parsedValues.nisabStandard}
              isEligibleByConditions={isEligibleByConditions}
              finalZakatAmount={finalZakatAmount}
            />

            <section className="glass rounded-2xl p-5 md:p-6">
              <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">যাকাত ফরজ হওয়ার শর্ত (Eligibility)</h3>
              <ul className="space-y-2 text-sm text-[#c2d0ef]">
                <li>1. ব্যক্তি মুসলিম, বালেগ এবং সুস্থ মস্তিষ্কের হতে হবে।</li>
                <li>
                  2. নিসাব পরিমাণ সম্পদ থাকতে হবে ({selectedNisabLabel} {selectedNisabGramText} সমমূল্য)।
                </li>
                <li>3. সম্পদ পূর্ণ এক চান্দ্র বছর (Hawl) নিসাবের উপরে থাকতে হবে।</li>
                <li>4. সম্পদ যাকাতযোগ্য হতে হবে (স্বর্ণ, রূপা, নগদ, সঞ্চয় - দায় বাদে)।</li>
                <li className="text-[#d4af37]">সব শর্ত পূর্ণ হলে যাকাত = নেট যাকাতযোগ্য সম্পদের 2.5%</li>
              </ul>

              <div className="mt-4 space-y-3">
              <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded-lg text-sm text-yellow-200">
  📌 যাকাত হিসাব করার আগে নিচের শর্তগুলো মনোযোগ দিয়ে পড়ুন এবং প্রযোজ্য হলে টিক চিহ্ন দিন।
  সব শর্ত পূরণ হলে আপনি যাকাত প্রদানের জন্য যোগ্য হতে পারেন।
</div>
                <label className="flex items-start gap-3 rounded-xl border border-[#28437a] bg-[#0a1226] px-4 py-3 text-sm">
                  <input type="checkbox" className="mt-1" {...register("isMuslimAdultSoundMind")} />
                  <span>আমি মুসলিম, বালেগ এবং সুস্থ মস্তিষ্কের।</span>
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-[#28437a] bg-[#0a1226] px-4 py-3 text-sm">
                  <input type="checkbox" className="mt-1" {...register("completedHawl")} />
                  <span>আমার যাকাতযোগ্য সম্পদ পূর্ণ এক চান্দ্র বছর (Hawl) নিসাবের উপরে ছিল।</span>
                </label>
              </div>
            </section>

            <section className="glass rounded-2xl p-5 md:p-6">
              <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">বিস্তারিত হিসাব</h3>
              <ul className="space-y-2 text-sm text-[#c2d0ef]">
                <li>
                  স্বর্ণের মূল্য: <span className="f-number text-white">৳ {result.goldValue.toLocaleString("en-US")}</span>
                </li>
                <li>
                  রূপার মূল্য: <span className="f-number text-white">৳ {result.silverValue.toLocaleString("en-US")}</span>
                </li>
                <li>
                  নগদ অর্থ: <span className="f-number text-white">৳ {result.cashValue.toLocaleString("en-US")}</span>
                </li>
                <li>
                  দায়-দেনা: <span className="f-number text-white">৳ {result.liabilities.toLocaleString("en-US")}</span>
                </li>
                <li>
                  {selectedNisabLabel} Nisab:{" "}
                  <span className="f-number text-white">৳ {result.selectedNisab.toLocaleString("en-US")}</span>
                </li>
                <li>
                  Final Zakat Due: <span className="f-number text-[#d4af37]">৳ {finalZakatAmount.toLocaleString("en-US")}</span>
                </li>
              </ul>
            </section>
          </motion.div>
        </div>

        <Footer />
      </div>

      <HowToUseModal isOpen={isHowToOpen} onClose={() => setIsHowToOpen(false)} />
    </main>
  );
}
