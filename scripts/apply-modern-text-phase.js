const fs = require("fs");
const path = require("path");

const root = process.cwd();

function fileExists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, "utf8");
}

function replaceMany(rel, replacements) {
  if (!fileExists(rel)) {
    console.log(`skip: ${rel} not found`);
    return;
  }

  let content = read(rel);
  let changed = false;

  for (const [pattern, replacement] of replacements) {
    const next = content.replace(pattern, replacement);
    if (next !== content) {
      changed = true;
      content = next;
    }
  }

  if (changed) {
    write(rel, content);
    console.log(`updated: ${rel}`);
  } else {
    console.log(`no text matches in: ${rel}`);
  }
}

function appendOnce(rel, marker, css) {
  if (!fileExists(rel)) {
    console.log(`skip: ${rel} not found`);
    return;
  }
  const content = read(rel);
  if (content.includes(marker)) {
    console.log(`already added: ${rel}`);
    return;
  }
  write(rel, `${content.trim()}\n\n${css.trim()}\n`);
  console.log(`appended styles: ${rel}`);
}

// Homepage copy replacements. These are intentionally conservative string/regex replacements.
replaceMany("app/page.js", [
  [/JAMAICA[’']S LINK-UP PLANNER/g, "Jamaica’s discovery hub"],
  [/SOCIAL\s+MEDIA\s+GETS\s+ATTENTION\.?/gi, "Find your next move"],
  [/YARDPROMOJA\s+TURNS\s+IT\s+INTO\s+ACTION\.?/gi, "in Jamaica."],
  [/Find what[’']s happening in Jamaica\.?/gi, "Find your next move in Jamaica."],
  [/Discover events, promotions, food, fashion, transport, stays, deals,? and more\s+—\s+all in one place\./gi, "Explore events, food spots, weekend plans, services, deals, and local promos — searchable by parish, category, and date."],
  [/Discover parties, shows, businesses, services, food deals, venues, and campaigns\s+—\s+or post your own promo link in minutes\./gi, "Explore events, food spots, weekend plans, services, deals, and local promos — then share a clean YardPromoJa link in minutes."],
  [/Search promos, food, events, places\.\.\./gi, "Search events, food spots, places, deals..."],
  [/Search promos, food, events, places…/gi, "Search events, food spots, places, deals…"],
  [/Post Your Promo/g, "Post your promo"],
  [/Browse Promos/g, "Explore promos"],
  [/Plan The Link-Up/g, "Plan a link-up"],
  [/Plan the Link-Up/g, "Plan a link-up"],
]);

// Site-wide banner / layout copy replacements.
replaceMany("app/layout.js", [
  [/Social media gets attention\. YardPromoJa turns your flyer into a link-up page with actions, shares, directions, campaigns, and offers\./gi, "New on YardPromoJa: discover local promos by parish, category, weekend moves, and nearby deals."],
  [/Post Your Promo/g, "Post your promo"],
]);

// Featured promo card copy refinements.
replaceMany("components/HeroStack.js", [
  [/Featured promos/g, "Featured now"],
  [/Featured event/g, "Featured now"],
  [/View Promo/g, "View promo"],
  [/No featured promos yet/g, "Fresh promos coming soon"],
  [/Check back soon for what&apos;s happening around Jamaica\./g, "Explore what’s happening across Jamaica."],
]);

replaceMany("components/HeroStackCarousel.js", [
  [/Featured promos/g, "Featured now"],
  [/Featured event/g, "Featured now"],
  [/View Promo/g, "View promo"],
]);

const css = `
/* === YardPromoJa modern text phase === */
:root {
  --yp-modern-gold: #ffd400;
  --yp-modern-green: #38d430;
  --yp-modern-text: #f7faf8;
  --yp-modern-muted: rgba(255, 255, 255, 0.72);
}

.yp-modern-hero-copy {
  max-width: 760px;
}

.yp-modern-eyebrow,
.kicker {
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.yp-modern-headline {
  margin: 0;
  color: var(--yp-modern-text);
  font-size: clamp(3.25rem, 7.2vw, 6.9rem);
  line-height: 0.9;
  letter-spacing: -0.075em;
  font-weight: 1000;
  text-wrap: balance;
}

.yp-modern-headline span {
  color: var(--yp-modern-green);
}

.yp-modern-subtitle {
  margin: 1.55rem 0 0;
  max-width: 660px;
  color: var(--yp-modern-muted);
  font-size: clamp(1.05rem, 1.5vw, 1.26rem);
  line-height: 1.75;
  font-weight: 500;
}

.yp-modern-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 2rem;
}

.yp-modern-btn {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 1.25rem;
  font-weight: 900;
  text-decoration: none;
}

.yp-modern-btn-primary {
  background: var(--yp-modern-gold);
  color: #050805;
  box-shadow: 0 16px 40px rgba(255, 212, 0, 0.18);
}

.yp-modern-btn-dark,
.yp-modern-btn-ghost {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.055);
  color: #fff;
  backdrop-filter: blur(12px);
}

/* Style common existing homepage hero selectors without requiring a full rewrite. */
.hero h1,
.home-hero h1,
.yp-hero h1,
.yp-dark-hero h1,
.hero-title,
.yp-hero-title {
  letter-spacing: -0.075em !important;
  line-height: 0.9 !important;
  text-wrap: balance;
}

.hero p,
.home-hero p,
.yp-hero p,
.yp-dark-hero p,
.hero-subtitle,
.yp-hero-subtitle {
  line-height: 1.72;
}

.launch-banner,
.ad-marquee,
.top-announcement {
  letter-spacing: -0.015em;
}

@media (max-width: 760px) {
  .yp-modern-headline {
    font-size: clamp(3rem, 15vw, 4.8rem);
  }

  .yp-modern-actions {
    flex-direction: column;
  }

  .yp-modern-btn {
    width: 100%;
  }
}
/* === End YardPromoJa modern text phase === */
`;

appendOnce("app/globals.css", "YardPromoJa modern text phase", css);
appendOnce("app/mobile/mobile.css", "YardPromoJa modern text phase", css);

console.log("\nModern text phase complete. Run npm run dev, refresh /, then check the hero copy and banner.");
