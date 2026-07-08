import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  ShoppingBag,
  X,
  Trash2,
  RefreshCw,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Layout from "../Layout";
import {
  getAffiliateRedirectPath,
  Retailer,
  AFFILIATES,
  trackAffiliateClick,
} from "../../lib/affiliate";
import { trackEvent, trackRecommendationResultView } from "../../lib/analytics";
import { MyBag, BagItem } from "../../lib/bag";
import { getFallbackRecommendations, RecommendationResult } from "../../lib/recommendations";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToolConfig {
  toolName: string;
  type: 'ball' | 'shoe';
  heroPlaceholder: string;
  quickFilters: string[];
  advancedOptions: {
    id: string;
    label: string;
    type: 'select' | 'radio' | 'range';
    options?: string[];
    min?: number;
    max?: number;
    defaultValue: any;
  }[];
}

export default function GearSelectorTool({ config }: { config: ToolConfig }) {
  const [freetext, setFreetext] = useState("");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(config.quickFilters[0]);
  const [advancedValues, setAdvancedValues] = useState<Record<string, any>>(
    Object.fromEntries(config.advancedOptions.map(opt => [opt.id, opt.defaultValue]))
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [retailer, setRetailer] = useState<Retailer>('amazon');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recommendationTimeoutMs = 9000;

  useEffect(() => {
    setBag(MyBag.getAll());
  }, []);

  const handleRecommend = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setResults([]);

    trackEvent({
      event: 'selector_submit',
      selector_type: config.type,
      quick_filter: selectedQuickFilter,
      preferred_retailer: retailer,
    });

    const fallbackResults = getFallbackRecommendations(
      config.type,
      freetext,
      selectedQuickFilter,
      advancedValues,
    );
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), recommendationTimeoutMs);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          type: config.type,
          freetext,
          quickFilter: selectedQuickFilter,
          advanced: advancedValues,
          retailer
        })
      });
      const data = await response.json();
      window.clearTimeout(timeoutId);
      if (response.ok && data.results?.length) {
        setResults(data.results);
        trackRecommendationResultView({
          selectorType: config.type,
          resultCount: data.results.length,
          source: data.source || "api",
        });
      } else {
        setResults(fallbackResults);
        trackRecommendationResultView({
          selectorType: config.type,
          resultCount: fallbackResults.length,
          source: "fallback",
        });
      }
    } catch (error) {
      console.error("Recommendation failed:", error);
      setResults(fallbackResults);
      trackRecommendationResultView({
        selectorType: config.type,
        resultCount: fallbackResults.length,
        source: error instanceof DOMException && error.name === "AbortError" ? "fallback_timeout" : "fallback_error",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const toggleBagItem = (item: RecommendationResult) => {
    if (bag.find(p => p.product_name === item.product_name)) {
      setBag(MyBag.remove(item.product_name));
    } else {
      setBag(MyBag.add(item));
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-64px)] pb-20">
        <div className="absolute inset-0 lane-gradient opacity-10 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 pt-16 md:pt-24 relative z-10">
          <div className="max-w-3xl mx-auto">

            {/* Hero — clean & focused */}
            <div className="text-center mb-10">
              <h1 className="headline text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-bone-100 italic mb-4">
                {config.toolName}
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
                {config.type === 'ball'
                  ? "Describe how you bowl or pick a style below to get matched."
                  : "Tell us what you need or pick a style below to find your fit."}
              </p>
            </div>

            {/* Search bar — AI Domain Genius style */}
            <form onSubmit={handleRecommend} className="mb-6">
              <div className="relative flex items-center bg-[#111318] border border-slate-700/60 rounded-full shadow-2xl shadow-black/30 overflow-hidden focus-within:border-teal-500/60 transition-colors">
                <Search size={20} className="absolute left-5 text-slate-500 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={freetext}
                  onChange={(e) => setFreetext(e.target.value)}
                  placeholder={config.heroPlaceholder}
                  className="w-full bg-transparent py-4 pl-13 pr-40 text-base text-bone-100 placeholder:text-slate-600 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 bg-amber-500 hover:bg-amber-400 text-navy-900 px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <RefreshCw className="animate-spin" size={16} /> : "Find Gear"}
                </button>
              </div>
            </form>

            {/* Quick filter chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {config.quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedQuickFilter(filter);
                    trackEvent({ event: 'selector_start', selector_type: config.type, quick_filter: filter });
                  }}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs font-semibold border transition-all",
                    selectedQuickFilter === filter
                      ? "bg-teal-500 border-teal-500 text-navy-900 shadow-lg shadow-teal-500/20"
                      : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-bone-100"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Advanced options toggle */}
            <div className="text-center mb-12">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <SlidersHorizontal size={14} />
                Advanced options
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 p-6 bg-[#111318] border border-slate-700/40 rounded-xl text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        {config.advancedOptions.map((opt) => (
                          <div key={opt.id} className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{opt.label}</label>
                            {opt.type === 'select' && (
                              <select
                                value={advancedValues[opt.id]}
                                onChange={(e) => setAdvancedValues({...advancedValues, [opt.id]: e.target.value})}
                                className="bg-navy-900 border border-slate-700 text-bone-100 p-3 text-sm rounded-lg focus:border-teal-500 outline-none transition-colors appearance-none"
                              >
                                {opt.options?.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            )}
                            {opt.type === 'range' && (
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={opt.min}
                                  max={opt.max}
                                  value={advancedValues[opt.id]}
                                  onChange={(e) => setAdvancedValues({...advancedValues, [opt.id]: parseInt(e.target.value)})}
                                  className="flex-grow accent-teal-500 h-1.5 bg-slate-800 rounded-full appearance-none outline-none"
                                />
                                <span className="text-sm font-bold font-mono text-teal-500 min-w-[2.5rem] text-right">{advancedValues[opt.id]}</span>
                              </div>
                            )}
                            {opt.type === 'radio' && (
                              <div className="flex gap-2">
                                {opt.options?.map(o => (
                                  <button
                                    key={o}
                                    type="button"
                                    onClick={() => setAdvancedValues({...advancedValues, [opt.id]: o})}
                                    className={cn(
                                      "flex-1 py-2 border text-xs font-semibold rounded-lg transition-all",
                                      advancedValues[opt.id] === o
                                        ? "bg-teal-500/15 text-teal-400 border-teal-500/40"
                                        : "border-slate-800 text-slate-500 hover:border-slate-600"
                                    )}
                                  >
                                    {o}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Preferred retailer */}
                      <div className="pt-4 border-t border-slate-800/60">
                        <label className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-3 block">Preferred retailer</label>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(AFFILIATES) as Retailer[]).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRetailer(r)}
                              className={cn(
                                "px-4 py-2 text-xs font-semibold rounded-lg border transition-all",
                                retailer === r
                                  ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                                  : "border-slate-800 text-slate-500 hover:border-slate-600"
                              )}
                            >
                              {AFFILIATES[r].name}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2 italic">Updates all result links.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust notes — compact row */}
            <div className="grid gap-3 md:grid-cols-3 mb-12" aria-label="Recommendation trust notes">
              {[
                { title: "How matches work", copy: "Matched by fit, lane condition, price, and pro shop criteria." },
                { title: "Disclosure", copy: "Merchant links may earn commissions. Shortlist is based on product fit." },
                { title: "Final fit", copy: "Confirm drilling, slide, and fit with a local pro shop." },
              ].map((note) => (
                <div key={note.title} className="rounded-lg border border-teal-500/10 bg-[#111318] p-4">
                  <h2 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-teal-500">{note.title}</h2>
                  <p className="text-[11px] leading-relaxed text-slate-500">{note.copy}</p>
                </div>
              ))}
            </div>

            {/* Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="headline text-2xl text-bone-100">Recommended Matches</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{results.length} results</span>
                  </div>

                  <div className="mb-4 border border-amber-500/20 bg-amber-500/5 px-4 py-3 rounded-lg text-[11px] leading-relaxed text-amber-100/80">
                    As an Amazon Associate I earn from qualifying purchases. Match scores are based on your inputs and product fit criteria.
                  </div>

                  <div className="bg-[#111318] overflow-hidden rounded-lg border border-slate-800/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-slate-800">
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">#</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specs</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((item) => (
                            <tr key={item.product_name} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors group">
                              <td className="p-4">
                                <button
                                  onClick={() => toggleBagItem(item)}
                                  aria-label={`${bag.find(p => p.product_name === item.product_name) ? "Remove" : "Save"} ${item.product_name}`}
                                  className={cn(
                                    "p-1 transition-colors",
                                    bag.find(p => p.product_name === item.product_name) ? "text-amber-500" : "text-slate-700 hover:text-slate-500"
                                  )}
                                >
                                  <Star size={16} fill={bag.find(p => p.product_name === item.product_name) ? "currentColor" : "none"} />
                                </button>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-bone-100 group-hover:text-amber-500 transition-colors text-sm">{item.product_name}</div>
                                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">{item.brand}</div>
                                <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1 group-hover:line-clamp-none max-w-sm">{item.match_reason}</p>
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-full text-[10px] font-bold font-mono",
                                  item.match_score >= 90 ? "bg-teal-500/20 text-teal-400" :
                                  item.match_score >= 80 ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-500"
                                )}>
                                  {item.match_score}%
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {config.type === 'ball' ? (
                                    <>
                                      {item.coverstock_type?.toUpperCase()}<br/>
                                      {item.core_type?.toUpperCase()}
                                    </>
                                  ) : (
                                    <>
                                      {item.style?.toUpperCase()}<br/>
                                      {item.sole_type?.toUpperCase()}
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.price_tier}</span>
                              </td>
                              <td className="p-4 text-right">
                                <a
                                  href={getAffiliateRedirectPath(retailer, item.amazon_search_query)}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored nofollow"
                                  onClick={() => trackAffiliateClick(retailer, item.amazon_search_query, window.location.pathname)}
                                  aria-label={`Compare ${item.product_name} on ${AFFILIATES[retailer].name}`}
                                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-full text-navy-900 transition-all font-bold text-[10px] tracking-wider"
                                >
                                  Buy
                                  <ExternalLink size={12} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => handleRecommend()}
                      disabled={isLoading}
                      className="flex items-center gap-2 text-slate-500 hover:text-bone-100 transition-colors text-xs font-semibold"
                    >
                      <RefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
                      Refresh results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer disclosure */}
            <footer className="mt-20 pt-8 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 italic max-w-xl mx-auto leading-relaxed">
                As an Amazon Associate I earn from qualifying purchases. BowlerProShop.com may
                earn a commission from merchant links at no extra cost to you. Always consult
                a local pro shop for final balance, fit, and drilling decisions.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Link to="/guides" className="text-[10px] text-slate-600 hover:text-teal-500 transition-colors">Guides</Link>
                <Link to="/disclosure" className="text-[10px] text-slate-600 hover:text-teal-500 transition-colors">Disclosure</Link>
              </div>
            </footer>
          </div>
        </div>

        {/* Floating bag button */}
        <button
          onClick={() => setIsBagOpen(true)}
          aria-label={`Open my gear bag with ${bag.length} saved items`}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-navy-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
        >
          <ShoppingBag size={24} />
          {bag.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-navy-900 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-navy-900">
              {bag.length}
            </span>
          )}
        </button>

        {/* Bag slide panel */}
        <AnimatePresence>
          {isBagOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBagOpen(false)}
                className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-navy-900 border-l border-slate-800 shadow-2xl p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="headline text-4xl text-bone-100">My Gear Bag</h2>
                  <button onClick={() => setIsBagOpen(false)} className="text-slate-500 hover:text-bone-100 transition-colors">
                    <span className="sr-only">Close my gear bag</span>
                    <X size={28} />
                  </button>
                </div>

                {bag.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 border-2 border-slate-800 rounded-full flex items-center justify-center text-slate-800 mb-6">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Your bag is empty.</p>
                    <p className="text-slate-600 text-[10px] mt-2 italic max-w-[200px]">Star recommendations to save them here.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                      {bag.map((item) => (
                        <div key={item.product_name} className="bg-[#111318] border border-slate-800/40 p-4 rounded-lg flex gap-4 group">
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div className="font-bold text-bone-100 text-sm">{item.product_name}</div>
                              <button
                                onClick={() => setBag(MyBag.remove(item.product_name))}
                                aria-label={`Remove ${item.product_name}`}
                                className="text-slate-700 hover:text-caution transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest my-1">{item.brand} | {item.category}</div>
                            <div className="mt-3">
                              <a
                                href={getAffiliateRedirectPath(retailer, item.amazon_search_query)}
                                target="_blank"
                                rel="noopener noreferrer sponsored nofollow"
                                onClick={() => trackAffiliateClick(retailer, item.amazon_search_query, window.location.pathname)}
                                className="text-teal-500 hover:text-teal-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                              >
                                View Price <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-slate-800 mt-auto space-y-4">
                      <button
                        onClick={() => {
                          const list = bag.map(i => `${i.product_name} (${i.brand})`).join('\n');
                          navigator.clipboard.writeText(list);
                        }}
                        className="w-full border border-slate-700 hover:border-slate-500 text-bone-100 py-4 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all"
                      >
                        Copy List
                      </button>
                      <button
                        onClick={() => {
                          const searchQuery = bag.map(i => i.product_name).join(" ");
                          trackAffiliateClick(retailer, searchQuery, window.location.pathname);
                          window.open(getAffiliateRedirectPath(retailer, searchQuery), "_blank", "noopener,noreferrer");
                        }}
                        className="w-full bg-amber-500 text-navy-900 py-4 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all shadow-xl shadow-amber-500/10"
                      >
                        Compare All On {AFFILIATES[retailer].name.toUpperCase()}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
