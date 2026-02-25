import type { FieldErrors, UseFormRegister } from "react-hook-form";

type FormValues = {
  silverGrams: number;
};

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormValues>;
  silverPricePerGramBDT: number;
};

export default function SilverInput({ register, errors, silverPricePerGramBDT }: Props) {
  return (
    <section className="glass rounded-2xl p-5 md:p-6">
      <h3 className="mb-4 text-xl font-semibold text-[#f7fbff]">রূপা</h3>
      <label className="block">
        <span className="mb-1 block text-sm text-[#c8d4f1]">রূপা (গ্রাম)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className="f-number w-full rounded-xl border border-[#28437a] bg-[#0c162d] px-4 py-3"
          {...register("silverGrams", {
            valueAsNumber: true,
            min: { value: 0, message: "নেগেটিভ মান দেওয়া যাবে না" },
          })}
        />
        {errors.silverGrams && <p className="mt-1 text-xs text-[#ff8484]">{errors.silverGrams.message}</p>}
      </label>

      <p className="mt-4 rounded-xl bg-[#0a1226] px-4 py-3 text-sm text-[#acc0ea]">
        লাইভ রূপা দর: <span className="f-number text-[#d4af37]">৳ {silverPricePerGramBDT.toLocaleString("en-US")}</span> /g
      </p>
    </section>
  );
}
