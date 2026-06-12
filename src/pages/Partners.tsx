import { Building2, Mail, Megaphone, Store, Trophy } from "lucide-react";
import Layout from "../components/Layout";

const partnerTypes = [
  {
    icon: Store,
    title: "Pro shops and coaches",
    body: "Share fitting guidance, local drilling services, or education that helps bowlers make better equipment decisions.",
  },
  {
    icon: Building2,
    title: "Bowling centers",
    body: "Connect around league resources, house-shot education, starter kits, and player development ideas.",
  },
  {
    icon: Trophy,
    title: "Brands and retailers",
    body: "Send product information, affiliate program details, catalog feeds, or review opportunities for fit-based gear coverage.",
  },
  {
    icon: Megaphone,
    title: "Media and community",
    body: "Reach out for guides, collaborations, tournament resources, or bowling education projects.",
  },
];

const email = "connect@bowlerproshop.com";
const mailto =
  "mailto:connect@bowlerproshop.com?subject=BowlerProShop%20Partner%20Inquiry";

export default function Partners() {
  return (
    <Layout>
      <section className="px-4 md:px-8 py-20 bg-navy-900">
        <div className="container mx-auto max-w-5xl">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-teal-500 mb-4">
            Partner Contact
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <div>
              <h1 className="headline text-5xl md:text-7xl text-bone-100 mb-8">
                Work with BowlerProShop
              </h1>
              <div className="space-y-6 text-slate-300 leading-relaxed max-w-2xl">
                <p>
                  BowlerProShop.com is building a practical gear decision engine for
                  league bowlers, returning bowlers, casual players, parents, and pro
                  shop conversations.
                </p>
                <p>
                  Partners can reach out about affiliate programs, product data,
                  local pro shop resources, bowling center collaborations, media
                  requests, or educational content.
                </p>
              </div>

              <a
                href={mailto}
                className="mt-10 inline-flex items-center gap-3 bg-[#7CD7FF] text-navy-900 px-7 py-4 rounded font-bold uppercase tracking-widest text-xs shadow-[0_0_24px_rgba(124,215,255,0.22)] transition-colors hover:bg-[#9DE2FF]"
              >
                <Mail size={18} />
                Email {email}
              </a>
            </div>

            <aside className="glass p-6 md:p-8 rounded-sm">
              <h2 className="headline text-3xl text-bone-100 mb-6">
                Include these details
              </h2>
              <ul className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <li>
                  <span className="font-bold text-bone-100">Organization:</span>{" "}
                  your company, center, pro shop, or media property.
                </li>
                <li>
                  <span className="font-bold text-bone-100">Opportunity:</span>{" "}
                  affiliate program, product info, local resource, content idea,
                  or collaboration request.
                </li>
                <li>
                  <span className="font-bold text-bone-100">Links:</span> program
                  page, product catalog, media kit, or relevant reference URLs.
                </li>
                <li>
                  <span className="font-bold text-bone-100">Timing:</span> any
                  launch date, season, event, or decision deadline.
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-24 bg-navy-900">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerTypes.map((partner) => {
              const Icon = partner.icon;
              return (
                <article key={partner.title} className="glass p-6 rounded-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-teal-500/15 border border-teal-500/30 text-teal-500 rounded flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-bone-100 uppercase tracking-wide mb-2">
                        {partner.title}
                      </h2>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {partner.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
