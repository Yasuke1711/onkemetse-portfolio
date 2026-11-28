import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import CvActions from "./cv-actions";
import "./cv.css";

export const metadata: Metadata = {
  title: "Curriculum Vitae | Onkemetse Khavara",
  description: "Professional experience, software projects, technical skills and education of Onkemetse Khavara.",
  alternates: { canonical: "/cv" },
};

const skills = [
  ["Programming", "JavaScript (ES6+), Python"],
  ["Frontend", "React, Next.js, responsive web development, component architecture, state management"],
  ["Backend & cloud", "Firebase Authentication, Cloud Firestore, REST APIs, backend integration, environment configuration"],
  ["Artificial intelligence", "Google Gemini API, Gemini Vision, prompt structuring, structured JSON outputs, vision analysis, text-to-speech"],
  ["Tools", "Git, GitHub, Visual Studio Code, Vercel, Figma"],
  ["Additional", "Desktop application development, software architecture, digital product development, UI/UX design, technical research, system design"],
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cv-section"><h2>{title}</h2>{children}</section>;
}

export default function CVPage() {
  return (
    <main className="cv-page">
      <div className="cv-toolbar">
        <Link href="/" className="cv-back">Onkemetse <span>Khavara</span></Link>
        <CvActions />
      </div>
      <article className="cv-document">
        <header className="cv-header">
          <p className="cv-kicker">CURRICULUM VITAE</p>
          <h1>Onkemetse Khavara</h1>
          <p className="cv-role">Software Developer · Computer Science Graduate · Technology &amp; Operations</p>
          <p className="cv-contact">White City, Francistown, Botswana <span>·</span> +267 756 19381 <span>·</span> darynnparker@gmail.com</p>
          <p className="cv-availability">Open to remote, hybrid and relocation opportunities</p>
        </header>

        <Section title="Professional summary">
          <p>Computer Science graduate and independent software developer with experience designing desktop applications, web platforms and AI-integrated systems. Works with JavaScript, Python, React, Next.js, Firebase and API integration. Currently serving as Chief Technology &amp; Operations Officer at McKay &amp; Co Plant Hire, contributing to technology development, digital infrastructure and operational planning.</p>
        </Section>

        <Section title="Technical skills">
          <div className="cv-skills">
            {skills.map(([label, detail]) => (
              <div className="cv-skill" key={label}><strong>{label}</strong><span>{detail}</span></div>
            ))}
          </div>
        </Section>

        <Section title="Professional experience">
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>Chief Technology &amp; Operations Officer (CTOO)</h3><span>2026–Present</span></div>
            <p className="cv-org">McKay &amp; Co Plant Hire Proprietary Limited · Botswana</p>
            <ul>
              <li>Lead technology-related initiatives and contribute to the company&apos;s broader operational development.</li>
              <li>Designed and developed the company website, establishing a digital presence and an online platform for communicating its services.</li>
              <li>Contribute to technology planning and identify digital solutions that support business operations.</li>
              <li>Work alongside company leadership to align technology initiatives with business objectives.</li>
            </ul>
          </div>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>Temporary Stock Controller</h3><span>2018</span></div>
            <p className="cv-org">Game Stores · Francistown, Botswana</p>
            <ul>
              <li>Maintained stock records and supported inventory monitoring, verification and control in a fast-paced retail environment.</li>
            </ul>
          </div>
        </Section>

        <div className="cv-page-break" />

        <Section title="Selected software engineering projects">
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>The Bind Suite</h3><span>Independent software engineering project</span></div>
            <p className="cv-org">A personal creative software ecosystem designed to connect specialised applications and improve production workflows while preserving user control, precision and flexibility.</p>
            <h4>InkBind · Writing and manuscript development</h4>
            <ul>
              <li>Built a functional desktop writing application with manuscript organisation, chapter editing, custom titles and scene breaks.</li>
              <li>Added search, typography customisation, embedded font support, EPUB export and PDF export/printing.</li>
            </ul>
            <p className="cv-status">Status: Functionally usable; undergoing bug fixes, UI refinement and further feature development.</p>
            <h4>SketchBind · Digital illustration and 2D drawing</h4>
            <ul>
              <li>Developed a functional desktop illustration application with a mouse-friendly drawing environment and editable artwork foundations.</li>
              <li>Explored a balance between geometric precision, organic expression, automated drawing assistance and direct artistic control.</li>
            </ul>
            <p className="cv-status">Status: Functionally usable; undergoing bug fixes, interface refinement and additional development.</p>
            <h4>ComicBind · Comic and manga production</h4>
            <p>In development, with a focus on panel composition, visual storytelling and reusable creative assets.</p>
            <p className="cv-status">Long-term ecosystem vision: ten specialised applications spanning writing, illustration, comics, animation, character creation, audio, video, 3D modelling, fashion design and creative asset management.</p>
          </div>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>OmniTech</h3><span>Google Gemini Hackathon · Independent entry</span></div>
            <p className="cv-org">AI-powered field safety system</p>
            <ul>
              <li>Designed and developed a safety assistant using device camera input and Google Gemini Vision.</li>
              <li>Implemented structured SAFE, DANGER and UNCERTAIN classifications with conditional application behaviour.</li>
              <li>Added safeguards against unsafe procedural guidance in hazardous or ambiguous conditions.</li>
              <li>Integrated Firebase session logging and traceability, plus text-to-speech for hands-free interaction.</li>
            </ul>
            <p className="cv-status">Technologies: React, JavaScript, Google Gemini API, Gemini Vision, Firebase and Text-to-Speech.</p>
          </div>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>Infinite Game Master</h3><span>AI-driven roleplaying engine</span></div>
            <ul>
              <li>Built a full-stack text-based roleplaying application using React and Next.js, with Google Gemini for dynamic non-player characters, narrative generation and context-aware interactions.</li>
              <li>Added Firebase-backed persistent world data and multiplayer session synchronisation, with structured JSON state for character progression and world events.</li>
            </ul>
          </div>
          <div className="cv-entry">
            <div className="cv-entry-heading"><h3>M.A.R.K</h3><span>Independent R&amp;D · Conceptual development</span></div>
            <p>Personal AI research and engineering companion exploring persistent contextual memory, voice-first interaction, advanced reasoning and tool integration. Research interests include autonomous agents, human-computer interaction, computational intelligence, engineering design and robotics.</p>
          </div>
        </Section>

        <Section title="Education & additional learning">
          <div className="cv-entry-heading"><h3>Bachelor of Science in Computer Science</h3><span>Completed 2026</span></div>
          <p className="cv-org">University of the People</p>
          <ul>
            <li>Introduction to Quantum Computing · The Coding School (IBM)</li>
            <li>Introduction to Aerospace Structures &amp; Materials · edX</li>
          </ul>
        </Section>

        <Section title="Languages">
          <p>Setswana: Native <span className="cv-dot">·</span> English: Professional <span className="cv-dot">·</span> German: Beginner <span className="cv-dot">·</span> French: Beginner <span className="cv-dot">·</span> Spanish: Beginner</p>
        </Section>

        <footer className="cv-footer">Onkemetse Khavara <span>·</span> Francistown, Botswana</footer>
      </article>
    </main>
  );
}
