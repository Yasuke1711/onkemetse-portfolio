"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
  { name: "Java", detail: "Object-oriented programming", logo: "/icons/java.svg" },
  { name: "JavaScript", detail: "Web interfaces and application logic", logo: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "TypeScript", detail: "Typed JavaScript development", logo: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "C#", detail: "Unity and game scripting", logo: "/icons/csharp.svg" },
  { name: "C++", detail: "Game and systems programming", logo: "https://cdn.simpleicons.org/cplusplus/00599C" },
  { name: "Assembly", detail: "Basic familiarity", logo: "/icons/assembly.svg" },
];

const technologies = [
  "React",
  "Next.js",
  "HTML & CSS",
  "Tailwind CSS",
  "APIs & integrations",
  "Qiskit",
];

function LinkedInMark() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>;
}

function InstagramMark() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.6" cy="6.7" r="1.2" fill="currentColor"/></svg>;
}

function FacebookMark() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.6 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.7V13h2.7v8h3.2Z"/></svg>;
}

function MailMark() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 34, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.82, delay, ease: [0.22, 1, 0.36, 1] }}
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
      <div className={`project-image${project.image ? (imageFailed ? " project-image-fallback" : "") : " project-image-typographic"}`} style={!project.image ? { backgroundColor: project.accent } : undefined}>
        {project.image && !imageFailed ? (
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
            <span>{project.category} / WEBSITE CONCEPT</span>
            <strong>{project.title}</strong>
          </div>
        )}
        <div className="project-image-topline">
          <span className={`project-kind ${project.kind === "Selected work" ? "project-kind-real" : ""}`}>
            {project.kind === "Selected work" ? "Selected work" : "Website concept"}
          </span>
          <span className="project-year">{project.year}</span>
        </div>
      </div>
      <div className="project-card-body">
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-card-footer">
          <div className="tag-list">
            {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          {project.caseStudy ? (
            <div className="project-actions">
              <a className="project-visit" href={`/work/${project.slug}`}>Read case study</a>
              {project.url && <a className="project-visit project-visit-secondary" href={project.url} target="_blank" rel="noreferrer">Visit website</a>}
            </div>
          ) : project.url ? (
            <a className="project-visit" href={project.url} target="_blank" rel="noreferrer">Visit website</a>
          ) : (
            <a className="project-visit" href="#contact">Discuss a website like this</a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.18 });
  return <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />;
}

