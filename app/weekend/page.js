import AdsGrid from "../AdsGrid";

function WeekendBlock({ title, section = "", limit = 3 }) {
  return (
    <section className="section" style={{ padding: "28px 0" }}>
      <div className="section-head">
        <div>
          <p className="kicker">Weekend</p>
          <h2>{title}</h2>
        </div>
      </div>

      <AdsGrid limit={limit} section={section} />
    </section>
  );
}

export default function WeekendPage() {
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

        <WeekendBlock
          title="Featured Weekend Picks"
          section="weekend"
          limit={3}
        />

        <WeekendBlock
          title="Latest Promos"
          limit={6}
        />
      </div>
    </section>
  );
}