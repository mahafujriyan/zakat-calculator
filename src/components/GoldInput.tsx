import type { FieldErrors, UseFormRegister } from "react-hook-form";

type FormValues = {
  goldVori: number;
  goldGrams: number;
  goldCarat: 21 | 22 | 23 | 24;
};

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormValues>;
  totalGoldGrams: number;
  pureGoldGrams: number;
};

export default function GoldInput({ register, errors, totalGoldGrams, pureGoldGrams }: Props) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6">
      <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">স্বর্ণ</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-[#c8d4f1]">ভরি</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
            {...register("goldVori", {
              valueAsNumber: true,
              min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
            })}
          />
          {errors.goldVori && <p className="mt-1 text-xs text-[#ff8484]">{errors.goldVori.message}</p>}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[#c8d4f1]">গ্রাম</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
            {...register("goldGrams", {
              valueAsNumber: true,
              min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
            })}
          />
          {errors.goldGrams && <p className="mt-1 text-xs text-[#ff8484]">{errors.goldGrams.message}</p>}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm text-[#c8d4f1]">ক্যারেট</span>
          <select
            className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
            {...register("goldCarat", {
              setValueAs: (value: string) => Number(value),
              validate: (value: number) =>
                [21, 22, 23, 24].includes(Number(value)) || "শুধু 21, 22, 23, 24 অনুমোদিত",
            })}
          >
            <option value={24}>24K</option>
            <option value={23}>23K</option>
            <option value={22}>22K</option>
            <option value={21}>21K</option>
          </select>
          {errors.goldCarat && <p className="mt-1 text-xs text-[#ff8484]">{errors.goldCarat.message}</p>}
        </label>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-[#0a1226] p-4 md:grid-cols-2">
        <p className="text-sm text-[#acc0ea]">
          মোট স্বর্ণ: <span className="f-number text-white">{totalGoldGrams.toLocaleString("en-US")}</span> g
        </p>
        <p className="text-sm text-[#acc0ea]">
          বিশুদ্ধ স্বর্ণ: <span className="f-number text-[#d4af37]">{pureGoldGrams.toLocaleString("en-US")}</span> g
        </p>
      </div>
    </section>
  );
}
