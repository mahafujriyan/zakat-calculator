"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type HowToUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(3,7,15,0.72)] p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="glass relative w-full max-w-2xl rounded-2xl border border-[#3a528f] p-5 md:p-7"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-use-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#395086] bg-[#0a1226] text-lg text-[#c7d5f3] transition hover:border-[#d4af37] hover:text-white"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="max-h-[75vh] overflow-y-auto pr-1">
              <h2 id="how-to-use-title" className="mb-4 pr-10 text-2xl font-bold text-white">
                কিভাবে ব্যবহার করবেন?
              </h2>

              <ul className="space-y-2 text-sm text-[#c4d1ee] md:text-base">
                <li>- সোনা দিলে সিস্টেম বিশুদ্ধ সোনা হিসাব করবে</li>
                <li>- ক্যারাট নির্বাচন করলে বিশুদ্ধতার হিসাব স্বয়ংক্রিয়ভাবে হবে</li>
                <li>- রুপা দিলে বাজার দর অনুযায়ী মূল্য নির্ধারণ হবে</li>
                <li>- নগদ টাকা যোগ হবে মোট সম্পদে</li>
                <li>- দেনা মোট সম্পদ থেকে বাদ যাবে</li>
                <li>- নিসাব নির্বাচন করলে সেই অনুযায়ী যাকাত নির্ধারণ হবে</li>
                <li>- হিসাব বাটনে ক্লিক করলে ফলাফল দেখাবে</li>
              </ul>

              <p className="mt-6 text-xs text-[#9cb0dc]">
                Developed by : <span className="text-white px-4"><Link href="https://www.facebook.com/mahafujhr/">Mahafuj Hossain  Riyan</Link></span> | {" "}
                <span className="bg-gradient-to-r from-[#35f2ff] via-[#7af5cc] to-[#d4af37] bg-clip-text text-transparent px-3">
                  <Link href="https://www.facebook.com/neoncode.co"> Neon Code </Link>
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
