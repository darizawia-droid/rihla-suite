#!/usr/bin/env node
/**
 * S'TOURS DMC — Proposal PPTX Generator
 *
 * Generates a premium travel proposal in PowerPoint format using PptxGenJS.
 * Invoked by the FastAPI backend via subprocess.
 *
 * Usage:
 *   node proposalPptxService.js --data <base64-json> --output <path.pptx>
 *
 * Install once: npm install -g pptxgenjs
 */

const pptxgen = require("pptxgenjs");

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dataIdx = args.indexOf("--data");
const outIdx  = args.indexOf("--output");

if (dataIdx === -1 || outIdx === -1) {
  console.error("Usage: node proposalPptxService.js --data <base64-json> --output <path>");
  process.exit(1);
}

let payload;
try {
  const raw = Buffer.from(args[dataIdx + 1], "base64").toString("utf8");
  payload = JSON.parse(raw);
} catch (e) {
  console.error("ERROR: Invalid JSON payload — " + e.message);
  process.exit(1);
}

const outputPath = args[outIdx + 1];
const {
  template       = "luxury",
  circuit_name   = "Magical Morocco",
  days           = [],
  grid           = [],
  single_supplement = 0,
  language       = "en",
  client_name    = "",
  departure      = "November 2026",
} = payload;

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = {
  luxury:   { dark: "1A0A00", mid: "3A2010", accent: "C5A059", light: "F9F3E8", font: "Georgia" },
  modern:   { dark: "1D1D1D", mid: "2D2D2D", accent: "D97706", light: "FFFBF0", font: "Trebuchet MS" },
  business: { dark: "0A0F1D", mid: "1A2035", accent: "1628A9", light: "F0F4FF", font: "Calibri"    },
};
const T = THEMES[template] || THEMES.luxury;

// ─── Morocco photos (Unsplash) ────────────────────────────────────────────────
const PHOTOS = [
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80",
  "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=900&q=80",
  "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=900&q=80",
  "https://images.unsplash.com/photo-1553508913-264739567433?w=900&q=80",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt     = n => Math.round(n).toLocaleString("fr-FR");
const fmtUSD  = n => "$" + Math.round(n).toLocaleString("en-US");
// Always return a fresh object — PptxGenJS mutates shadow objects (EMU conversion)
const shadow  = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.14 });

const programDays = days.filter(d => d.halfDbl > 0 || d.hotel);
const nightCount  = programDays.length;
const paxRange    = grid.length ? `${grid[0].pax}–${grid[grid.length - 1].pax} Pax` : "20–30 Pax";

// ─── Create presentation ──────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.author  = "S'TOURS DMC";
pres.title   = `${circuit_name} — Travel Proposal`;
pres.subject = `DMC Morocco Proposal${client_name ? " for " + client_name : ""}`;


// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: T.dark };

  // Full-bleed photo (transparent overlay)
  s.addImage({ path: PHOTOS[0], x: 0, y: 0, w: 10, h: 5.625, transparency: 55 });

  // Dark gradient overlay
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: T.dark, transparency: 25 },
    line: { color: T.dark, width: 0 },
  });

  // Decorative corner border (luxury & business only)
  if (template !== "modern") {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.35, y: 0.35, w: 9.3, h: 4.95,
      fill: { color: "FFFFFF", transparency: 100 },
      line: { color: T.accent, width: 0.6, transparency: 45 },
    });
  }

  // S'TOURS logo circle
  s.addShape(pres.shapes.OVAL, {
    x: 4.3, y: 0.5, w: 1.4, h: 1.4,
    fill: { color: "FFFFFF", transparency: 82 },
    line: { color: T.accent, width: 1.5 },
  });
  s.addText("S'TOURS\nDMC", {
    x: 4.1, y: 0.72, w: 1.8, h: 0.8,
    fontSize: 8, color: "FFFFFF", align: "center", bold: true,
    charSpacing: 2, fontFace: T.font, margin: 0,
  });

  // Main title
  s.addText(circuit_name.toUpperCase(), {
    x: 0.8, y: 1.65, w: 8.4, h: 1.2,
    fontSize: 50, color: "FFFFFF", align: "center",
    bold: true, fontFace: T.font, margin: 0,
  });

  // Gold divider line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 2.9, w: 3.0, h: 0.025,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });

  // Subtitle
  s.addText("PRIVATE EXPEDITION  ·  " + departure.toUpperCase(), {
    x: 0.8, y: 3.0, w: 8.4, h: 0.45,
    fontSize: 9.5, color: "FFFFFF", align: "center",
    charSpacing: 5, fontFace: T.font, margin: 0,
  });

  // Client name (if provided)
  if (client_name) {
    s.addText(`Prepared for: ${client_name}`, {
      x: 0.8, y: 3.5, w: 8.4, h: 0.35,
      fontSize: 9, color: T.accent, align: "center",
      italic: true, fontFace: T.font, margin: 0,
    });
  }

  // Stats row
  const stats = [
    { label: "DURATION",     value: `${nightCount + 1} Days / ${nightCount} Nights` },
    { label: "PARTICIPANTS", value: paxRange },
    { label: "DEPARTURE",    value: departure },
    { label: "CATEGORY",     value: "4★ & 5★ Hotels" },
  ];
  const colW = 2.2;
  stats.forEach((st, i) => {
    const x = 0.8 + i * colW;
    if (i > 0) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x - 0.08, y: 4.05, w: 0.01, h: 0.85,
        fill: { color: "FFFFFF", transparency: 72 },
        line: { color: "FFFFFF", width: 0 },
      });
    }
    s.addText(st.label, {
      x, y: 4.05, w: colW - 0.15, h: 0.28,
      fontSize: 6.5, color: T.accent, align: "center", bold: true,
      charSpacing: 2, fontFace: "Calibri", margin: 0,
    });
    s.addText(st.value, {
      x, y: 4.33, w: colW - 0.15, h: 0.4,
      fontSize: 10, color: "FFFFFF", align: "center", bold: true,
      fontFace: T.font, margin: 0,
    });
  });

  // Bottom accent band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.42, w: 10, h: 0.205,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Journey Overview
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  // Left accent stripe
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.09, h: 5.625,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });

  // ── Left column: headline + stats cards ──
  s.addText("The Journey", {
    x: 0.45, y: 0.35, w: 4.3, h: 0.75,
    fontSize: 34, color: "111827", bold: true, fontFace: T.font, margin: 0,
  });
  s.addText("A hand-crafted selection of Morocco's finest treasures.", {
    x: 0.45, y: 1.05, w: 4.2, h: 0.55,
    fontSize: 10, color: "6B7280", fontFace: "Calibri", margin: 0,
  });

  const statCards = [
    { n: String(nightCount + 1),   label: "Days" },
    { n: String(nightCount),        label: "Nights" },
    { n: String(days.filter(d => d.cities).length), label: "Destinations" },
    { n: "4★ – 5★",                label: "Hotels" },
  ];
  statCards.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = 0.45 + col * 2.15, cy = 1.8 + row * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.0, h: 1.1,
      fill: { color: "F8FAFC" },
      line: { color: "E2E8F0", width: 1 },
      shadow: shadow(),
    });
    s.addText(st.n, {
      x: cx + 0.1, y: cy + 0.08, w: 1.8, h: 0.6,
      fontSize: 26, color: T.accent, bold: true, align: "center",
      fontFace: T.font, margin: 0,
    });
    s.addText(st.label.toUpperCase(), {
      x: cx + 0.1, y: cy + 0.68, w: 1.8, h: 0.3,
      fontSize: 7.5, color: "94A3B8", bold: true, charSpacing: 1.5,
      align: "center", fontFace: "Calibri", margin: 0,
    });
  });

  // ── Right column: city route ──
  s.addText("DESTINATIONS", {
    x: 5.2, y: 0.35, w: 4.4, h: 0.38,
    fontSize: 7.5, color: "94A3B8", bold: true, charSpacing: 2,
    fontFace: "Calibri", margin: 0,
  });

  const routeDays = days.filter(d => d.cities).slice(0, 9);
  routeDays.forEach((d, i) => {
    const ry = 0.78 + i * 0.53;

    // Dot
    s.addShape(pres.shapes.OVAL, {
      x: 5.2, y: ry + 0.04, w: 0.2, h: 0.2,
      fill: { color: T.accent },
      line: { color: T.accent, width: 0 },
    });

    // Connector line to next
    if (i < routeDays.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: 5.295, y: ry + 0.24, w: 0, h: 0.32,
        line: { color: "CBD5E1", width: 1 },
      });
    }

    // Day badge
    s.addText(`J${d.day}`, {
      x: 5.47, y: ry, w: 0.38, h: 0.28,
      fontSize: 7.5, color: T.accent, bold: true,
      fontFace: "Calibri", margin: 0,
    });

    // City
    s.addText(String(d.cities || ""), {
      x: 5.9, y: ry, w: 3.7, h: 0.28,
      fontSize: 10.5, color: "1F2937", bold: true,
      fontFace: T.font, margin: 0,
    });

    // Hotel
    if (d.hotel) {
      s.addText(String(d.hotel), {
        x: 5.9, y: ry + 0.27, w: 3.7, h: 0.22,
        fontSize: 8, color: "9CA3AF", italic: true,
        fontFace: "Calibri", margin: 0,
      });
    }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// SLIDES 3+ — Daily Programme (3 days per slide)
