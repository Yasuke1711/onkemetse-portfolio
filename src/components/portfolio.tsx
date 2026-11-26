"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { Project, projectFilters, projects } from "@/data/projects";

type CurrencyCode = "BWP" | "ZAR" | "NAD" | "ZMW" | "USD" | "GBP" | "EUR" | "JPY" | "CNY" | "ZWG";
type CurrencyOption = { code: CurrencyCode; label: string; symbol: string };

const currencies: CurrencyOption[] = [
  { code: "BWP", label: "Botswana pula", symbol: "P" },
  { code: "ZAR", label: "South African rand", symbol: "R" },
  { code: "NAD", label: "Namibian dollar", symbol: "N$" },
  { code: "ZMW", label: "Zambian kwacha", symbol: "K" },
  { code: "ZWG", label: "Zimbabwe Gold (ZiG)", symbol: "ZiG" },
  { code: "USD", label: "US dollar", symbol: "$" },
  { code: "GBP", label: "British pound", symbol: "£" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "JPY", label: "Japanese yen", symbol: "¥" },
  { code: "CNY", label: "Chinese yuan", symbol: "CN¥" },
];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const languages = [
  { name: "Python", detail: "My first language", logo: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Java", detail: "Object-oriented programming", logo: "https://cdn.simpleicons.org/java/ED8B00" },
  { name: "JavaScript", detail: "Web interfaces and application logic", logo: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "TypeScript", detail: "Typed JavaScript development", logo: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Assembly", detail: "Basic familiarity", logo: "/icons/assembly.svg" },
];

const technologies = [
  "React",
  "Next.js",
  "HTML & CSS",
  "Tailwind CSS",
  "APIs & integrations",
];

function GithubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.31-3.76-1.31-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.76 1.94 3.35 1.95.11-.71.43-1.2.74-1.47-2.48-.28-5.09-1.24-5.09-5.54 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.53.23 2.67.12 2.95.72.78 1.15 1.78 1.15 3 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.025, 0.15) }}
      className="project-card"
    >
      <div className={`project-image${imageFailed ? " project-image-fallback" : ""}`}>
        {!imageFailed ? (
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
            unoptimized
            className="project-image-media"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-image-fallback-content" aria-hidden="true">
            <span>{project.category}</span>
            <strong>{project.title}</strong>
          </div>
        )}
        <div className="project-image-topline">
          <span className={`project-kind ${project.kind === "Selected work" ? "project-kind-real" : ""}`}>
            {project.kind === "Selected work" ? "Selected work" : "Concept demo"}
          </span>
          <span className="project-year">{project.year}</span>
        </div>
      </div>
      <div className="project-card-body">
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="tag-list">
          {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
    </motion.article>
  );
}
function CurrencyPricing() {
  const [currency, setCurrency] = useState<CurrencyCode>("BWP");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [rateState, setRateState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const loadRates = async () => {
      try {
        const response = await fetch("/api/rates", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Rate service unavailable");
        const data = (await response.json()) as {
          result?: string;
          rates?: Record<string, number>;
          time_last_update_utc?: string;
        };
        if (data.result !== "success" || !data.rates) throw new Error("Invalid rate response");
        setRates(data.rates);
        setRateDate(data.time_last_update_utc ?? null);
        setRateState("ready");
      } catch {
        if (!controller.signal.aborted) setRateState("unavailable");
      }
    };
    void loadRates();
    return () => controller.abort();
  }, []);

  const selected = currencies.find((item) => item.code === currency) ?? currencies[0];
  const priceRows = [
    { label: "Starter", amount: 2500, description: "A focused, professional website for a small business." },
    { label: "Business", amount: 4500, description: "More pages, richer content and additional functionality." },
    { label: "Custom", amount: 9000, description: "A more involved website shaped around your requirements." },
  ];

  const formatPrice = (bwp: number) => {
    if (currency === "BWP") return `P${bwp.toLocaleString("en-BW")}`;
    const rate = rates?.[currency];
    if (!rate) return currency === "ZWG" ? "ZiG · quote on request" : "Rate unavailable";
    const converted = bwp * rate;
    const digits = currency === "JPY" ? 0 : 2;
    return `${selected.symbol}${converted.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 })}`;
  };

  return (
    <div className="pricing-panel">
      <div className="pricing-head">
        <div>
          <p className="eyebrow">Transparent starting prices</p>
          <h3>Clear scope. Clear terms.</h3>
          <p className="pricing-intro">Every project is quoted around its actual requirements. These are starting points, not one-size-fits-all packages.</p>
        </div>
        <label className="currency-control">
          <span>Display currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} aria-label="Choose display currency">
            {currencies.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.label}</option>)}
          </select>
        </label>
      </div>
      <div className="price-grid">
        {priceRows.map((row, index) => (
          <div className={`price-card${index === 0 ? " price-card-featured" : ""}`} key={row.label}>
            <p className="price-label">{row.label}</p>
            <p className="price-amount">{formatPrice(row.amount)}<span>+</span></p>
            <p className="price-description">{row.description}</p>
            <p className="price-bwp">{currency === "BWP" ? "Botswana pula" : `Base price: P${row.amount.toLocaleString("en-BW")}`}</p>
          </div>
        ))}
      </div>
      <div className="pricing-footnote">
        <span>{rateState === "loading" ? "Checking exchange rates…" : rateState === "ready" ? `Indicative exchange rates${rateDate ? ` · Updated ${rateDate}` : ""}` : "Live exchange rates unavailable · Showing quote status where needed"}</span>
        <span>Final quotations are confirmed in the agreed payment currency. · <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates by Exchange Rate API</a></span>
      </div>
      <div className="payment-terms">
        <div className="payment-terms-title">
          <span className="payment-icon">50/50</span>
          <div>
            <p className="eyebrow">Payment terms</p>
            <h4>Half to begin. Half before handover.</h4>
          </div>
        </div>
        <div className="payment-steps">
          <div><b>01 · 50% deposit</b><span>Confirms the booking and starts the project.</span></div>
          <div><b>02 · 50% final payment</b><span>Due after the agreed work is complete and approved, before final handover.</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<(typeof projectFilters)[number]>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formStatus, setFormStatus] = useState("");
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    if (activeFilter === "Selected work") return projects.filter((project) => project.kind === "Selected work");
    if (activeFilter === "Concept demos") return projects.filter((project) => project.kind === "Concept demo");
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const sections = navItems.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactEmail) {
      setFormStatus("The contact email hasn't been connected yet. Add NEXT_PUBLIC_CONTACT_EMAIL before publishing.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const projectType = String(form.get("projectType") ?? "Website enquiry");
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Project enquiry from ${name || "portfolio visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject: ${projectType}\n\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setFormStatus("Your email app should open with the enquiry ready to send.");
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Onkemetse home" onClick={() => setMobileMenuOpen(false)}>
          Onkemetse <span>Khavara</span>
        </a>
        <nav className={`main-nav${mobileMenuOpen ? " main-nav-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? "nav-link nav-link-active" : "nav-link"}
              onClick={() => setMobileMenuOpen(false)}
            >{item.label}</a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">Let&apos;s talk</a>
        <button className="mobile-menu-button" type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </header>

      <section className="hero-section page-section" id="home">
        <div className="hero-content">
          <Reveal>
            <p className="hero-kicker">ONKEMETSE KHAVARA · INDEPENDENT DEVELOPER</p>
            <h1>I start with a question. <em>Then I build.</em></h1>
            <p className="hero-copy">I&apos;m Onkemetse, a developer based in Botswana. I work on websites, applications and software, with a particular interest in how things work beneath the surface.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">See what I&apos;ve built</a>
              <a className="text-link" href="#about">Get to know me</a>
            </div>
            <div className="hero-meta">
              <span>Francistown, Botswana</span>
              <span>Available for projects worldwide</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="hero-visual-wrap">
          <div className="hero-board">
            <div className="hero-board-sheet">
              <div className="hero-board-top">
                <span>ONKEMETSE KHAVARA</span>
                <span>PERSONAL WORK · 2026</span>
              </div>
              <div className="hero-board-main">
                <span className="hero-board-label">INDEPENDENT DEVELOPER</span>
                <div className="hero-monogram" aria-hidden="true">OK</div>
                <p>Websites. Software.<br /><em>Ideas in progress.</em></p>
              </div>
              <div className="hero-board-bottom">
                <span>BOTSWANA</span>
                <span>BUILDING, LEARNING, REPEATING</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="about-section page-section" id="about">
        <div className="section-heading">
          <Reveal><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curiosity was<br /><em>the starting point.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro">I&apos;ve been programming since my early teens. What started as an attempt to build a personal AI assistant grew into a long-running interest in software, systems and the things we can make with them.</p></Reveal>
        </div>
        <div className="about-grid">
          <Reveal className="about-story">
            <p>Python was my first language. At around 13, I wanted to build my own version of Jarvis. The first attempt was a small chatbot, not quite the assistant I had imagined, but it gave me a reason to keep learning.</p>
            <p>Since then, I&apos;ve worked on independent projects, taken on smaller development work and completed a Bachelor of Science in Computer Science through University of the People.</p>
            <p>These days, I&apos;m interested in building useful digital products, exploring new technologies and solving problems that sit somewhere between software and the real world.</p>
            <a className="text-link text-link-blue" href="#skills">Explore my toolkit</a>
          </Reveal>
          <Reveal delay={0.12} className="timeline-card">
            <p className="eyebrow">A FEW MILESTONES</p>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Independent programming</b><p>Started experimenting with Python, chatbots and personal software projects in my early teens.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Computer Science graduate</b><p>Bachelor of Science in Computer Science · University of the People.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Google hackathon participant</b><p>Joined a practical development challenge and learned through building with a team.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin timeline-pin-current" /><div><b>Technology & operations</b><p>Chief Technology & Operations Officer at McKay & Co Plant Hire.</p></div></div>
          </Reveal>
        </div>
      </section>

      <section className="work-section page-section" id="work">
        <div className="section-heading work-heading">
          <Reveal><p className="eyebrow">SELECTED WORK</p><h2>A few things I&apos;ve built.<br /><em>And ideas I&apos;m exploring.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro">A selection of projects and original website concepts across different industries. Concept demonstrations are clearly labelled and are not presented as commissioned client work.</p></Reveal>
        </div>
        <div className="project-toolbar">
          <div className="filter-label">EXPLORE BY CATEGORY <span>{String(filteredProjects.length).padStart(2, "0")} PROJECTS</span></div>
          <div className="filter-list" role="group" aria-label="Filter projects">
            {projectFilters.map((filter) => (
              <button key={filter} type="button" className={activeFilter === filter ? "filter-chip filter-chip-active" : "filter-chip"} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>
            ))}
          </div>
        </div>
        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
          </AnimatePresence>
        </motion.div>
        <Reveal className="project-note"><span>MORE IN THE WORKS</span><p>The demonstration library will keep growing. Each concept is being designed as its own distinct website, not a recoloured template.</p></Reveal>

        <Reveal className="pricing-section">
          <div className="pricing-title-row"><div><p className="eyebrow">WORKING TOGETHER</p><h2>Good work.<br /><em>Clear expectations.</em></h2></div><p>Starting prices for small and growing businesses. Tell me what you&apos;re trying to build and I&apos;ll help shape the right scope.</p></div>
          <CurrencyPricing />
        </Reveal>
      </section>

      <section className="skills-section page-section" id="skills">
        <div className="section-heading">
          <Reveal><p className="eyebrow">SKILLS & EXPERIENCE</p><h2>A practical toolkit.<br /><em>Always room to learn.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro">I enjoy working across the stack, from the details of an interface to the logic that makes an application useful. This is the toolkit I currently work with and continue to develop.</p></Reveal>
        </div>
        <div className="skills-layout">
          <Reveal className="language-panel">
            <div className="language-panel-heading">
              <p className="eyebrow">PROGRAMMING LANGUAGES</p>
              <span>WHAT I WORK WITH</span>
            </div>
            <div className="language-grid">
              {languages.map((language) => (
                <article className="language-card" key={language.name}>
                  <span className="language-logo-wrap">
                    <Image src={language.logo} alt="" width={38} height={38} unoptimized className={`language-logo language-logo-${language.name.toLowerCase()}`} />
                  </span>
                  <span className="language-copy">
                    <b>{language.name}</b>
                    <span>{language.detail}</span>
                  </span>
                </article>
              ))}
            </div>
          </Reveal>
          <Reveal className="skills-statement">
            <p className="eyebrow">TOOLS & TECHNOLOGIES</p>
            <h3>Different tools for different problems.</h3>
            <p>Most projects involve more than a language. These are some of the frameworks and technologies I use alongside them.</p>
            <div className="technology-list">
              {technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
            <div className="learning-note"><span>Currently exploring</span><b>Rust</b><small>Systems programming</small></div>
          </Reveal>
        </div>
        <div className="skills-footnote"><span>ALWAYS LEARNING</span><p>Currently exploring systems programming with Rust, alongside interests in AI, intelligent tools and computational research.</p></div>
      </section>

      <section className="contact-section page-section" id="contact">
        <Reveal className="contact-copy">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>Let&apos;s make<br /><em>something useful.</em></h2>
          <p>Have a business that needs a website? An idea for an application? Tell me a little about it. We can work out the next step together.</p>
          <div className="contact-bottom"><a href="https://github.com/Yasuke1711" target="_blank" rel="noreferrer" className="social-link"><GithubMark /> GitHub</a><span>Francistown, Botswana · Available worldwide</span></div>
        </Reveal>
        <Reveal delay={0.12} className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@company.com" required /></label>
            <label>What are you looking to build?
              <select name="projectType" defaultValue="Business website">
                <option>Business website</option><option>Hotel / guesthouse website</option><option>Restaurant website</option><option>Online store</option><option>Web application</option><option>Something else</option>
              </select>
            </label>
            <label>Tell me a little about it<textarea name="message" rows={4} placeholder="A few details about your project…" required /></label>
            <button className="button button-dark form-submit" type="submit">Send an enquiry</button>
            {formStatus && <p className="form-status" role="status">{formStatus}</p>}
            {!contactEmail && <p className="form-hint">Contact email will be connected before launch.</p>}
          </form>
        </Reveal>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#home">Onkemetse <span>Khavara</span></a>
        <p>Independent developer · Design, development and software.</p>
        <a href="#home" className="back-to-top">BACK TO TOP ↑</a>
        <span className="footer-year">© {new Date().getFullYear()} Onkemetse Khavara</span>
      </footer>
    </main>
  );
}
