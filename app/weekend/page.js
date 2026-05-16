import AdsGrid from "../AdsGrid";
import { activeAds, isWeekend, sampleAds } from "@/lib/yardpromoData";

function WeekendBlock({ title, ads }) {
  return (
    <section className="section" style={{ padding: "28px 0" }}>
      <div className="section-head">
        <div>
          <p className="kicker">Weekend</p>
          <h2>{title}</h2>
        </div>
      </div>
      {ads.length ? (
        <AdsGrid ads={ads} limit={ads.length} />
      ) : (
        <div className="empty">
          <h3>No promos listed yet</h3>
          <p className="muted">Check back soon or post your own promo.</p>
        </div>
      )}
    </section>
  );
}

export default function WeekendPage() {
  const list = activeAds(sampleAds).filter(isWeekend);
  const featured = list.filter((ad) => ad.is_featured || ad.is_weekly_pick);
  const trending = [...list].sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
  const friday = list.filter((ad) => new Date(`${ad.event_date}T00:00:00`).getDay() === 5);
  const saturday = list.filter((ad) => new Date(`${ad.event_date}T00:00:00`).getDay() === 6);
  const sunday = list.filter((ad) => new Date(`${ad.event_date}T00:00:00`).getDay() === 0);

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="kicker" style={{ color: "#f7c600" }}>
            Weekend guide
          </p>
          <h2>This Weekend in Jamaica</h2>
          <p>
            Featured events, parties, shows, food spots, and local deals
            happening Friday through Sunday.
          </p>
        </div>
        <WeekendBlock title="Featured Weekend Picks" ads={featured} />
        <WeekendBlock title="Tonight" ads={friday} />
        <WeekendBlock title="Saturday" ads={saturday} />
        <WeekendBlock title="Sunday" ads={sunday} />
        <WeekendBlock title="Trending" ads={trending.slice(0, 3)} />
      </div>
    </section>
  );
}
