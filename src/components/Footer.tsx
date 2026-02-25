import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 pb-6 text-center text-sm text-[#b6c4e5]">
      Developed by <span className="text-white"><Link href="https://www.facebook.com/mahafujhr/">Mahafuj Hossain  Riyan</Link></span> |{" "}
      <span className="bg-gradient-to-r from-[#35f2ff] via-[#7af5cc] to-[#d4af37] bg-clip-text font-semibold text-transparent">
<Link href="https://www.facebook.com/neoncode.co">Neon Code</Link>
      </span>
    </footer>
  );
}
