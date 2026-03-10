import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Mail, Phone, Globe, MapPin, ExternalLink } from "lucide-react";
import { SiLinkedin, SiGithub } from "react-icons/si";

// ─── Game Config ──────────────────────────────────────────────────────────────
const W = 820, H = 560;
const PITCH = { x: 30, y: 30, w: W - 60, h: H - 60 };
const PLAYER_SPEED = 175;
const SPOT_R = 36;
const BALL_R = 9;
const GOAL_W = 140, GOAL_H = 22;
const GOAL_X = W / 2, GOAL_Y = PITCH.y + 4;
const KICK_SPEED = 420;
const GOAL_DETECT_Y = PITCH.y + 26;

// ─── Pitch Spots ─────────────────────────────────────────────────────────────
const SPOTS = [
  { id: "about",        label: "ABOUT",       icon: "👤", x: 185,  y: 135, color: "#00b4d8", brief: "Abu Hasnayen Zillanee\nProduct Dev Executive\nCTO · Data Scientist\nDhaka, Bangladesh" },
  { id: "experience",   label: "EXPERIENCE",  icon: "💼", x: 410,  y: 155, color: "#7209b7", brief: "Product Exec — CartUp\nBiz Analyst — Best Tuition\nCTO — Zillanee Engineers\nSupply Chain — Huawei" },
  { id: "projects",     label: "PROJECTS",    icon: "🚀", x: 640,  y: 135, color: "#f72585", brief: "WMS — CartUp SaaS\nSPI Time Series (LSTM)\nGAN Sketch-to-Image\nE-Commerce Flutter App" },
  { id: "skills",       label: "SKILLS",      icon: "⚡", x: 155,  y: 310, color: "#4cc9f0", brief: "Product: PRD/SRS · Agile\nData: Python · SQL · ML\nViz: Power BI · Tableau\nCloud: AWS · GCP · Azure" },
  { id: "publications", label: "RESEARCH",    icon: "📚", x: 660,  y: 310, color: "#f4a261", brief: "Retinopathy + XAI (IEEE)\nGAN Image Gen (ICEEICT)\nSentiment NLP (IEEE CSDE)\nMultilingual NLP (ICEEICT)" },
  { id: "education",    label: "EDUCATION",   icon: "🎓", x: 260,  y: 430, color: "#2dc653", brief: "BSc CSE — BRAC Uni\nCGPA 3.67 / 4.00\nDean's List × 2\nVC List × 4" },
  { id: "contact",      label: "CONTACT",     icon: "📡", x: 560,  y: 430, color: "#f9c74f", brief: "hasnayen3072@gmail.com\n+880 1841343493\nlinkedin/abu-hasnayen\ngithub.com/hasnayen" },
];

