import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Facebook, Instagram, Menu, Music2, Twitter, X, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Seo from "./Seo";
import AnalyticsTags from "./AnalyticsTags";
import { trackEmailSignup } from "../lib/analytics";
import { SITE, SOCIAL_LINKS } from "../lib/site";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  x: Twitter,
  youtube: Youtube,
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [footerEmail, setFooterEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find My Gear", href: "/find-my-gear" },
    { name: "Accessories", href: "/gear/bowling-accessories" },
    { name: "Shoes", href: "/gear/bowling-shoes" },
    { name: "Bags", href: "/gear/bowling-bags" },
    { name: "Balls", href: "/gear/bowling-balls" },
    { name: "Guides", href: "/guides" },
    { name: "For Alleys", href: "/bowling-alleys" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 border-x border-bone-100/5 max-w-[2000px] mx-auto overflow-x-hidden">
      <Seo />
      <AnalyticsTags />
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b border-t-2 border-t-caution",
          isScrolled 
            ? "bg-[#020205]/95 backdrop-blur-md border-slate-800 py-2" 
            : "bg-[#020205] border-slate-800 py-3"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="Bowler Pro Shop home">
            <img
              src="/brand/bowler-pro-shop-logo-web.png"
              alt="Bowler Pro Shop"
              className="h-12 w-auto max-w-[220px] object-contain md:h-14 md:max-w-[280px]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-semibold tracking-wide transition-colors",
                  location.pathname === link.href ? "text-teal-500" : "text-slate-500 hover:text-bone-100"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/find-my-gear"
              className="hidden sm:flex items-center gap-2 neon-red-button px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-transform active:scale-95"
            >
              Start Gear Finder
            </Link>
            
            <button 
              className="lg:hidden text-bone-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#020205] pt-28 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display text-bone-100 hover:text-teal-500 flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              ))}
              <Link
                to="/find-my-gear"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 neon-red-button p-4 font-display text-xl text-center rounded-full"
              >
                FIND MY GEAR
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="h-auto bg-[#020205] border-t border-slate-800 flex flex-col items-center pt-12 pb-8 px-8 shrink-0 relative overflow-hidden">
         <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-8 mb-12">
            <div className="text-[10px] text-slate-500 max-w-sm leading-tight italic">
              <span className="font-bold text-slate-400 not-italic uppercase tracking-tighter mr-1">Disclosure:</span> 
              As an Amazon Associate I earn from qualifying purchases. BowlerProShop.com may earn a commission when you buy through links on this page. We recommend products based on available specs, retailer data, and clearly stated research criteria.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:justify-end">
              <span className="text-xs font-semibold text-slate-400">Get the Gear Checklist:</span>
              <form
                className="flex h-9"
                onSubmit={async (event) => {
                  event.preventDefault();
                  trackEmailSignup({ sourcePage: location.pathname, gearNeed: "footer_checklist" });
                  await fetch("/api/email-signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: footerEmail, gearNeed: "footer_checklist" }),
                  }).catch(() => undefined);
                  setFooterEmail("");
                }}
              >
                <label className="sr-only" htmlFor="footer-email">
                  Email address for gear checklist
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={footerEmail}
                  onChange={(event) => setFooterEmail(event.target.value)}
                  placeholder="Your email address"
                  className="bg-[#080A10] border border-slate-800 rounded-l px-4 text-xs w-48 focus:outline-none focus:border-teal-500 text-bone-100"
                  required
                />
                <button type="submit" className="bg-caution text-navy-900 px-4 rounded-r text-[10px] font-black uppercase hover:bg-caution/80 transition-colors">Join</button>
              </form>
            </div>
         </div>

         <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 text-xs">
            {/* Quick links to keep existing functionality */}
            <div>
              <h4 className="headline text-bone-100 mb-4 tracking-wider">GEAR</h4>
              <ul className="flex flex-col gap-2 text-slate-500">
                <li><Link to="/gear/bowling-balls" className="hover:text-amber-500">Balls</Link></li>
                <li><Link to="/gear/bowling-shoes" className="hover:text-amber-500">Shoes</Link></li>
                <li><Link to="/gear/bowling-bags" className="hover:text-amber-500">Bags</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="headline text-bone-100 mb-4 tracking-wider">TOOLS</h4>
              <ul className="flex flex-col gap-2 text-slate-500">
                <li><Link to="/tools/bowling-ball-selector" className="hover:text-amber-500">Ball Selector</Link></li>
                <li><Link to="/tools/bowling-shoe-selector" className="hover:text-amber-500">Shoe Selector</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="headline text-bone-100 mb-4 tracking-wider">PARTNERS</h4>
              <ul className="flex flex-col gap-2 text-slate-500">
                <li><Link to="/partners" className="hover:text-amber-500">Partner Contact</Link></li>
                <li><a href="mailto:connect@bowlerproshop.com?subject=BowlerProShop%20Partner%20Inquiry" className="hover:text-amber-500">connect@bowlerproshop.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="headline text-bone-100 mb-4 tracking-wider">LEGAL</h4>
              <ul className="flex flex-col gap-2 text-slate-500">
                <li><Link to="/disclosure" className="hover:text-amber-500">Disclosure</Link></li>
                <li><Link to="/privacy" className="hover:text-amber-500">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="headline text-bone-100 mb-4 tracking-wider">SOCIAL</h4>
              <ul className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = socialIcons[link.id];

                  return (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label={`${SITE.shortName} on ${link.name}`}
                        title={`${SITE.shortName} on ${link.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded border border-slate-800 text-slate-500 transition-colors hover:border-amber-500 hover:text-amber-500"
                      >
                        <Icon size={18} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
         </div>

          <div className="container mx-auto pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} BOWLERPROSHOP.COM — SYSTEMS BY B.
            </p>
          </div>
      </footer>
    </div>
  );
}