function ProjectRail({ items }: { items: Project[] }) {
  const railRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start start", "end end"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const x = useSpring(rawX, { stiffness: 76, damping: 25, mass: 0.28 });
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={railRef}
      className={`project-rail${reduceMotion ? " project-rail-reduced" : ""}${items.length === 1 ? " project-rail-single" : ""}`}
      aria-label="Featured projects"
    >
      <div className="project-rail-sticky">
        <div className="project-rail-heading">
          <div>
            <p className="eyebrow">A CLOSER LOOK</p>
            <h3>Good ideas deserve<br /><em>room to breathe.</em></h3>
          </div>
          <p className="project-rail-instruction">
            Three projects. Three different directions.
            <span>{reduceMotion ? "Swipe to explore" : "Scroll to explore"}</span>
          </p>
        </div>
        <motion.div className="project-rail-track" style={reduceMotion ? undefined : { x }}>
          {items.map((project, index) => (
            <article className="project-rail-card" key={project.slug}>
              <div className="project-rail-media" style={!project.image ? { backgroundColor: project.accent } : undefined}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 760px) 84vw, 68vw"
                    unoptimized
                    className="project-rail-photo"
                  />
                ) : (
                  <div className="project-rail-fallback">{project.title}</div>
                )}
                <div className="project-rail-shade" />
                <div className="project-rail-image-meta">
                  <span>{project.kind}</span>
                  <span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                </div>
                <span className="project-rail-image-category">{project.category}</span>
              </div>
              <div className="project-rail-copy">
                <div>
                  <p className="eyebrow">{project.year} · {project.category}</p>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                </div>
                {project.caseStudy ? (
                  <div className="project-rail-actions">
                    <a href={`/work/${project.slug}`} className="project-rail-link">Read case study</a>
                    {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="project-rail-link project-rail-link-secondary">Visit website</a>}
                  </div>
                ) : project.url ? (
                  <a href={project.url} target="_blank" rel="noreferrer" className="project-rail-link">Visit website</a>
                ) : (
                  <a href="#contact" className="project-rail-link">Discuss a project</a>
                )}
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
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
    { label: "Business", amount: 6000, description: "More pages, richer content and additional functionality." },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "dragnelkhavara@gmail.com";

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    if (activeFilter === "Selected work") return projects.filter((project) => project.kind === "Selected work");
    if (activeFilter === "Website concepts") return projects.filter((project) => project.kind === "Website concept");
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const gridProjects = useMemo(() => {
    if (activeFilter === "All") return filteredProjects.filter((project) => !project.featured);
    if (activeFilter === "Selected work") return [];
    return filteredProjects;
  }, [activeFilter, filteredProjects]);

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

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const projectType = String(form.get("projectType") ?? "Website enquiry");
    const message = String(form.get("message") ?? "").trim();
    const companyWebsite = String(form.get("companyWebsite") ?? "").trim();
    const formElement = event.currentTarget;

    const openEmailFallback = (reason: string) => {
      const subject = encodeURIComponent(`Project enquiry from ${name || "portfolio visitor"}`);
      const body = encodeURIComponent(`Name: ${name}\\nEmail: ${email}\\nProject: ${projectType}\\n\\n${message}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      setFormStatus(reason);
    };

    if (!contactEmail) {
      setFormStatus("The contact inbox has not been configured yet. Please use the email address shown beside this form.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, message, companyWebsite }),
      });
      const result = (await response.json()) as { ok?: boolean; code?: string };
      if (response.ok && result.ok) {
        setFormStatus("Thanks. Your enquiry has been sent, and I will get back to you.");
        formElement.reset();
      } else if (result.code === "not_configured") {
        openEmailFallback("The online inbox is being connected. Your enquiry has been prepared in your email app instead.");
      } else {
        setFormStatus("The enquiry could not be sent just now. Please email me directly using the address shown beside this form.");
      }
    } catch {
      openEmailFallback("The online form could not connect. Your enquiry has been prepared in your email app instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <ScrollProgress />
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
            <p className="hero-kicker">INDEPENDENT DEVELOPER · BOTSWANA</p>
            <h1>I start with a question. <em>Then I build.</em></h1>
            <p className="hero-copy">I work on websites, applications and software, with a particular interest in how things work beneath the surface and how they can be made better.</p>
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
          <div className="hero-site-preview">
            <div className="hero-site-card">
              <div className="hero-site-header">
                <div className="hero-site-brand">
                  <Image src="/images/mckay-mark-gold.svg" alt="" width={46} height={32} unoptimized />
                  <span><strong>McKAY <i>&amp;</i> CO</strong><small>PLANT HIRE &amp; CONSTRUCTION</small></span>
                </div>
                <span className="hero-site-location">BOTSWANA</span>
              </div>
              <div className="hero-site-image">
                <Image
                  src="/images/mckay-hero.webp"
                  alt="Excavator at work on a prepared construction site"
                  fill
                  sizes="(max-width: 760px) 100vw, 510px"
                  unoptimized
                  className="hero-site-photo"
                />
                <div className="hero-site-image-shade" />
                <div className="hero-site-copy">
                  <span>BOTSWANA / PLANT HIRE &amp; CONSTRUCTION</span>
                  <h2>For the work<br /><em>that moves us.</em></h2>
                  <p>Equipment and project support for the work ahead.</p>
                </div>
              </div>
              <div className="hero-site-foot">
                <span>FEATURED WEBSITE <i>·</i> 2026</span>
                <a href="https://mckay-co-public-website-next.vercel.app/" target="_blank" rel="noreferrer">View live website</a>
              </div>
            </div>
            <div className="hero-site-related">
              <span className="hero-site-related-label">WEBSITE DIRECTIONS</span>
              <div className="hero-site-directions">
                <a href="#work">Hospitality</a>
                <a href="#work">Restaurants &amp; cafés</a>
                <a href="#work">Retail &amp; interiors</a>
                <a href="#work">Professional services</a>
                <a href="#work">Tourism &amp; events</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="about-section page-section" id="about">
        <div className="section-heading">
          <Reveal><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curiosity was<br /><em>the starting point.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro">I started with Python and a small attempt at building a personal AI assistant. That curiosity has since grown into work across desktop software, web applications, AI-integrated systems and independent technical research.</p></Reveal>
        </div>
        <div className="about-grid">
          <Reveal className="about-story">
            <p>At around 13, I wanted to build my own version of Jarvis. The first attempt was a simple chatbot, but it gave me a reason to keep learning. I wanted to understand not just how to use software, but how the systems behind it worked.</p>
            <p>That curiosity now takes shape in a few different ways. I created Infinite Game Master, an AI-driven roleplaying engine, and I am building The Bind Suite, a family of creative desktop applications. InkBind and SketchBind are functionally usable, while ComicBind is in development.</p>
            <p>I also developed OmniTech independently for the Google Gemini Hackathon: a camera-based field-safety assistant using Gemini Vision, structured safety classifications and safeguards. I completed a Bachelor of Science in Computer Science through University of the People in 2026, alongside introductory quantum computing studies through The Coding School (IBM).</p>
            <p>My interests continue beyond application development into AI architecture, persistent memory, computational intelligence and robotics. M.A.R.K. is one expression of that curiosity: an independent research concept for an AI research and engineering companion.</p>
            <div className="about-actions">
              <a className="text-link text-link-blue" href="#skills">Explore my toolkit</a>
              <a className="button button-outline" href="/cv">View CV <span aria-hidden="true">↗</span></a>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="timeline-card">
            <p className="eyebrow">A FEW MILESTONES</p>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Where it began</b><p>Started with Python, chatbots and an early attempt at building a personal AI assistant.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Computer Science graduate</b><p>Bachelor of Science in Computer Science · University of the People · Completed 2026.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>OmniTech · independent hackathon entry</b><p>Developed a Gemini Vision field-safety assistant independently for the Google Gemini Hackathon, with SAFE, DANGER and UNCERTAIN states, safety safeguards, Firebase logging and text-to-speech.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Creator of The Bind Suite</b><p>Building a ten-application creative software ecosystem. InkBind and SketchBind are functionally usable; ComicBind is in development.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin" /><div><b>Quantum computing foundations</b><p>Introduction to Quantum Computing · The Coding School (IBM); Introduction to Aerospace Structures &amp; Materials · edX.</p></div></div>
            <div className="timeline-item"><span className="timeline-pin timeline-pin-current" /><div><b>Technology &amp; operations</b><p>Chief Technology &amp; Operations Officer at McKay &amp; Co Plant Hire, contributing to technology development, digital infrastructure and operational planning.</p></div></div>
          </Reveal>
        </div>
      </section>

      <section className="work-section page-section" id="work">
        <div className="section-heading work-heading">
          <Reveal><p className="eyebrow">WEBSITE SHOWCASE</p><h2>One website live.<br /><em>Many directions to explore.</em></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro">One completed client website, alongside complete website concept builds for very different kinds of businesses. Each concept explores its own visual identity and customer journey; stock photography is illustrative where used.</p></Reveal>
        </div>
        <div className="project-toolbar">
          <div className="filter-label">EXPLORE WEBSITE TYPES <span>{String(filteredProjects.length).padStart(2, "0")} DIRECTIONS</span></div>
          <div className="filter-list" role="group" aria-label="Filter projects">
            {projectFilters.map((filter) => (
              <button key={filter} type="button" className={activeFilter === filter ? "filter-chip filter-chip-active" : "filter-chip"} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>
            ))}
          </div>
        </div>
        {(activeFilter === "All" || activeFilter === "Selected work") && (
          <ProjectRail items={activeFilter === "Selected work" ? projects.filter((project) => project.kind === "Selected work") : projects.filter((project) => project.featured)} />
        )}
        {gridProjects.length > 0 && (
          <>
            {activeFilter === "All" && <p className="project-collection-label">MORE DIRECTIONS TO EXPLORE <span>{String(gridProjects.length).padStart(2, "0")} CONCEPTS</span></p>}
            <motion.div layout className="project-grid">
              <AnimatePresence mode="popLayout">
                {gridProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
              </AnimatePresence>
            </motion.div>
          </>
        )}
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
                  <Image src={language.logo} alt="" width={40} height={40} unoptimized className="language-logo" />
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
        <div className="skills-footnote"><span>ALWAYS LEARNING</span><p>Quantum computing coursework introduced me to Qiskit. I&apos;m also exploring systems programming with Rust, alongside wider interests in AI and intelligent tools.</p></div>
      </section>

      <section className="contact-section page-section" id="contact">
        <Reveal className="contact-copy">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>Let&apos;s make<br /><em>something useful.</em></h2>
          <p>Have a business that needs a website? An idea for an application? Tell me a little about it. We can work out the next step together.</p>
          <div className="contact-connect">
            <p className="connect-label">FIND ME ELSEWHERE</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/onkemetse-khavara-8ba673205" target="_blank" rel="noreferrer" className="social-link"><LinkedInMark /> LinkedIn</a>
              <a href="https://www.instagram.com/kevinkhavara10/" target="_blank" rel="noreferrer" className="social-link"><InstagramMark /> Instagram</a>
              <a href="https://www.facebook.com/kevin.khavara" target="_blank" rel="noreferrer" className="social-link"><FacebookMark /> Facebook</a>
            </div>
            <p className="connect-label connect-email-label">EMAIL</p>
            <div className="contact-emails">
              <a className="email-link" href="mailto:dragnelkhavara@gmail.com"><MailMark /> dragnelkhavara@gmail.com</a>
              <a className="email-link" href="mailto:darynnparker@gmail.com"><MailMark /> darynnparker@gmail.com</a>
            </div>
            <p className="contact-location">Francistown, Botswana · Available worldwide</p>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" type="text" placeholder="Your name" maxLength={100} required /></label>
            <label>Email<input name="email" type="email" placeholder="you@company.com" maxLength={254} required /></label>
            <label>What are you looking to build?
              <select name="projectType" defaultValue="Business website">
                <option>Business website</option><option>Hotel / guesthouse website</option><option>Restaurant website</option><option>Online store</option><option>Web application</option><option>Something else</option>
              </select>
            </label>
            <label>Tell me a little about it<textarea name="message" rows={4} placeholder="A few details about your project…" maxLength={4000} required /></label>
            <label className="contact-honeypot" aria-hidden="true">Company website<input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" /></label>
            <button className="button button-dark form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send an enquiry"}</button>
            <p className="contact-privacy-note">Your details are used only to respond to this enquiry.</p>
            {formStatus && <p className="form-status" role="status">{formStatus}</p>}
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
