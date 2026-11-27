export type ProjectKind = "Selected work" | "Concept demo";
export type ProjectCategory = "Construction" | "Retail";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  kind: ProjectKind;
  description: string;
  year: string;
  image: string;
  imageAlt: string;
  accent: string;
  tags: string[];
  url: string;
};

export const projects: Project[] = [
  {
    slug: "mckay-plant-hire",
    title: "McKay & Co Plant Hire",
    category: "Construction",
    kind: "Selected work",
    description: "A website for an equipment and plant-hire business, built around fleet presentation, project information and quotation enquiries.",
    year: "2026",
    image: "/images/mckay-hero.webp",
    imageAlt: "Excavator at work on a prepared construction site",
    accent: "#b89556",
    tags: ["Next.js", "TypeScript", "Business website"],
    url: "https://mckay-co-public-website-next.vercel.app/",
  },
  {
    slug: "kago-constructions",
    title: "Kago Constructions",
    category: "Construction",
    kind: "Concept demo",
    description: "A construction-company website demo focused on clear services, project visibility and straightforward enquiries.",
    year: "2026",
    image: "",
    imageAlt: "Kago Constructions website demo",
    accent: "#a98462",
    tags: ["Website design", "Construction", "Responsive"],
    url: "https://kagoconstructions.netlify.app/",
  },
  {
    slug: "belle-lumiere",
    title: "Belle Lumiere",
    category: "Retail",
    kind: "Concept demo",
    description: "A retail website demo with a restrained visual identity and a product-led browsing experience.",
    year: "2026",
    image: "",
    imageAlt: "Belle Lumiere website demo",
    accent: "#ad8a84",
    tags: ["Website design", "Retail", "Brand-led"],
    url: "https://belle-lumiere.netlify.app/",
  },
];

export const projectFilters = [
  "All",
  "Selected work",
  "Concept demos",
  "Construction",
  "Retail",
] as const;
