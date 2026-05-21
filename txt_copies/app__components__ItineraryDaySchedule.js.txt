"use client";

function groupByDay(items = []) {
  return items.reduce((groups, item) => {
    const day = Number(item.day_number || 1);
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
    return groups;
  }, {});
}

export default function ItineraryDaySchedule({ items = [] }) {
  const groups = groupByDay(items);
  const days = Object.keys(groups).map(Number).sort((a, b) => a - b);

  if (!items.length) {
    return (
      <div className="empty">
        <h3>No stops added yet</h3>
        <p className="muted">Add stops to build this itinerary.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {days.map((day) => (
        <section className="panel" key={day}>
          <p className="kicker">Day {day}</p>
          <div className="promo-detail-list">
            {groups[day].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).map((item) => (
              <div key={item.id}>
                <strong>{item.start_time ? `${String(item.start_time).slice(0, 5)} · ` : ""}{item.title}</strong>
                <span>{item.location || item.parish || "Jamaica"} · {String(item.item_type || "stop").replaceAll("_", " ")}</span>
                {item.description || item.notes ? <span className="muted">{item.description || item.notes}</span> : null}
                {item.is_sponsored ? <span className="featured-tag">Sponsored stop</span> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
