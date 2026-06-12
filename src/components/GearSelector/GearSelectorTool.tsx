import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ExternalLink, 
  Zap, 
  Settings, 
  ShoppingBag, 
  X,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recommendationTimeoutMs = 9000;

  useEffect(() => {
    setBag(MyBag.getAll());
  }, []);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="absolute inset-0 lane-gradient opacity-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 pt-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-500/20 text-teal-500 rounded flex items-center justify-center border border-teal-500/30">
                  <Zap size={18} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-500">Decision Engine v1.0</span>
              </div>
              <h1 className="headline text-4xl sm:text-5xl md:text-7xl leading-[0.95] text-bone-100 italic break-words">
                {config.toolName}
              </h1>
            </header>

            <form onSubmit={handleRecommend} className="glass p-6 md:p-10 rounded-sm mb-12 shadow-2xl">
              <div className="mb-8">
                <label className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4 block">HOW DO YOU BOWL?</label>
                <div className="relative flex flex-col gap-4 sm:block">
                  <textarea
                    ref={textareaRef}
                    value={freetext}
                    onChange={(e) => setFreetext(e.target.value)}
                    placeholder={config.heroPlaceholder}
                    className="w-full bg-navy-900/50 border-b-2 border-slate-700 py-4 px-2 sm:pr-48 outline-none focus:border-teal-500 transition-colors min-h-[120px] sm:min-h-[100px] font-sans text-base md:text-lg text-bone-100 resize-none"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="sm:absolute sm:bottom-4 sm:right-2 w-full sm:w-auto bg-amber-500 text-navy-900 px-6 py-3 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" size={16} /> : "Find My Gear"}
                    {!isLoading && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-8 overflow-x-auto pb-2">
                <div className="flex gap-4 min-w-max">
                  {config.quickFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedQuickFilter(filter)}
                      className={cn(
                        "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all",
                        selectedQuickFilter === filter 
                          ? "bg-teal-500 border-teal-500 text-navy-900 shadow-lg shadow-teal-500/20" 
                          : "border-slate-700 text-slate-400 hover:border-slate-500"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Toggle */}
              <div className="border-t border-bone-100/5 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-bone-100 transition-colors uppercase mb-6"
                >
                  <Settings size={14} />
                  Advanced Options
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {config.advancedOptions.map((opt) => (
                          <div key={opt.id} className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">{opt.label}</label>
                            {opt.type === 'select' && (
                              <select 
                                value={advancedValues[opt.id]}
                                onChange={(e) => setAdvancedValues({...advancedValues, [opt.id]: e.target.value})}
                                className="bg-navy-900 border border-slate-700 text-bone-100 p-3 text-xs rounded focus:border-teal-500 outline-none transition-colors appearance-none"
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
                                  className="flex-grow accent-teal-500 h-1 bg-slate-800 rounded-full appearance-none outline-none"
                                />
                                <span className="text-xs font-bold font-mono text-teal-500 min-w-8">{advancedValues[opt.id]}</span>
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
                                      "flex-1 p-2 border text-[10px] font-bold uppercase transition-all",
                                      advancedValues[opt.id] === o ? "bg-bone-100 text-navy-900 border-bone-100" : "border-slate-800 text-slate-500"
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

                      <div className="flex flex-col md:flex-row gap-6 p-4 bg-navy-900/50 border border-slate-800 rounded">
                        <div className="flex-1 flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">Preferred Retailer</label>
                          <div className="flex gap-2">
                            {(Object.keys(AFFILIATES) as Retailer[]).map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setRetailer(r)}
                                className={cn(
                                  "flex-1 text-[10px] font-bold py-2 border transition-all",
                                  retailer === r ? "bg-amber-500 border-amber-500 text-navy-900" : "border-slate-800 text-slate-500"
                                )}
                              >
                                {AFFILIATES[r].name.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-grow flex items-center justify-end">
                           <p className="text-[9px] text-slate-500 italic max-w-[200px]">Retailer selection updates all "Buy" links in the results table.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            <section className="mb-12 grid gap-4 md:grid-cols-3" aria-label="Recommendation trust notes">
              {[
                {
                  title: "How matches work",
                  copy: "Inputs are matched against fit, lane condition, price tier, and practical pro shop criteria.",
                },
                {
                  title: "Commercial disclosure",
                  copy: "Merchant links may earn commissions, but the shortlist logic stays based on product fit.",
                },
                {
                  title: "Final fit reminder",
                  copy: "Confirm ball drilling, shoe slide, and injury-sensitive fit with a local pro shop.",
                },
              ].map((note) => (
                <div key={note.title} className="rounded-sm border border-teal-500/15 bg-[#111318] p-4">
                  <h2 className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-500">
                    {note.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-500">{note.copy}</p>
                </div>
              ))}
            </section>

            {/* Results Table */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center px-4 mb-4">
                    <h3 className="headline text-2xl text-bone-100">Recommended Matches</h3>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{results.length} results found</div>
                  </div>

                  <div className="mx-4 mb-4 border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[11px] leading-relaxed text-amber-100">
                    As an Amazon Associate I earn from qualifying purchases. We may earn
                    commissions from merchant links, but match scores are based on your inputs
                    and product fit criteria.
                  </div>

                  <div className="glass overflow-hidden rounded-sm border-slate-800">
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
                          {results.map((item, i) => (
                            <tr key={item.product_name} className="border-b border-slate-800 hover:bg-white/[0.02] transition-colors group">
                              <td className="p-4">
                                <button 
                                  onClick={() => toggleBagItem(item)}
                                  aria-label={`${bag.find(p => p.product_name === item.product_name) ? "Remove" : "Save"} ${item.product_name} in my gear bag`}
                                  className={cn(
                                    "p-1 transition-colors",
                                    bag.find(p => p.product_name === item.product_name) ? "text-amber-500" : "text-slate-700 hover:text-slate-500"
                                  )}
                                >
                                  <Star size={16} fill={bag.find(p => p.product_name === item.product_name) ? "currentColor" : "none"} />
                                </button>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="font-bold text-bone-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{item.product_name}</div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.brand}</div>
                                  <p className="text-[10px] text-slate-500 italic mt-2 line-clamp-1 group-hover:line-clamp-none max-w-sm transition-all">{item.match_reason}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  "px-2 py-1 rounded-sm text-[10px] font-bold font-mono",
                                  item.match_score >= 90 ? "bg-teal-500/20 text-teal-500" : 
                                  item.match_score >= 80 ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-500"
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
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.price_tier}</span>
                              </td>
                              <td className="p-4 text-right">
                                <a 
                                  href={getAffiliateRedirectPath(retailer, item.amazon_search_query)}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored nofollow"
                                  onClick={() => trackAffiliateClick(retailer, item.amazon_search_query, window.location.pathname)}
                                  aria-label={`Compare ${item.product_name} on ${AFFILIATES[retailer].name}`}
                                  className="inline-flex items-center gap-2 bg-bone-100/10 hover:bg-bone-100 px-4 py-2 rounded text-bone-100 hover:text-navy-900 transition-all font-bold uppercase text-[10px] tracking-widest"
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

                  <div className="flex justify-center pt-8">
                     <button
                       onClick={handleRecommend}
                       disabled={isLoading}
                       className="flex items-center gap-2 text-slate-500 hover:text-bone-100 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"
                     >
                       <RefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
                       Refresh Recommendations
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <footer className="mt-20 pt-8 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 italic max-w-2xl mx-auto leading-relaxed break-words">
                As an Amazon Associate I earn from qualifying purchases. BowlerProShop.com may
                earn a small commission from merchant links at no extra cost to you. Match scores
                are algorithmically generated based on provided data and common pro shop criteria.
                Always consult with a local IBPSIA Pro Shop for final balance, fit, and drilling decisions.
              </p>
            </footer>
          </div>
        </div>

        {/* Floating My Bag Button */}
        <button
          onClick={() => setIsBagOpen(true)}
          aria-label={`Open my gear bag with ${bag.length} saved items`}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-navy-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          <ShoppingBag size={24} />
          {bag.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-navy-900 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-navy-900">
              {bag.length}
            </span>
          )}
        </button>

        {/* My Bag Slide Panel */}
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
                    <p className="text-slate-600 text-[10px] mt-2 italic max-w-[200px]">Star recommendations to save them here for comparison.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                      {bag.map((item) => (
                        <div key={item.product_name} className="glass p-4 rounded-sm flex gap-4 group">
                          <div className="flex-grow">
                             <div className="flex justify-between items-start">
                               <div className="font-bold text-bone-100 uppercase text-xs tracking-tight">{item.product_name}</div>
                               <button 
                                 onClick={() => setBag(MyBag.remove(item.product_name))}
                                 aria-label={`Remove ${item.product_name} from my gear bag`}
                                 className="text-slate-700 hover:text-caution transition-colors"
                               >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest my-1">{item.brand} | {item.category}</div>
                             <div className="mt-3 flex items-center gap-3">
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
                          alert("List copied to clipboard!");
                        }}
                        className="w-full border border-slate-700 hover:border-slate-500 text-bone-100 py-4 font-bold uppercase tracking-widest text-[10px] rounded transition-all"
                      >
                        Copy List To Clipboard
                      </button>
                      <button 
                        onClick={() => {
                          const searchQuery = bag.map(i => i.product_name).join(" ");
                          trackAffiliateClick(retailer, searchQuery, window.location.pathname);
                          window.open(getAffiliateRedirectPath(retailer, searchQuery), "_blank", "noopener,noreferrer");
                        }}
                        className="w-full bg-amber-500 text-navy-900 py-4 font-bold uppercase tracking-widest text-[10px] rounded transition-all shadow-xl shadow-amber-500/10"
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
