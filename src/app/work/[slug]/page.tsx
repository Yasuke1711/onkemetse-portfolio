import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../case-studies.css";

type Study = {
  slug: string; title: string; label: string; subtitle: string; year: string;
  role: string; category: string; image: string; imageAlt: string; imageNote: string;
  summary: string; context: string; contributions: string[];
  details: { title: string; description: string }[]; technologies: string[];
  boundaries: string; url: string; previous?: string; next?: string;
};

const studies: Record<string, Study> = {
  "mckay-plant-hire": {
    slug: "mckay-plant-hire", title: "McKay & Co Plant Hire",
    label: "Selected professional work",
    subtitle: "A clearer digital front door for plant hire, construction support and quotation enquiries.",
    year: "2026", role: "Chief Technology & Operations Officer · Website design and development",
    category: "Construction", image: "/images/project-captures/mckay-website-capture.webp",
    imageAlt: "Desktop screenshot of the McKay & Co Plant Hire website homepage",
    imageNote: "Website capture from the McKay & Co Plant Hire preview.",
    summary: "A business website shaped around the questions customers need answered before they request plant hire: what work is supported, which equipment categories to explore, and what information helps the team assess a job.",
    context: "Plant-hire enquiries are practical. A visitor may already know the work they need to do, but not which machine or arrangement is suitable. The website gives the business a more structured way to explain its services and begin that conversation.",
    contributions: [
      "Structured the site around construction and civil works, material movement, and waste and site logistics.",
      "Built an equipment catalogue with category and detail pages, allowing visitors to explore equipment by the work involved.",
      "Designed a quotation journey that gathers job context such as the work, site location and timing before a hire is discussed.",
      "Developed the responsive interface and supporting components, with careful wording around equipment suitability and availability."
    ],
    details: [
      { title: "A work-first information structure", description: "Service pathways start with the job customers need to complete, rather than asking visitors to understand an equipment catalogue first." },
      { title: "Equipment discovery", description: "Equipment categories and individual detail pages make the range easier to browse and give each enquiry a clearer starting point." },
      { title: "A more useful first enquiry", description: "The quotation flow is designed to collect the work context the team needs to review a request. It does not promise that a particular machine is available." }
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "Base UI", "Lucide"],
    boundaries: "This is selected professional work connected to my technology and operations role at McKay & Co. The linked Vercel address is a preview environment, not a claim that the rebuild is connected to the company's production domain. Equipment availability is confirmed by the business, not assumed by the catalogue.",
    url: "https://mckay-co-public-website-next.vercel.app/", next: "the-grand-house"
  },
  "the-grand-house": {
    slug: "the-grand-house", title: "The Grand House",
    label: "Website concept · Business tier",
    subtitle: "A multi-page boutique hotel concept built around room discovery and a guided stay enquiry.",
    year: "2026", role: "Independent concept design and development", category: "Hospitality",
    image: "/images/project-captures/grand-house-website-capture.avif",
    imageAlt: "Desktop screenshot of The Grand House website homepage",
    imageNote: "Website capture from this fictional hotel concept. Property details and rates are illustrative.",
    summary: "The Grand House explores the P6,000 business website tier: a richer multi-page presentation with room discovery, dining, a local area guide and a guided booking-enquiry journey.",
    context: "A hotel website needs to help someone decide whether the property suits their trip before asking them to enquire. The concept organises the experience around the stay itself, with a clear path from discovering a room to reviewing an enquiry.",
    contributions: [
      "Created a distinct boutique-hotel identity using a restrained charcoal, olive, cream and brass palette.",
      "Built the home and stay search, rooms and suites, dining, Cape Town neighbourhood guide, availability comparison and reservation review pages.",
      "Added browser-based date and guest search, room comparison, sample rate calculations, optional extras and an enquiry summary.",
      "Kept the booking path understandable without implying a connection to hotel inventory or payment systems."
    ],
    details: [
      { title: "Room-led discovery", description: "Room categories, amenities and indicative rates are presented so visitors can compare the shape of a stay before preparing an enquiry." },
      { title: "A guided reservation journey", description: "The date search, room comparison and reservation review keep the next step visible and reduce the need to piece together information across pages." },
      { title: "A coherent hotel identity", description: "Editorial display typography, clear navigation and a darker, architectural palette give the concept a personality separate from the other hospitality builds." }
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Responsive design", "Vercel"],
    boundaries: "The Grand House is a fictional website concept positioned at the P6,000 business tier. The property, rooms, menu, prices and policies are illustrative. The demo does not connect to a property-management system, live inventory, payment processing or real reservation submission.",
    url: "https://the-grand-house.vercel.app/", previous: "mckay-plant-hire", next: "little-acacia"
  },
  "little-acacia": {
    slug: "little-acacia", title: "Little Acacia Guest House",
    label: "Website concept · Flagship tier",
    subtitle: "A quieter, more editorial hospitality experience shaped around a private Southern African house.",
    year: "2026", role: "Independent concept design and development", category: "Hospitality",
    image: "/images/project-captures/little-acacia-website-capture.avif",
    imageAlt: "Desktop screenshot of the Little Acacia Guest House website homepage",
    imageNote: "Website capture from this fictional guest-house concept. No final property location has been selected.",
    summary: "Little Acacia represents the P9,000+ custom flagship direction: a carefully art-directed, multi-page guest experience with dedicated accommodation, dining, house, experiences and availability sections.",
    context: "The brief was to create something more considered than a conventional guest-house template. The site borrows the discipline of luxury hospitality design while giving the concept its own botanical identity, warmer editorial voice and distinct Southern African atmosphere.",
    contributions: [
      "Developed a custom visual system using deep forest green, warm paper, cream, muted brass and sand, paired with Cormorant Garamond and Jost.",
      "Built dedicated Home, The House, Stay, Dining, Experiences, Availability and enquiry pages.",
      "Created room discovery and guest/date selection interactions that filter illustrative stay options and carry a selection into the enquiry step.",
      "Designed the journey to feel calm and deliberate, with a clear distinction between exploring a stay and sending a real booking request."
    ],
    details: [
      { title: "A recognisable visual identity", description: "The acacia-inspired mark, botanical palette and editorial typography give the concept a clear identity without borrowing another hotel's branding." },
      { title: "A complete hospitality story", description: "Accommodation, dining, experiences and the character of the house each have room to breathe across dedicated pages." },
      { title: "An enquiry-first booking flow", description: "Guest and date selections can narrow illustrative options and prepare an enquiry. The flow is transparent about what it can and cannot confirm." }
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Responsive design", "Vercel"],
    boundaries: "Little Acacia is a fictional premium website concept. Its location remains broad and no final country, town or address has been selected. Property details, rooms, amenities and availability are illustrative. The demo does not provide live inventory, payment or reservation confirmation.",
    url: "https://little-acacia-weld.vercel.app/index.html", previous: "the-grand-house"
  }
};

export async function generateStaticParams() {
  return Object.keys(studies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = studies[slug];
  if (!study) return { title: "Project not found | Onkemetse Khavara" };
  return {
    title: `${study.title} | Project case study | Onkemetse Khavara`,
    description: study.subtitle,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title: `${study.title} | Onkemetse Khavara`, description: study.subtitle, type: "article", images: [{ url: study.image, alt: study.imageAlt }] }
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = studies[slug];
  if (!study) notFound();
  return (
    <main className={`case-study-page case-study-${study.slug}`}>
      <header className="case-study-nav">
        <Link href="/" className="case-wordmark">Onkemetse <span>Khavara</span></Link>
        <Link href="/#work" className="case-back-link">Back to selected work</Link>
      </header>
      <section className="case-hero shell">
        <div className="case-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/#work">Work</Link><span>/</span><span>{study.title}</span></div>
        <div className="case-hero-copy">
          <p className="case-eyebrow">{study.label} <span>·</span> {study.year}</p>
          <h1>{study.title}</h1>
          <p className="case-subtitle">{study.subtitle}</p>
        </div>
        <div className="case-hero-image">
          <Image src={study.image} alt={study.imageAlt} fill sizes="(max-width: 900px) 100vw, 1200px" unoptimized priority />
          <span className="case-image-note">{study.imageNote}</span>
        </div>
      </section>
      <section className="case-overview shell">
        <div className="case-overview-main">
          <p className="case-eyebrow">THE PROJECT</p>
          <h2>{study.summary}</h2>
          <p>{study.context}</p>
        </div>
        <aside className="case-meta">
          <div><span>My role</span><strong>{study.role}</strong></div>
          <div><span>Discipline</span><strong>{study.category}</strong></div>
          <div><span>Year</span><strong>{study.year}</strong></div>
          <div><span>Project type</span><strong>{study.label}</strong></div>
          <a href={study.url} target="_blank" rel="noreferrer" className="case-live-link">Visit the website <span aria-hidden="true">↗</span></a>
        </aside>
      </section>
      <section className="case-contribution">
        <div className="shell">
          <div className="case-section-heading">
            <p className="case-eyebrow">WHAT I WORKED ON</p>
            <h2>From the first structure<br /><em>to the final interaction.</em></h2>
          </div>
          <div className="case-contribution-grid">
            {study.contributions.map((item, index) => <article key={item} className="case-contribution-card"><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}
          </div>
        </div>
      </section>
      <section className="case-details shell">
        <div className="case-section-heading">
          <p className="case-eyebrow">DESIGN & BUILD</p>
          <h2>Details that shape<br /><em>the experience.</em></h2>
        </div>
        <div className="case-details-grid">
          {study.details.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </div>
      </section>
      <section className="case-stack">
        <div className="shell case-stack-inner">
          <div><p className="case-eyebrow">TOOLS & TECHNOLOGIES</p><h2>The build behind<br /><em>the experience.</em></h2></div>
          <div className="case-tech-list">{study.technologies.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>
      <section className="case-boundaries shell">
        <p className="case-eyebrow">SCOPE & PROJECT STATUS</p>
        <p>{study.boundaries}</p>
      </section>
      <section className="case-next shell">
        <div><p className="case-eyebrow">KEEP EXPLORING</p><h2>Good work is<br /><em>built in the details.</em></h2></div>
        <div className="case-next-actions">
          <a href={study.url} target="_blank" rel="noreferrer" className="button button-dark">Visit the website</a>
          <Link href="/#contact" className="button button-outline">Discuss a project</Link>
          {study.next && <Link href={`/work/${study.next}`} className="case-next-link">Next case study <span aria-hidden="true">↗</span></Link>}
          {!study.next && study.previous && <Link href={`/work/${study.previous}`} className="case-next-link">Previous case study <span aria-hidden="true">↗</span></Link>}
        </div>
      </section>
      <footer className="case-footer shell">
        <Link href="/" className="case-wordmark">Onkemetse <span>Khavara</span></Link>
        <p>Independent developer · Botswana</p>
        <Link href="/#work">Back to portfolio</Link>
      </footer>
    </main>
  );
}