// ─── Full Details Data ────────────────────────────────────────────────────────
const DETAILS = {
  experience: [
    {
      role: "Product (SaaS) Executive",
      company: "US-Bangla Group (CartUp Ltd.)",
      period: "Aug 2025 – Present",
      color: "#7209b7",
      bullets: [
        "Spearheaded end-to-end lifecycle of the Warehouse Management System (WMS) with PRDs, SRS, and Agile sprints",
        "Implemented ML-based data analytics for real-time order tracking, improving accuracy and operational efficiency",
        "Designed smart category feature and responsive navigation dropdown to enhance product discovery",
        "Launched order-cancellation-within-30-min feature, boosting customer trust and flexibility",
        "Led UAT and cross-functional coordination across UI/UX, engineering, and stakeholders",
      ],
    },
    {
      role: "Business Strategy Analyst",
      company: "Best Tuition Bangladesh",
      period: "Jan 2025 – Aug 2025",
      color: "#7209b7",
      bullets: [
        "Defined BRDs, SRS, and user stories for an online learning platform",
        "Conducted user and market research, improving engagement by 15%",
        "Utilized data analysis and performance reporting to lead UAT and validate product roadmap decisions",
        "Partnered with engineering and design to optimise user journeys",
      ],
    },
    {
      role: "CTO",
      company: "Zillanee Engineers & Construction",
      period: "Sep 2024 – Present",
      color: "#00b4d8",
      bullets: [
        "Led end-to-end SAP ERP integration for project management, procurement, and resource allocation",
        "Implemented ML-driven analytics systems for real-time project tracking and optimisation",
        "Integrate AI and IoT to enhance construction workflows and data-driven decision-making",
      ],
    },
    {
      role: "Supply Chain Executive",
      company: "Huawei Technologies (Bangladesh) Ltd.",
      period: "Dec 2023 – Aug 2024",
      color: "#f4a261",
      bullets: [
        "Optimised inventory management with ML algorithms, improving supply chain efficiency",
        "Applied time-series analysis for forecast-driven procurement strategies",
        "Developed forecasting models and dashboards, reducing delivery delays by 20%",
        "Designed inventory mapping systems and supplier performance trackers",
      ],
    },
    {
      role: "Intern Solution Architect",
      company: "Huawei Technologies (Bangladesh) Ltd.",
      period: "Mar 2023 – Aug 2023",
      color: "#f4a261",
      bullets: [
        "Designed scalable cloud-based architectures integrating large datasets for cloud deployment",
        "Developed data pipelines and automated analysis solutions",
        "Contributed to technical specifications and architecture diagrams for cloud deployment",
      ],
    },
  ],
  projects: [
    {
      name: "Warehouse Management System (WMS)",
      desc: "SaaS product for CartUp — end-to-end logistics management with smart category features, order workflows, and real-time tracking dashboards.",
      tags: ["Product", "SaaS", "Agile", "PRD/SRS"],
      link: "https://www.figma.com/design/lJF8vPfDUhgpEZlqR1VVvr/Cartup-Warehouse",
    },
    {
      name: "SPI Time Series Analysis",
      desc: "Forecasting drought severity using Standardised Precipitation Index with ARIMA, SARIMA, and LSTM deep learning models.",
      tags: ["Data Science", "Time Series", "LSTM", "Python"],
      link: "https://github.com/hasnayen/Time-Series-Analysis-of-SPI-Standardized-Precipitation-Index-",
    },
    {
      name: "GAN Sketch-to-Image (BSc Thesis)",
      desc: "Generating photorealistic images from hand-drawn sketches using a GAN-based deep learning approach — published at 6th ICEEICT.",
      tags: ["Deep Learning", "GAN", "Computer Vision", "Python"],
      link: "https://dspace.bracu.ac.bd/xmlui/handle/10361/16818",
    },
    {
      name: "Retinopathy Detection + XAI",
      desc: "Automated early detection of diabetic retinopathy integrating deep learning models with Explainable AI — published in IEEE Access.",
      tags: ["Healthcare AI", "XAI", "TensorFlow", "IEEE"],
      link: "",
    },
    {
      name: "E-Commerce Android App",
      desc: "Full-featured e-commerce mobile application built with Flutter and Firebase, supporting product browsing and checkout.",
      tags: ["Flutter", "Firebase", "Mobile", "Dart"],
      link: "https://github.com/hasnayen/uecom",
    },
    {
      name: "To-Do List Android App",
      desc: "Multi-user task management application using Flutter and SQLite with offline support.",
      tags: ["Flutter", "SQLite", "Mobile", "Dart"],
      link: "https://github.com/hasnayen/To-Do-List",
    },
  ],
  skills: [
    {
      cat: "Product Management",
      color: "#7209b7",
      items: ["PRD / SRS / BRD", "User Stories", "UAT", "Agile / Scrum", "Product Strategy", "Roadmapping", "Stakeholder Communication", "Market Research", "User Journey Mapping", "Pendo", "Jira"],
    },
    {
      cat: "Data Science & Analytics",
      color: "#00b4d8",
      items: ["Python (Pandas, NumPy, Scikit-learn, Matplotlib)", "SQL (PostgreSQL, MySQL)", "NoSQL (MongoDB)", "Machine Learning", "NLP", "Time Series Analysis", "Power BI", "Tableau", "Seaborn", "Excel (Advanced)", "Jupyter Notebooks"],
    },
    {
      cat: "Data Engineering & Cloud",
      color: "#4cc9f0",
      items: ["ETL Processes", "Data Warehousing", "Hadoop", "Spark", "AWS", "Azure", "GCP", "Huawei Cloud", "REST APIs", "CI/CD Awareness", "Git / GitHub"],
    },
    {
      cat: "AI Tools",
      color: "#f72585",
      items: ["ChatGPT", "ChatPRD", "Notion AI", "Perplexity", "Claude", "Gemini", "Grok", "Lovable", "Figma AI", "Canva AI"],
    },
    {
      cat: "Development",
      color: "#2dc653",
      items: ["Python", "Flutter / Dart", "Bash", "Web Scraping", "Firebase", "TensorFlow", "GAN / Deep Learning"],
    },
  ],
  publications: [
    {
      title: "Enhancing Early Detection of Diabetic Retinopathy Through the Integration of Deep Learning Models and Explainable Artificial Intelligence",
      venue: "IEEE Access, vol. 12, pp. 73950–73969",
      year: "2024",
      link: "https://ieeexplore.ieee.org/document/10527358",
    },
    {
      title: "Generating Photorealistic Images from Human-Generated Sketches: A GAN-based Synthesis Approach for Enhanced Visual Realism",
      venue: "6th ICEEICT (Conference), pp. 160–165",
      year: "2024",
      link: "https://ieeexplore.ieee.org/document/10534580",
    },
    {
      title: "Multilingual Sentiment Analysis on Social Media: Harnessing Deep Learning for Enhanced Insights and Decision Support for Foreign Travelers",
      venue: "6th ICEEICT (Conference), pp. 166–171",
      year: "2024",
      link: "https://ieeexplore.ieee.org/document/10534652",
    },
    {
      title: "Automated Sentiment Analysis for Web-Based Stock and Cryptocurrency News Summarization with Transformer-Based Models",
      venue: "IEEE Asia-Pacific CSDE, Nadi, Fiji, pp. 1–6",
      year: "2023",
      link: "https://ieeexplore.ieee.org/document/10416530",
    },
  ],
  certifications: [
    { name: "Certified SQL Associate", issuer: "DataCamp", year: "2025", id: "SQA0010977907566", link: "https://www.datacamp.com/certificate/SQA0010977907566" },
    { name: "Associate Data Analyst", issuer: "DataCamp", year: "2024", id: "DAA0015351231353", link: "https://www.datacamp.com/certificate/DAA0015351231353" },
    { name: "Data Science & Machine Learning with Python", issuer: "OSTAD", year: "2024", id: "", link: "https://ostad.app/share/certificate/a19014-abu-hasnayen-zillanee" },
    { name: "Data Analysis with Python", issuer: "IBM / Coursera", year: "2023", id: "", link: "https://coursera.org/share/fd7e4ee8bd002544e04dccdfb1b68f82" },
    { name: "Cloud Computing: Business Requirements & Digital Transformation", issuer: "Coursera", year: "2023", id: "", link: "" },
    { name: "Android Apps Development (Flutter)", issuer: "SEIP / Pencilbox", year: "2022", id: "", link: "" },
  ],
  awards: [
    { title: "Dean's List", body: "BRAC University", detail: "Awarded twice for academic excellence" },
    { title: "Vice Chancellor's List", body: "BRAC University", detail: "Awarded four times for maintaining high academic standards" },
    { title: "1st Runner Up — Expression Art", body: "BRAC University", detail: "Art competition on Life & Vision of Sir Fazle Hasan Abed" },
    { title: "1st Prize — Science Fair 2011", body: "Inter-school", detail: "Flood Alarm: early warning system for floods in Bangladesh" },
  ],
};

// ─── Name Entry Screen ────────────────────────────────────────────────────────
function NameEntry({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0096c7");
  const COLORS = ["#0096c7", "#f72585", "#2dc653", "#f9c74f", "#7209b7", "#f4a261", "#e63946"];

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a2240 0%, #071628 50%, #0a1a30 100%)" }}>
      {/* Pitch lines bg */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-white" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <div className="text-center space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] text-cyan-400/70 uppercase">Abu Hasnayen Zillanee</p>
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-white" style={{ textShadow: "0 0 30px rgba(0,180,216,0.5)" }}>
            Portfolio
          </h1>
          <p className="font-mono text-sm text-cyan-300/60">The Football Experience</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Jersey Preview */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="160" viewBox="0 0 140 160">
              {/* Jersey body */}
              <path d="M 30 40 L 10 80 L 30 85 L 30 145 L 110 145 L 110 85 L 130 80 L 110 40 L 85 30 C 85 45 55 45 55 30 Z"
                fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              {/* Sleeve */}
              <path d="M 30 40 L 10 80 L 30 85 L 40 60 Z" fill={color} style={{ filter: "brightness(0.85)" }} />
              <path d="M 110 40 L 130 80 L 110 85 L 100 60 Z" fill={color} style={{ filter: "brightness(0.85)" }} />
              {/* Collar */}
              <ellipse cx="70" cy="32" rx="15" ry="6" fill="rgba(0,0,0,0.3)" />
              {/* Name */}
              <text x="70" y="98" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace"
                fill="white" style={{ textShadow: "0 0 4px rgba(0,0,0,0.8)" }}>
                {(name || "YOUR NAME").toUpperCase().slice(0, 10)}
              </text>
              {/* Number */}
              <text x="70" y="130" textAnchor="middle" fontSize="30" fontWeight="bold" fontFamily="serif" fill="white" opacity="0.9">10</text>
            </svg>
            <p className="font-mono text-[10px] text-center text-cyan-400/50 mt-1">YOUR JERSEY</p>
          </div>

          {/* Input panel */}
          <div className="space-y-5">
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)" }}>
              <div>
                <label className="block font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-2">
                  Enter Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  maxLength={12}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && onStart(name.trim())}
                  placeholder="e.g. ALEX"
                  className="w-full px-4 py-2.5 rounded-xl font-mono text-sm text-white outline-none"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,180,216,0.3)", caretColor: "#00b4d8" }}
                  data-testid="input-player-name"
                />
                <p className="font-mono text-[9px] text-cyan-400/40 mt-1">It will appear on your jersey</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest mb-2">Kit Colour</p>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background: c, borderColor: color === c ? "white" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
            <Button
              data-testid="button-start-game"
              onClick={() => name.trim() && onStart(name.trim())}
              disabled={!name.trim()}
              className="w-full font-mono text-sm gap-2 py-3"
              style={{ background: color, borderColor: color }}
            >
              <span>⚽</span> Kick Off!
            </Button>
          </div>
        </div>

        <p className="font-mono text-[10px] text-cyan-300/40 text-center">
          Move with WASD · Walk to spots to see info · Reach the goal to see full portfolio
        </p>
      </div>
    </div>
  );
}