// ══════════════════════════════════════════════════════════════════════════════
const DAYS_PER_SLIDE = 3;
const totalProgSlides = Math.ceil(programDays.length / DAYS_PER_SLIDE);

for (let i = 0; i < programDays.length; i += DAYS_PER_SLIDE) {
  const chunk   = programDays.slice(i, i + DAYS_PER_SLIDE);
  const curPage = Math.floor(i / DAYS_PER_SLIDE);
  const s       = pres.addSlide();
  s.background  = { color: "F8FAFC" };

  // Dark header band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: T.dark },
    line: { color: T.dark, width: 0 },
  });
  s.addText("DAILY PROGRAMME", {
    x: 0.4, y: 0.1, w: 7, h: 0.48,
    fontSize: 17, color: "FFFFFF", bold: true, charSpacing: 3,
    fontFace: T.font, margin: 0,
  });
  const rangeLabel = chunk.length > 1
    ? `Day ${chunk[0].day}  —  Day ${chunk[chunk.length - 1].day}`
    : `Day ${chunk[0].day}`;
  s.addText(rangeLabel, {
    x: 0.4, y: 0.55, w: 7, h: 0.32,
    fontSize: 8.5, color: T.accent, bold: true, charSpacing: 1,
    fontFace: "Calibri", margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.5, y: 0, w: 0.5, h: 1.0,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });

  // Day cards
  const CARD_X = [0.25, 3.5, 6.75];
  const CARD_W = 3.0;
  const CARD_Y = 1.15;
  const CARD_H = 4.15;

  chunk.forEach((d, ci) => {
    const cx = CARD_X[ci] ?? 0.25;

    // Card shadow + body
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: CARD_Y, w: CARD_W, h: CARD_H,
      fill: { color: "FFFFFF" },
      line: { color: "E5E7EB", width: 1 },
      shadow: shadow(),
    });

    // Day header
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: CARD_Y, w: CARD_W, h: 0.52,
      fill: { color: T.dark },
      line: { color: T.dark, width: 0 },
    });
    s.addText(`DAY  ${d.day}`, {
      x: cx + 0.1, y: CARD_Y + 0.06, w: CARD_W - 0.2, h: 0.4,
      fontSize: 13, color: T.accent, bold: true, align: "center",
      fontFace: T.font, charSpacing: 4, margin: 0,
    });

    // City / title
    s.addText(String(d.cities || d.date || "").toUpperCase(), {
      x: cx + 0.15, y: CARD_Y + 0.62, w: CARD_W - 0.3, h: 0.42,
      fontSize: 11.5, color: "111827", bold: true,
      fontFace: T.font, margin: 0,
    });
    if (d.date && d.cities) {
      s.addText(String(d.date), {
        x: cx + 0.15, y: CARD_Y + 1.0, w: CARD_W - 0.3, h: 0.28,
        fontSize: 8, color: "9CA3AF", italic: true,
        fontFace: "Calibri", margin: 0,
      });
    }

    // Separator
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.15, y: CARD_Y + 1.35, w: CARD_W - 0.3, h: 0.015,
      fill: { color: "E5E7EB" },
      line: { color: "E5E7EB", width: 0 },
    });

    // Accommodation
    s.addText("ACCOMMODATION", {
      x: cx + 0.15, y: CARD_Y + 1.43, w: CARD_W - 0.3, h: 0.25,
      fontSize: 7, color: "94A3B8", bold: true, charSpacing: 1.5,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(`${d.hotel || "—"}  (${d.formula || "BB"})`, {
      x: cx + 0.15, y: CARD_Y + 1.67, w: CARD_W - 0.3, h: 0.38,
      fontSize: 9.5, color: "374151",
      fontFace: "Calibri", margin: 0,
    });

    // Meals
    s.addText("MEALS", {
      x: cx + 0.15, y: CARD_Y + 2.18, w: CARD_W - 0.3, h: 0.25,
      fontSize: 7, color: "94A3B8", bold: true, charSpacing: 1.5,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(String(d.rest || "Included per board formula"), {
      x: cx + 0.15, y: CARD_Y + 2.42, w: CARD_W - 0.3, h: 0.38,
      fontSize: 9.5, color: "374151",
      fontFace: "Calibri", margin: 0,
    });

    // Price badge (bottom)
    if (d.halfDbl > 0) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.15, y: CARD_Y + CARD_H - 0.58, w: CARD_W - 0.3, h: 0.42,
        fill: { color: T.accent, transparency: 84 },
        line: { color: T.accent, width: 1, transparency: 65 },
      });
      s.addText(`${fmt(d.halfDbl)} MAD / pax`, {
        x: cx + 0.15, y: CARD_Y + CARD_H - 0.58, w: CARD_W - 0.3, h: 0.42,
        fontSize: 9, color: T.dark, align: "center", bold: true,
        fontFace: "Calibri", margin: 0,
      });
    }
  });

  // Pagination dots
  for (let p = 0; p < totalProgSlides; p++) {
    s.addShape(pres.shapes.OVAL, {
      x: 4.7 + p * 0.2, y: 5.45, w: 0.12, h: 0.12,
      fill: { color: p === curPage ? T.accent : "CBD5E1" },
      line: { color: p === curPage ? T.accent : "CBD5E1", width: 0 },
    });
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — Financial Investment
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: T.light };

  // Dark header band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.25,
    fill: { color: T.dark },
    line: { color: T.dark, width: 0 },
  });
  s.addText("FINANCIAL INVESTMENT", {
    x: 0.45, y: 0.15, w: 8.5, h: 0.55,
    fontSize: 22, color: "FFFFFF", bold: true, charSpacing: 4,
    fontFace: T.font, margin: 0,
  });
  s.addText("Estimated rates per person — NET prices, exclusive of international flights.", {
    x: 0.45, y: 0.72, w: 8.5, h: 0.35,
    fontSize: 9, color: "FFFFFF", fontFace: "Calibri", margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.5, y: 0, w: 0.5, h: 1.25,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });

  // Table
  const headerFill = { color: T.mid };
  const evenFill   = { color: "FFFFFF" };
  const oddFill    = { color: "F1F5F9" };

  const tableRows = [
    [
      { text: "Group Size",             options: { bold: true, color: "FFFFFF", fill: headerFill, align: "center", fontFace: T.font } },
      { text: "Price / Person (MAD)",   options: { bold: true, color: "FFFFFF", fill: headerFill, align: "center", fontFace: T.font } },
      { text: "Price / Person (USD)",   options: { bold: true, color: "FFFFFF", fill: headerFill, align: "center", fontFace: T.font } },
      { text: "Total Group (MAD)",      options: { bold: true, color: "FFFFFF", fill: headerFill, align: "center", fontFace: T.font } },
    ],
    ...grid.map((row, ri) => {
      const f = ri % 2 === 0 ? evenFill : oddFill;
      return [
        { text: `${row.pax} Pax`,              options: { bold: true, align: "center",  fill: f } },
        { text: `${fmt(row.sell)} MAD`,         options: { bold: true, align: "right",   fill: f } },
        { text: fmtUSD(row.usd ?? row.sell / 10.1), options: { align: "right", color: "059669", fill: f } },
        { text: `${fmt(row.sell * row.pax)} MAD`, options: { align: "right", fill: f } },
      ];
    }),
  ];

  const tableH = Math.min(3.3, 0.42 + grid.length * 0.38);
  s.addTable(tableRows, {
    x: 0.4, y: 1.45, w: 9.2, h: tableH,
    colW: [1.8, 2.5, 2.5, 2.4],
    border: { pt: 0.5, color: "E5E7EB" },
    autoPage: false,
    fontSize: 10,
    fontFace: "Calibri",
    rowH: 0.38,
  });

  // Single supplement note
  const noteY = 1.45 + tableH + 0.15;
  s.addText(
    `★  Single Room Supplement: ${fmt(single_supplement)} MAD per person   ·   Rates valid for the selected departure dates only.`,
    {
      x: 0.4, y: noteY, w: 9.2, h: 0.38,
      fontSize: 8.5, color: "6B7280", align: "center",
      fontFace: "Calibri", margin: 0,
    },
  );

  // Bottom accent band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.42, w: 10, h: 0.205,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// SLIDE — Contact & Terms
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: T.dark };

  // Right photo half
  s.addImage({ path: PHOTOS[2], x: 5.2, y: 0, w: 4.8, h: 5.625, transparency: 65 });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 0, w: 4.8, h: 5.625,
    fill: { color: T.dark, transparency: 25 },
    line: { color: T.dark, width: 0 },
  });

  // Vertical separator
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.05, y: 0.5, w: 0.015, h: 4.65,
    fill: { color: T.accent, transparency: 50 },
    line: { color: T.accent, width: 0 },
  });

  // Left: thank you + contact
  s.addText("Thank you", {
    x: 0.45, y: 0.38, w: 4.4, h: 0.8,
    fontSize: 38, color: T.accent, bold: true,
    fontFace: T.font, italic: template === "luxury", margin: 0,
  });
  s.addText(client_name ? `for choosing S'TOURS DMC Morocco\n${client_name}` : "for choosing S'TOURS DMC Morocco", {
    x: 0.45, y: 1.1, w: 4.4, h: 0.6,
    fontSize: 11, color: "FFFFFF", fontFace: "Calibri", margin: 0,
  });

  // Gold separator
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.85, w: 3.2, h: 0.03,
    fill: { color: T.accent },
    line: { color: T.accent, width: 0 },
  });

  // Contact lines
  const contacts = [
    { label: "Email",    value: "incoming@stours.ma" },
    { label: "Phone",    value: "+212 5xx xxx xxx"   },
    { label: "Web",      value: "www.stours.ma"      },
    { label: "Validity", value: "30 days from issue date" },
  ];
  contacts.forEach((c, i) => {
    const cy = 2.05 + i * 0.7;
    s.addText(c.label.toUpperCase(), {
      x: 0.45, y: cy, w: 1.15, h: 0.3,
      fontSize: 7, color: T.accent, bold: true, charSpacing: 1.5,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(c.value, {
      x: 1.65, y: cy, w: 3.2, h: 0.3,
      fontSize: 9.5, color: "FFFFFF", fontFace: "Calibri", margin: 0,
    });
    if (i < contacts.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.45, y: cy + 0.36, w: 4.45, h: 0.008,
        fill: { color: "FFFFFF", transparency: 80 },
        line: { color: "FFFFFF", width: 0 },
      });
    }
  });

  // DMC badge bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 4.9, w: 4.45, h: 0.48,
    fill: { color: T.accent, transparency: 80 },
    line: { color: T.accent, width: 1, transparency: 55 },
  });
  s.addText("S'TOURS  ·  DESTINATION MANAGEMENT COMPANY  ·  MAROC", {
    x: 0.45, y: 4.9, w: 4.45, h: 0.48,
    fontSize: 7, color: "FFFFFF", align: "center", bold: true, charSpacing: 1.5,
    fontFace: T.font, margin: 0,
  });
}


// ─── Write file ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: outputPath })
  .then(() => {
    process.stdout.write("OK:" + outputPath + "\n");
    process.exit(0);
  })
  .catch(err => {
    process.stderr.write("ERROR:" + err.message + "\n");
    process.exit(1);
  });
