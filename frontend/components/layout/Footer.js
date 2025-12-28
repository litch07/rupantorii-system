"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="section-pad border-t border-mist py-12 text-sm text-pine">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <p className="font-display text-lg text-ink">Rupantorii</p>
          <p>Modern Bengali jewelry crafted for everyday rituals and celebrations.</p>
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Ishwarganj, Mymensingh</p>
          <p className="text-xs text-pine">
            Custom orders are available. Reach out through our social channels.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-ink">Quick Links</p>
          <div className="flex flex-col gap-2">
            <Link href="/about" className="hover:text-rose">About Us</Link>
            <Link href="/contact" className="hover:text-rose">Contact</Link>
            <Link href="/help" className="hover:text-rose">User Guide</Link>
            <Link href="/track-order" className="hover:text-rose">Track Order</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-ink">Customer Service</p>
          <div className="flex flex-col gap-2">
            <Link href="/shipping" className="hover:text-rose">Shipping Info</Link>
            <Link href="/returns" className="hover:text-rose">Return Policy</Link>
            <Link href="/help#faq" className="hover:text-rose">FAQs</Link>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-ink">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="hover:text-rose">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-rose">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-ink">Connect</p>
          <div className="flex flex-col gap-2">
            <a href="https://www.facebook.com/efti.tasnuva" className="hover:text-rose">Facebook</a>
            <a href="https://www.instagram.com/ig_eftiiii_" className="hover:text-rose">Instagram</a>
            <a href="https://wa.me/8801601514337" className="hover:text-rose">WhatsApp</a>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-ink">Developer</p>
            <div className="flex flex-col gap-2">
              <a href="https://github.com/litch07" className="hover:text-rose">GitHub</a>
              <a href="https://www.linkedin.com/in/sadidahmed" className="hover:text-rose">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-pine">
        Copyright 2024 Rupantorii. All rights reserved.
      </p>
    </footer>
  );
}