// ─── Goal Screen ──────────────────────────────────────────────────────────────
type GoalTab = "about" | "xp" | "projects" | "skills" | "publications" | "certs";

function GoalScreen({ playerName, kitColor, onReplay }: { playerName: string; kitColor: string; onReplay: () => void }) {
  const [tab, setTab] = useState<GoalTab>("about");
  const [expandedExp, setExpandedExp] = useState<number | null>(0);

  const TABS: { key: GoalTab; label: string; icon: string }[] = [
    { key: "about",        label: "About",       icon: "👤" },
    { key: "xp",           label: "Experience",  icon: "💼" },
    { key: "projects",     label: "Projects",    icon: "🚀" },
    { key: "skills",       label: "Skills",      icon: "⚡" },
    { key: "publications", label: "Research",    icon: "📚" },
    { key: "certs",        label: "Certs",       icon: "🏅" },
  ];

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: "#071628" }}>
      {/* Banner */}
      <div className="relative overflow-hidden py-10 text-center" style={{ background: `linear-gradient(135deg, ${kitColor}33, #071628)`, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="absolute inset-0 pointer-events-none select-none">
          {["⚽","🎉","⭐","🏆","🎊","⚽","🎉","⭐","🏆","🎊","⚽","🎉"].map((e, i) => (
            <span key={i} className="absolute text-2xl animate-bounce" style={{ left: `${(i * 8.5) % 90}%`, top: `${(i * 13) % 80}%`, animationDelay: `${(i * 0.13) % 1.5}s` }}>{e}</span>
          ))}
        </div>
        <p className="font-mono text-xs tracking-[0.3em] uppercase mb-1 relative z-10" style={{ color: kitColor }}>GOAL!</p>
        <h1 className="font-serif font-bold text-5xl md:text-6xl text-white mb-2 relative z-10">Full Profile</h1>
        <p className="font-mono text-sm text-white/50 relative z-10">{playerName} scored! Here's everything about Abu.</p>
      </div>

      {/* Navigation tabs */}
      <div className="sticky top-0 z-10 flex overflow-x-auto border-b" style={{ background: "#071628", borderColor: "rgba(255,255,255,0.08)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-4 py-3 font-mono text-xs transition-colors whitespace-nowrap"
            style={{ color: tab === t.key ? kitColor : "rgba(255,255,255,0.4)", borderBottom: tab === t.key ? `2px solid ${kitColor}` : "2px solid transparent" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── ABOUT ── */}
        {tab === "about" && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.2)" }}>
                <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: kitColor }}>// PLAYER CARD</p>
                <div>
                  <h2 className="font-serif font-bold text-2xl text-white">Abu Hasnayen Zillanee</h2>
                  <p className="font-mono text-sm text-white/60 mt-1">Product Dev Executive · CTO · Data Scientist</p>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: <MapPin className="w-3.5 h-3.5" />, text: "12 no Khajadewan, 2nd Lane, Lalbag, Dhaka-1211" },
                    { icon: <Mail className="w-3.5 h-3.5" />, href: "mailto:hasnayen3072@gmail.com", text: "hasnayen3072@gmail.com" },
                    { icon: <Phone className="w-3.5 h-3.5" />, text: "+880 1841343493" },
                    { icon: <Globe className="w-3.5 h-3.5" />, href: "https://abuhasnayenzillanee.wixsite.com/abuhanayenzillanee", text: "Personal Website" },
                  ].map(({ icon, href, text }) => (
                    href
                      ? <a key={text} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs hover:text-white/80 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                          <span style={{ color: kitColor }}>{icon}</span>{text}
                        </a>
                      : <div key={text} className="flex items-center gap-2 font-mono text-xs text-white/50">
                          <span style={{ color: kitColor }}>{icon}</span>{text}
                        </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-1 flex-wrap">
                  <a href="https://www.linkedin.com/in/abu-hasnayen-zillanee-7543a11a5/" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-[10px] text-white/40 hover:text-white transition-colors">
                    <SiLinkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href="https://github.com/hasnayen" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-[10px] text-white/40 hover:text-white transition-colors">
                    <SiGithub className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a href="https://leetcode.com/u/hasnayen3072/" target="_blank" rel="noreferrer" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors">
                    🧩 LeetCode
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "+2 yrs", l: "Product Exp", icon: "📦" },
                  { v: "4", l: "IEEE Papers", icon: "📚" },
                  { v: "5+", l: "Roles", icon: "💼" },
                  { v: "3.67", l: "CGPA / 4.00", icon: "🎓" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="font-mono font-bold text-xl text-white">{s.v}</p>
                    <p className="font-mono text-[10px] text-white/40 uppercase mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">// PROFESSIONAL SUMMARY</p>
              <p className="text-sm text-white/65 leading-relaxed">
                Product Development Executive with a strong background in analytics, AI-driven decision-making, and end-to-end product lifecycle management. Experienced in leading feature development, conducting user and market research, and aligning cross-functional teams to drive adoption, retention, and growth in digital products. Passionate about transforming business requirements into scalable, customer-focused solutions.
              </p>
            </div>

            {/* Education */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(45,198,83,0.06)", border: "1px solid rgba(45,198,83,0.18)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">// EDUCATION</p>
              <div className="space-y-3">
                <div>
                  <p className="font-mono font-bold text-sm text-white">BSc in Computer Science & Engineering</p>
                  <p className="font-mono text-xs text-white/50">BRAC University, Dhaka · 2018 – 2022</p>
                  <p className="font-mono text-xs mt-1" style={{ color: "#2dc653" }}>CGPA: 3.67 / 4.00 · High Distinction · Dean's List × 2 · VC List × 4</p>
                  <p className="font-mono text-[10px] text-white/40 mt-0.5">Thesis: Generation of Realistic Images from Human Drawn Sketches using Deep Learning</p>
                </div>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div>
                  <p className="font-mono font-bold text-xs text-white">HSC (Science) — Dhaka City College · 2015–2017 · GPA 4.92/5.00</p>
                </div>
                <div>
                  <p className="font-mono font-bold text-xs text-white">SSC (Science) — Engineering University School · 2015 · GPA 4.92/5.00</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(249,199,79,0.06)", border: "1px solid rgba(249,199,79,0.18)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">// HONOURS & AWARDS</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {DETAILS.awards.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">🏆</span>
                    <div>
                      <p className="font-mono font-bold text-xs text-white">{a.title}</p>
                      <p className="font-mono text-[10px] text-white/40">{a.body} · {a.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {tab === "xp" && (
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-4">// WORK EXPERIENCE</p>
            {DETAILS.experience.map((exp, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${exp.color}30` }}>
                <button
                  onClick={() => setExpandedExp(expandedExp === i ? null : i)}
                  className="w-full text-left p-4 flex items-start gap-4 transition-colors"
                  style={{ background: expandedExp === i ? `${exp.color}14` : `${exp.color}08` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5" style={{ background: exp.color + "25", color: exp.color }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-sm text-white leading-snug">{exp.role}</p>
                    <p className="font-mono text-xs text-white/55 mt-0.5">{exp.company}</p>
                    <p className="font-mono text-[10px] mt-1" style={{ color: exp.color + "bb" }}>{exp.period}</p>
                  </div>
                  <span className="font-mono text-white/30 text-sm flex-shrink-0">{expandedExp === i ? "▲" : "▼"}</span>
                </button>
                {expandedExp === i && (
                  <div className="px-4 pb-4 pt-1" style={{ background: `${exp.color}08` }}>
                    <ul className="space-y-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 font-mono text-[11px] text-white/60">
                          <span style={{ color: exp.color }} className="mt-0.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">// PROJECTS <span className="text-white/20">· click to open</span></p>
            {DETAILS.projects.map((p, i) => {
              const El = p.link ? "a" : "div";
              return (
                <El
                  key={i}
                  {...(p.link ? { href: p.link, target: "_blank", rel: "noreferrer" } : {})}
                  className={`group block rounded-xl p-5 space-y-3 transition-all duration-200 ${p.link ? "cursor-pointer" : ""}`}
                  style={{ background: "rgba(247,37,133,0.07)", border: "1px solid rgba(247,37,133,0.18)" }}
                  onMouseEnter={p.link ? (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = "rgba(247,37,133,0.15)") : undefined}
                  onMouseLeave={p.link ? (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = "rgba(247,37,133,0.07)") : undefined}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono font-bold text-sm text-white leading-snug group-hover:text-pink-300 transition-colors">{p.name}</p>
                    {p.link && <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-pink-400/50 group-hover:text-pink-400 transition-colors" />}
                  </div>
                  <p className="font-mono text-[11px] text-white/55 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(t => (
                      <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(247,37,133,0.15)", color: "#f72585" }}>{t}</span>
                    ))}
                  </div>
                </El>
              );
            })}
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === "skills" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">// SKILLS</p>
            {DETAILS.skills.map((cat, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: cat.color + "0d", border: `1px solid ${cat.color}25` }}>
                <p className="font-mono text-xs font-bold mb-3" style={{ color: cat.color }}>{cat.cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map(s => (
                    <span key={s} className="font-mono text-[10px] px-2 py-1 rounded" style={{ background: cat.color + "18", color: "rgba(255,255,255,0.75)" }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PUBLICATIONS ── */}
        {tab === "publications" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">// RESEARCH PUBLICATIONS <span className="text-white/20">· click to open</span></p>
            {DETAILS.publications.map((pub, i) => (
              <a
                key={i}
                href={pub.link}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl p-5 flex gap-4 transition-all duration-200 cursor-pointer"
                style={{ background: "rgba(244,162,97,0.07)", border: "1px solid rgba(244,162,97,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(244,162,97,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(244,162,97,0.07)")}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 font-mono font-bold" style={{ background: "rgba(244,162,97,0.2)", color: "#f4a261" }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono font-bold text-sm text-white leading-snug group-hover:text-orange-300 transition-colors">{pub.title}</p>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-orange-400/50 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="font-mono text-xs mt-1.5" style={{ color: "#f4a261" }}>{pub.venue}</p>
                  <p className="font-mono text-[10px] text-white/35 mt-0.5">{pub.year}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── CERTIFICATIONS ── */}
        {tab === "certs" && (
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">// CERTIFICATIONS</p>
            {DETAILS.certifications.map((c, i) => (
              <div key={i} className="rounded-xl p-4 flex items-start gap-4" style={{ background: "rgba(0,180,216,0.07)", border: "1px solid rgba(0,180,216,0.18)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(0,180,216,0.2)" }}>🏅</div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-sm text-white leading-snug">{c.name}</p>
                  <p className="font-mono text-xs text-white/50 mt-0.5">{c.issuer} · {c.year}</p>
                  {c.id && <p className="font-mono text-[10px] text-white/30 mt-0.5">ID: {c.id}</p>}
                </div>
                {c.link && (
                  <a href={c.link} target="_blank" rel="noreferrer" className="flex-shrink-0 text-white/30 hover:text-cyan-400 transition-colors mt-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}

            {/* Leadership */}
            <div className="mt-6 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-3">// LEADERSHIP & VOLUNTEERING</p>
              <div className="space-y-2">
                {[
                  { role: "Creative Designer", org: "BRACU Express", period: "2018–2022" },
                  { role: "Executive", org: "BRACU Adventure Club", period: "2018–2020" },
                  { role: "Event Planner", org: "BRACU Robotics Club", period: "2018–2022" },
                  { role: "Member (Scout)", org: "Lalbagh Open Scout", period: "2019–Present" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm">🎖</span>
                    <p className="font-mono text-xs text-white/60">
                      <span className="text-white/80 font-bold">{l.role}</span> — {l.org} <span className="text-white/35">· {l.period}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t py-8 text-center space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="mailto:hasnayen3072@gmail.com" className="font-mono text-xs px-4 py-2 rounded-lg" style={{ background: kitColor + "20", color: kitColor, border: `1px solid ${kitColor}30` }}>
            📧 Send Email
          </a>
          <a href="https://www.linkedin.com/in/abu-hasnayen-zillanee-7543a11a5/" target="_blank" rel="noreferrer" className="font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <SiLinkedin className="w-3 h-3" /> LinkedIn
          </a>
          <a href="https://github.com/hasnayen" target="_blank" rel="noreferrer" className="font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <SiGithub className="w-3 h-3" /> GitHub
          </a>
        </div>
        <button onClick={onReplay} className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">
          ⚽ Play Again
        </button>
      </div>
    </div>
  );
}

// ─── Main Canvas Game ─────────────────────────────────────────────────────────
function PitchGame({
  playerName, kitColor, onGoal
}: {
  playerName: string;
  kitColor: string;
  onGoal: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const stateRef = useRef({
    px: W / 2, py: H / 2,
    bx: W / 2 + 24, by: H / 2,
    bvx: 0, bvy: 0,
    ballKicked: false,
    facingRight: true,
    moving: false,
    walkFrame: 0,
    visitedSpots: new Set<string>(),
    activeSpot: null as string | null,
    showShootHint: false,
    scored: false,
    // coin system
    coinIdx: 0,
    score: 0,
    allCoinsCollected: false,
    coinCollectAnim: 0,
    popUps: [] as { x: number; y: number; text: string; life: number }[],
  });
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [visitedSpots, setVisitedSpots] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const tryAgainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showLazyTip, setShowLazyTip] = useState(true);
  const lazyTipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleRef = useRef(1);

  const kitHex = kitColor;

  // ─ Draw helpers ──────────────────────────────────────────────────────────
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  const drawPitch = useCallback((ctx: CanvasRenderingContext2D) => {
    const p = PITCH;

    // ── Outer surround ──
    ctx.fillStyle = "#0d3d1a";
    ctx.fillRect(0, 0, W, H);

    // ── Grass stripes (horizontal, alternating) ──
    const stripeH = p.h / 10;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#1a7a32" : "#1d8a38";
      ctx.fillRect(p.x, p.y + i * stripeH, p.w, stripeH);
    }

    // ── Grass vignette edge shadow ──
    const vg = ctx.createRadialGradient(W / 2, H / 2, p.h * 0.25, W / 2, H / 2, p.h * 0.75);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    // ── White markings ──
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    // Pitch outline
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    // Halfway line
    ctx.beginPath(); ctx.moveTo(p.x, p.y + p.h / 2); ctx.lineTo(p.x + p.w, p.y + p.h / 2); ctx.stroke();

    // Center circle
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 58, 0, Math.PI * 2); ctx.stroke();

    // Center spot
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(W / 2, H / 2, 3.5, 0, Math.PI * 2); ctx.fill();

    // Corner arcs (quarter circles, r=12)
    const corners: [number, number, number, number][] = [
      [p.x, p.y, 0, Math.PI / 2],
      [p.x + p.w, p.y, Math.PI / 2, Math.PI],
      [p.x + p.w, p.y + p.h, Math.PI, Math.PI * 3 / 2],
      [p.x, p.y + p.h, Math.PI * 3 / 2, Math.PI * 2],
    ];
    corners.forEach(([cx, cy, sa, ea]) => {
      ctx.beginPath(); ctx.arc(cx, cy, 12, sa, ea); ctx.stroke();
    });

    // Top penalty area + goal box
    ctx.strokeRect(W / 2 - 100, p.y, 200, 72);
    ctx.strokeRect(W / 2 - 50, p.y, 100, 36);
    // Top penalty spot
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(W / 2, p.y + 52, 3, 0, Math.PI * 2); ctx.fill();
    // Top penalty arc (semi-circle outside box)
    ctx.beginPath(); ctx.arc(W / 2, p.y + 52, 42, 0.35, Math.PI - 0.35); ctx.stroke();

    // Bottom penalty area + goal box
    ctx.strokeStyle = "rgba(255,255,255,0.92)"; ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 100, p.y + p.h - 72, 200, 72);
    ctx.strokeRect(W / 2 - 50, p.y + p.h - 36, 100, 36);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(W / 2, p.y + p.h - 52, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W / 2, p.y + p.h - 52, 42, Math.PI + 0.35, Math.PI * 2 - 0.35); ctx.stroke();

    // ── Goal post (top) — visible, 3D-looking ──
    const gLeft = W / 2 - GOAL_W / 2;
    const gRight = W / 2 + GOAL_W / 2;
    const gTop = p.y - GOAL_H - 6;
    const gBot = p.y;

    // Goal net background (deep shadow)
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(gLeft + 5, gTop + 5, GOAL_W - 10, GOAL_H + 1);

    // Net grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 0.8;
    for (let i = 1; i <= 7; i++) {
      const gx = gLeft + i * (GOAL_W / 8);
      ctx.beginPath(); ctx.moveTo(gx, gTop); ctx.lineTo(gx, gBot); ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) {
      const gy = gTop + i * (GOAL_H / 4);
      ctx.beginPath(); ctx.moveTo(gLeft, gy); ctx.lineTo(gRight, gy); ctx.stroke();
    }

    // Left post (thick white tube)
    const postW = 7;
    ctx.fillStyle = "#e8e8e8";
    ctx.fillRect(gLeft - postW / 2, gTop, postW, GOAL_H + postW);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(gLeft + postW / 2 - 2, gTop, 2, GOAL_H + postW);

    // Right post
    ctx.fillStyle = "#e8e8e8";
    ctx.fillRect(gRight - postW / 2, gTop, postW, GOAL_H + postW);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(gRight - postW / 2, gTop, 2, GOAL_H + postW);

    // Crossbar (top horizontal)
    ctx.fillStyle = "#e8e8e8";
    ctx.fillRect(gLeft - postW / 2, gTop, GOAL_W + postW, postW);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(gLeft - postW / 2, gTop + postW - 2, GOAL_W + postW, 2);

    // Goal line glow
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gLeft, gBot); ctx.lineTo(gRight, gBot); ctx.stroke();
    ctx.shadowBlur = 0;

    // Post glow outline
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1;
    ctx.strokeRect(gLeft - postW / 2, gTop, GOAL_W + postW, GOAL_H + postW);

    ctx.lineWidth = 1;
  }, []);

  const drawSpots = useCallback((ctx: CanvasRenderingContext2D, s: typeof stateRef.current) => {
    const t = Date.now() / 1000;
    SPOTS.forEach((spot) => {
      const visited = s.visitedSpots.has(spot.id);
      const active = s.activeSpot === spot.id;
      const pulse = 0.6 + Math.sin(t * 2 + SPOTS.indexOf(spot)) * 0.4;

      // Outer glow
      const grad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, SPOT_R + 10);
      grad.addColorStop(0, spot.color + (active ? "88" : visited ? "44" : "33"));
      grad.addColorStop(1, spot.color + "00");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(spot.x, spot.y, SPOT_R + 10, 0, Math.PI * 2); ctx.fill();

      // Circle
      ctx.fillStyle = spot.color + (active ? "50" : "28");
      ctx.beginPath(); ctx.arc(spot.x, spot.y, SPOT_R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = spot.color;
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.globalAlpha = active ? 1 : 0.7 + pulse * 0.3;
      ctx.beginPath(); ctx.arc(spot.x, spot.y, SPOT_R, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      // Icon + label
      ctx.textAlign = "center";
      ctx.font = "16px sans-serif"; ctx.fillText(spot.icon, spot.x, spot.y - 4);
      ctx.font = `bold 8px monospace`; ctx.fillStyle = visited ? spot.color : "rgba(255,255,255,0.8)";
      ctx.fillText(spot.label, spot.x, spot.y + 14);
      if (visited) {
        ctx.font = "10px sans-serif"; ctx.fillText("✓", spot.x + SPOT_R - 8, spot.y - SPOT_R + 10);
      }
    });
    ctx.textAlign = "left";
  }, []);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, s: typeof stateRef.current) => {
    const { px, py, facingRight, moving, walkFrame } = s;
    const legSwing = moving ? Math.sin(walkFrame * 0.3) * 6 : 0;

    ctx.save();
    ctx.translate(px, py);
    if (!facingRight) ctx.scale(-1, 1);
    ctx.scale(1.55, 1.55);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.ellipse(0, 18, 14, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Legs
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(-6, 10, 5, 10 + legSwing);
    ctx.fillRect(1, 10, 5, 10 - legSwing);
    // Boots
    ctx.fillStyle = "#111827";
    ctx.fillRect(-8, 19 + legSwing, 8, 5);
    ctx.fillRect(-1, 19 - legSwing, 8, 5);

    // Jersey body
    ctx.fillStyle = kitHex;
    ctx.fillRect(-9, -4, 18, 16);
    // Jersey collar
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(-4, -5, 8, 4);
    // Player name on jersey
    ctx.fillStyle = "white";
    ctx.font = `bold 5px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(playerName.toUpperCase().slice(0, 8), 0, 4);
    ctx.font = `bold 7px monospace`;
    ctx.fillText("10", 0, 11);

    // Arms
    ctx.fillStyle = kitHex;
    ctx.fillRect(-14, -3, 5, 9);
    ctx.fillRect(9, -3, 5, 9);
    // Hands
    ctx.fillStyle = "#f5c8a0";
    ctx.beginPath(); ctx.arc(-12, 7, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(12, 7, 3.5, 0, Math.PI * 2); ctx.fill();

    // Head
    ctx.fillStyle = "#f5c8a0";
    ctx.beginPath(); ctx.arc(0, -14, 10, 0, Math.PI * 2); ctx.fill();
    // Hair
    ctx.fillStyle = "#1a0a00";
    ctx.fillRect(-10, -24, 20, 10);
    ctx.beginPath(); ctx.arc(0, -20, 10, Math.PI, 0); ctx.fill();
    // Eyes
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(-3, -14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -14, 2, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }, [playerName, kitHex]);

  const drawBall = useCallback((ctx: CanvasRenderingContext2D, bx: number, by: number) => {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(bx, by + BALL_R - 1, BALL_R, BALL_R * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    // White ball
    const grad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, BALL_R);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#d0d0d0");
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2); ctx.fill();
    // Pentagon patches
    ctx.fillStyle = "#111"; ctx.strokeStyle = "#333"; ctx.lineWidth = 0.5;
    const angles = [0, Math.PI * 2 / 5, Math.PI * 4 / 5, Math.PI * 6 / 5, Math.PI * 8 / 5];
    ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
    angles.forEach((a) => {
      const cx = bx + Math.sin(a) * 5, cy = by - Math.cos(a) * 5;
      ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
    });
  }, []);

  const drawCoin = useCallback((ctx: CanvasRenderingContext2D, s: typeof stateRef.current) => {
    if (s.allCoinsCollected) return;
    const spot = SPOTS[s.coinIdx];
    if (!spot) return;
    const t = Date.now() / 1000;
    const bob = Math.sin(t * 3) * 4;
    const pulse = 0.6 + Math.sin(t * 4) * 0.4;
    const cx = spot.x, cy = spot.y - 52 + bob;
    const R = 14;

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 14);
    glow.addColorStop(0, `rgba(255,215,0,${0.4 * pulse})`);
    glow.addColorStop(1, "rgba(255,215,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, Math.PI * 2); ctx.fill();

    // Coin body gradient
    const coinGrad = ctx.createRadialGradient(cx - 4, cy - 4, 1, cx, cy, R);
    coinGrad.addColorStop(0, "#ffe066");
    coinGrad.addColorStop(0.5, "#ffc800");
    coinGrad.addColorStop(1, "#b8860b");
    ctx.fillStyle = coinGrad;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    // Coin rim
    ctx.strokeStyle = "#fff8a0"; ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(cx, cy, R - 2, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;

    // Star symbol
    ctx.fillStyle = "#7a5c00"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("★", cx, cy + 4);

    // "COLLECT" label
    ctx.fillStyle = "#ffd700"; ctx.font = "bold 7px monospace";
    ctx.globalAlpha = 0.8 + Math.sin(t * 4) * 0.2;
    ctx.fillText("COLLECT", cx, cy + R + 12);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";

    // Pop-up score texts
    s.popUps = s.popUps.filter(p => p.life > 0);
    s.popUps.forEach(p => {
      ctx.globalAlpha = p.life / 60;
      ctx.fillStyle = "#ffd700"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
      p.y -= 0.8; p.life -= 1;
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = "left";
  }, []);

  const drawHUD = useCallback((ctx: CanvasRenderingContext2D, s: typeof stateRef.current) => {
    const collected = s.coinIdx;
    const total = SPOTS.length;
    const t = Date.now() / 1000;

    // Score badge (top-right inside canvas)
    const scoreStr = `⭐ ${s.score} PTS`;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath(); ctx.roundRect?.(W - 105, 6, 99, 20, 6); ctx.fill();
    ctx.fillStyle = "#ffd700"; ctx.font = "bold 9px monospace"; ctx.textAlign = "right";
    ctx.fillText(scoreStr, W - 10, 20);
    ctx.textAlign = "left";

    // Coin progress bar at bottom
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(PITCH.x, PITCH.y + PITCH.h + 6, PITCH.w, 16);
    // Fill with gold
    if (collected > 0) {
      const grad = ctx.createLinearGradient(PITCH.x, 0, PITCH.x + PITCH.w, 0);
      grad.addColorStop(0, "#ffc800"); grad.addColorStop(1, "#ffd700");
      ctx.fillStyle = grad;
      ctx.fillRect(PITCH.x, PITCH.y + PITCH.h + 6, (collected / total) * PITCH.w, 16);
    }
    ctx.fillStyle = "white"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
    ctx.fillText(s.allCoinsCollected ? "ALL COINS COLLECTED! KICK FOR GOAL! ⚽" : `${collected}/${total} COINS COLLECTED`, W / 2, PITCH.y + PITCH.h + 17);
    ctx.textAlign = "left";

    // Coin collection mini icons in bar
    for (let i = 0; i < total; i++) {
      const ix = PITCH.x + 14 + i * ((PITCH.w - 28) / (total - 1));
      const iy = PITCH.y + PITCH.h + 14;
      ctx.fillStyle = i < collected ? "#ffd700" : "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.arc(ix, iy, 4, 0, Math.PI * 2); ctx.fill();
    }

    // "PRESS SPACE TO SHOOT" hint when near goal OR always after all collected
    const nearGoal = s.showShootHint;
    const shouldShowKick = s.allCoinsCollected || nearGoal;
    if (shouldShowKick && !s.ballKicked) {
      const pulse = 0.75 + Math.sin(t * 4) * 0.25;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      const hx = W / 2, hy = PITCH.y + 50;
      ctx.beginPath(); ctx.roundRect?.(hx - 72, hy - 13, 144, 24, 6); ctx.fill();
      ctx.fillStyle = s.allCoinsCollected ? "#ffd700" : "#ffffff";
      ctx.font = `bold 9px monospace`; ctx.textAlign = "center";
      ctx.fillText("SPACE = SHOOT ⚽", hx, hy + 4);
      ctx.globalAlpha = 1; ctx.textAlign = "left";
    }

    // "GO TO GOAL" arrow if all coins collected
    if (s.allCoinsCollected && !s.ballKicked) {
      const pulse = 0.6 + Math.sin(t * 3) * 0.4;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "#ffd700"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("▲ GOAL THIS WAY ▲", W / 2, PITCH.y + 80);
      ctx.globalAlpha = 1; ctx.textAlign = "left";
    }
  }, [kitHex]);

  // ─ Game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let rid: number;
    let lastTime = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const s = stateRef.current;
      if (s.scored) return;

      const keys = keysRef.current;
      const SPEED = PLAYER_SPEED;
      let dx = 0, dy = 0;
      if (keys.has("KeyW") || keys.has("ArrowUp"))    dy -= 1;
      if (keys.has("KeyS") || keys.has("ArrowDown"))  dy += 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft"))  dx -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      if (dx !== 0) s.facingRight = dx > 0;
      s.moving = dx !== 0 || dy !== 0;
      if (s.moving) s.walkFrame++;

      // Move player
      const nx = Math.max(PITCH.x + 16, Math.min(PITCH.x + PITCH.w - 16, s.px + dx * SPEED * dt));
      const ny = Math.max(PITCH.y + 20, Math.min(PITCH.y + PITCH.h - 20, s.py + dy * SPEED * dt));
      s.px = nx; s.py = ny;

      // Ball follows player (dribbling)
      if (!s.ballKicked) {
        const targetBx = s.px + (s.facingRight ? 24 : -24);
        const targetBy = s.py + 8;
        s.bx += (targetBx - s.bx) * Math.min(1, 12 * dt);
        s.by += (targetBy - s.by) * Math.min(1, 12 * dt);
      } else {
        // Ball flying
        s.bx += s.bvx * dt;
        s.by += s.bvy * dt;
        // Air resistance
        s.bvx *= 0.985;
        s.bvy *= 0.985;
        // Goal detection
        if (s.by < GOAL_DETECT_Y && s.bx > W / 2 - GOAL_W / 2 && s.bx < W / 2 + GOAL_W / 2) {
          s.scored = true;
          setTimeout(onGoal, 600);
          return;
        }
        // Bounce off side walls
        if (s.bx < PITCH.x + BALL_R) { s.bvx = Math.abs(s.bvx) * 0.65; s.bx = PITCH.x + BALL_R; }
        if (s.bx > PITCH.x + PITCH.w - BALL_R) { s.bvx = -Math.abs(s.bvx) * 0.65; s.bx = PITCH.x + PITCH.w - BALL_R; }
        // Bounce off bottom wall
        if (s.by > PITCH.y + PITCH.h - BALL_R) {
          s.bvy = -Math.abs(s.bvy) * 0.55;
          s.by = PITCH.y + PITCH.h - BALL_R;
        }
        // Bounce off top wall — but MISS the goal (post hit or wide)
        if (s.by < PITCH.y + BALL_R) {
          s.bvy = Math.abs(s.bvy) * 0.6;
          s.by = PITCH.y + BALL_R;
          // Missed the goal — trigger Try Again after a short delay
          if (!s.scored) {
            if (tryAgainTimerRef.current) clearTimeout(tryAgainTimerRef.current);
            tryAgainTimerRef.current = setTimeout(() => setShowTryAgain(true), 800);
          }
        }
        // Ball stopped on pitch (missed / rolled to a stop)
        const speed = Math.hypot(s.bvx, s.bvy);
        if (speed < 8) {
          s.ballKicked = false;
          s.bvx = 0; s.bvy = 0;
          if (!s.scored) {
            if (tryAgainTimerRef.current) clearTimeout(tryAgainTimerRef.current);
            tryAgainTimerRef.current = setTimeout(() => setShowTryAgain(true), 400);
          }
        }
      }

      // ── Coin collection ──
      if (!s.allCoinsCollected) {
        const coinSpot = SPOTS[s.coinIdx];
        if (coinSpot) {
          const coinDist = Math.hypot(s.px - coinSpot.x, s.py - (coinSpot.y - 18));
          if (coinDist < SPOT_R + 10) {
            // Collect coin!
            s.score += 100;
            s.popUps.push({ x: coinSpot.x, y: coinSpot.y - 60, text: "+100 ⭐", life: 60 });
            // Mark spot as visited
            if (!s.visitedSpots.has(coinSpot.id)) {
              s.visitedSpots = new Set(Array.from(s.visitedSpots).concat(coinSpot.id));
              setVisitedSpots(new Set(s.visitedSpots));
            }
            s.coinIdx++;
            if (s.coinIdx >= SPOTS.length) {
              s.allCoinsCollected = true;
              s.score += 500; // bonus
              s.popUps.push({ x: W / 2, y: H / 2 - 20, text: "+500 BONUS! ⭐", life: 90 });
            }
            setScore(s.score);
          }
        }
      }

      // ── Spot info panel (always active regardless of coins) ──
      let nearestSpot: string | null = null;
      for (const spot of SPOTS) {
        const dist = Math.hypot(s.px - spot.x, s.py - spot.y);
        if (dist < SPOT_R + 14) { nearestSpot = spot.id; break; }
      }
      if (nearestSpot !== s.activeSpot) {
        s.activeSpot = nearestSpot;
        setActiveSpotId(nearestSpot);
      }

      // Shoot hint near goal
      const distToGoal = Math.hypot(s.px - W / 2, s.py - (PITCH.y + 60));
      s.showShootHint = distToGoal < 110 && !s.ballKicked;

      // Draw
      ctx.clearRect(0, 0, W, H);
      drawPitch(ctx);
      drawSpots(ctx, s);
      drawCoin(ctx, s);
      drawPlayer(ctx, s);
      drawBall(ctx, s.bx, s.by);
      drawHUD(ctx, s);

      rid = requestAnimationFrame(loop);
    };

    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
      if (e.code === "Space") {
        // Dismiss Try Again popup first if showing
        setShowTryAgain(false);
        if (tryAgainTimerRef.current) clearTimeout(tryAgainTimerRef.current);
        const s = stateRef.current;
        // Always allow kick — reset ball to player feet
        s.bx = s.px + (s.facingRight ? 20 : -20);
        s.by = s.py;
        s.ballKicked = true;
        // Kick toward top goal with spread based on player position
        const targetX = W / 2 + (s.px - W / 2) * 0.25;
        const angle = Math.atan2(PITCH.y - s.by, targetX - s.bx);
        const power = 0.8 + Math.random() * 0.2;
        s.bvx = Math.cos(angle) * KICK_SPEED * 0.45 * power;
        s.bvy = Math.sin(angle) * KICK_SPEED * power;
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup", onUp);
    rid = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rid);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [drawPitch, drawSpots, drawCoin, drawPlayer, drawBall, drawHUD, onGoal]);

  // Clean up timers on unmount
  useEffect(() => () => {
    if (tryAgainTimerRef.current) clearTimeout(tryAgainTimerRef.current);
    if (lazyTipTimerRef.current) clearTimeout(lazyTipTimerRef.current);
  }, []);

  // Auto-dismiss lazy tip after 5 seconds
  useEffect(() => {
    lazyTipTimerRef.current = setTimeout(() => setShowLazyTip(false), 5000);
    return () => { if (lazyTipTimerRef.current) clearTimeout(lazyTipTimerRef.current); };
  }, []);

  // Scale canvas to fit screen — measure the parent (game area), not the canvas container
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const parent = container.parentElement;
      if (!parent) return;
      const availW = parent.clientWidth - 8;   // subtract px-1 each side
      const availH = parent.clientHeight - 8;
      const scale = Math.min(availW / W, availH / H, 1);
      scaleRef.current = scale;
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = "top left";
      container.style.width = `${W * scale}px`;
      container.style.height = `${H * scale}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    // ResizeObserver catches mobile viewport shifts (address bar appear/disappear, orientation change)
    const ro = new ResizeObserver(resize);
    if (containerRef.current?.parentElement) ro.observe(containerRef.current.parentElement);
    return () => { window.removeEventListener("resize", resize); ro.disconnect(); };
  }, []);

  const activeSpotData = SPOTS.find(s => s.id === activeSpotId);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: "#071628" }}>
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="font-serif font-bold text-base" style={{ color: kitHex, textShadow: `0 0 12px ${kitHex}80` }}>AHZ</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40">{playerName.toUpperCase()} #10</span>
          <span className="font-mono text-[10px]" style={{ color: "#ffd700" }}>⭐ {score} pts</span>
          <span className="font-mono text-[10px]" style={{ color: kitHex }}>{visitedSpots.size}/{SPOTS.length} coins</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[9px] text-white/25 hidden sm:block">WASD move · SPACE shoot</div>
          <button
            data-testid="button-skip-game"
            onClick={onGoal}
            className="font-mono text-[10px] px-3 py-1 rounded-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Game area */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden px-1 py-1">
        <div ref={containerRef} className="relative">
          <canvas ref={canvasRef} width={W} height={H} data-testid="football-canvas" />
        </div>

        {/* ── Lazy tip startup popup ── */}
        {showLazyTip && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div
              className="pointer-events-auto flex flex-col items-center gap-3 rounded-2xl px-8 py-6 text-center"
              style={{
                background: "rgba(7,22,40,0.95)",
                border: "2px solid rgba(255,215,0,0.35)",
                boxShadow: "0 0 50px rgba(255,215,0,0.12), 0 8px 32px rgba(0,0,0,0.7)",
                maxWidth: "320px",
              }}
            >
              <div className="text-4xl">🦥</div>
              <div>
                <p className="font-mono font-bold text-base text-white tracking-wide">Feeling lazy?</p>
                <p className="font-mono text-xs text-white/60 mt-2 leading-relaxed">
                  You don't have to collect all the coins.<br />
                  Just <span style={{ color: "#ffd700" }}>press SPACE</span> and kick straight for goal — the portfolio unlocks instantly!
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <button
                  data-testid="button-lazy-play"
                  onClick={() => { setShowLazyTip(false); if (lazyTipTimerRef.current) clearTimeout(lazyTipTimerRef.current); }}
                  className="flex-1 font-mono text-xs py-2 rounded-xl transition-all active:scale-95"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
                >
                  I'll play properly
                </button>
                <button
                  data-testid="button-lazy-skip"
                  onClick={() => { setShowLazyTip(false); onGoal(); }}
                  className="flex-1 font-mono font-bold text-xs py-2 rounded-xl transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #f7a825, #e07b00)", color: "white", boxShadow: "0 0 14px rgba(247,168,37,0.35)" }}
                >
                  🦥 Just skip it
                </button>
              </div>
              <p className="font-mono text-[9px] text-white/20">auto-closes in 5s</p>
            </div>
          </div>
        )}

        {/* ── Try Again popup ── */}
        {showTryAgain && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div
              className="pointer-events-auto flex flex-col items-center gap-4 rounded-2xl px-8 py-6 text-center"
              style={{
                background: "rgba(7,22,40,0.93)",
                border: "2px solid rgba(255,80,80,0.5)",
                boxShadow: "0 0 40px rgba(255,80,80,0.25), 0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {/* Sad ball */}
              <div className="text-4xl" style={{ filter: "drop-shadow(0 0 8px rgba(255,80,80,0.5))" }}>😔⚽</div>

              <div>
                <p className="font-mono font-bold text-lg text-white tracking-wide">MISSED!</p>
                <p className="font-mono text-xs text-white/50 mt-1">The ball didn't make it in.</p>
              </div>

              <button
                data-testid="button-try-again"
                onClick={() => {
                  const s = stateRef.current;
                  // Reset ball back to player's current position
                  s.bx = s.px + (s.facingRight ? 20 : -20);
                  s.by = s.py;
                  s.bvx = 0;
                  s.bvy = 0;
                  s.ballKicked = false;
                  setShowTryAgain(false);
                }}
                className="font-mono font-bold text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f72585, #c9134d)",
                  color: "white",
                  boxShadow: "0 0 16px rgba(247,37,133,0.4)",
                }}
              >
                ⚽ Try Again
              </button>

              <p className="font-mono text-[10px] text-white/30">or press SPACE to shoot again</p>
            </div>
          </div>
        )}

        {/* Spot info card */}
        {activeSpotData && (
          <div
            className="absolute top-4 left-4 z-20 rounded-xl p-4 w-56 transition-all duration-200"
            style={{ background: "rgba(7,22,40,0.92)", border: `1px solid ${activeSpotData.color}50`, boxShadow: `0 0 20px ${activeSpotData.color}20` }}
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: activeSpotData.color }}>
              {activeSpotData.icon} {activeSpotData.label}
            </p>
            <div className="h-px mb-2" style={{ background: `linear-gradient(90deg, ${activeSpotData.color}, transparent)` }} />
            {activeSpotData.brief.split("\n").map((line, i) => (
              <p key={i} className="font-mono text-[10px] text-white/70 leading-relaxed">{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Mobile touch controls */}
      <div className="flex flex-col items-center gap-1 pb-2 sm:hidden">
        <button onPointerDown={() => keysRef.current.add("ArrowUp")} onPointerUp={() => keysRef.current.delete("ArrowUp")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)" }}>▲</button>
        <div className="flex gap-1">
          <button onPointerDown={() => keysRef.current.add("ArrowLeft")} onPointerUp={() => keysRef.current.delete("ArrowLeft")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)" }}>◀</button>
          <button onPointerDown={() => { setShowTryAgain(false); if (tryAgainTimerRef.current) clearTimeout(tryAgainTimerRef.current); const s = stateRef.current; s.bx = s.px + (s.facingRight ? 20 : -20); s.by = s.py; s.ballKicked = true; const targetX = W/2 + (s.px-W/2)*0.25; const angle = Math.atan2(PITCH.y - s.by, targetX - s.bx); s.bvx = Math.cos(angle)*KICK_SPEED*0.45; s.bvy = Math.sin(angle)*KICK_SPEED; }}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs text-white" style={{ background: kitHex + "cc" }}>⚽</button>
          <button onPointerDown={() => keysRef.current.add("ArrowRight")} onPointerUp={() => keysRef.current.delete("ArrowRight")}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)" }}>▶</button>
        </div>
        <button onPointerDown={() => keysRef.current.add("ArrowDown")} onPointerUp={() => keysRef.current.delete("ArrowDown")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)" }}>▼</button>
      </div>
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export function FootballGame() {
  const [screen, setScreen] = useState<"entry" | "game" | "goal">("entry");
  const [playerName, setPlayerName] = useState("");
  const [kitColor, setKitColor] = useState("#0096c7");

  const handleStart = useCallback((name: string) => {
    setPlayerName(name);
    setScreen("game");
  }, []);

  if (screen === "entry") {
    return <NameEntry onStart={(name) => { setPlayerName(name); setScreen("game"); }} />;
  }
  if (screen === "goal") {
    return <GoalScreen playerName={playerName} kitColor={kitColor} onReplay={() => { setScreen("entry"); }} />;
  }
  return <PitchGame playerName={playerName} kitColor={kitColor} onGoal={() => setScreen("goal")} />;
}
