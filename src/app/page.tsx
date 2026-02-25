import Link from "next/link";

export default function HomePage() {
  return (
    <main className="neon-grid relative flex min-h-screen items-center justify-center px-6 py-20">
      <section className="glass relative z-10 w-full max-w-3xl rounded-3xl p-10 text-center">
        <p className="f-number mb-3 text-sm uppercase tracking-[0.18em] text-[#d4af37]">
          Zakat Calculator Bangladesh
        </p>
        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
          যাকাত ক্যালকুলেটর
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-[#c8d4f1] md:text-lg">
          লাইভ স্বর্ণ-রূপার বাজারদর, নির্ভুল নিসাব এবং ইসলামিক রুলস অনুসারে আপনার
          যাকাত হিসাব করুন।
        </p>
        <Link
          href="/calculator"
          className="f-number inline-flex rounded-full bg-[#d4af37] px-8 py-3 text-base font-semibold text-[#111] transition hover:brightness-110"
        >
          Calculator খুলুন
        </Link>
      </section>
    </main>
  );
}
