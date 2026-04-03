"use client";

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-[#1A365D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-serif text-2xl tracking-widest text-white uppercase">INSULA</p>
        <p className="text-sm font-light text-[#8BB8DC]">© 2026 INSULA. All rights reserved.</p>
        <div className="flex items-center gap-6 md:mr-28">
          {[
            { name: "Facebook", link: "https://www.facebook.com/InsulaCushion/" },
            { name: "Shopee", link: "" },
            { name: "TikTok", link: "https://vt.tiktok.com/ZSH2U5CaT/?page=TikTokShop" }
          ].map((social) => (
            <a 
              key={social.name} 
              href={social.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-[#8BB8DC] hover:text-white transition-colors"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
