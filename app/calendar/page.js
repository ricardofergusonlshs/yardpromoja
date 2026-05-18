"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getPoster(ad) {
  return (
    ad?.poster_image_url ||
    ad?.image_url ||
    ad?.flyer_url ||
    ad?.cover_image ||
    ad?.posterUrl ||
    ad?.image ||
    "/assets/yardpromo-brand-preview.png"
  );
}

function getSlug(ad) {
  if (ad?.slug) return ad.slug;

  const title = ad?.title || ad?.name || ad?.id || "yardpromo-event";

  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();
  return status === "active" || status === "approved";
}

function getEventDate(ad) {
  const value = ad?.event_date || ad?.date || ad?.starts_at || ad?.start_time;

  if (!value) return null;

  const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function isUpcoming(ad) {
  const eventDate = getEventDate(ad);
  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  eventDate.setHours(0, 0, 0, 0);

  return eventDate >= today;
}

function formatDate(ad) {
  const date = getEventDate(ad);

  if (!date) return "Date coming soon";

  return date.toLocaleDateString("en-JM", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(ad) {
  return ad?.event_time || ad?.time || "";
}

function monthLabel(date) {
  return date.toLocaleDateString("en-JM", {
    month: "long",
    year: "numeric",
  });
}

function sameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
}

function CalendarEventCard({ ad }) {
  const slug = getSlug(ad);

  return (
    <article className="card calendar-event-card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Link href={`/ad/${slug}`} style={{ flex: "0 0 140px" }}>
          <img
            src={getPoster(ad)}
            alt={ad?.title || "Promo poster"}
            style={{
              width: 140,
              height: 140,
              objectFit: "cover",
              borderRadius: 18,
              background: "#f1f5f9",
            }}
          />
        </Link>

        <div style={{ flex: 1, minWidth: 220 }}>
          <p className="kicker">{ad?.category || "Promo"}</p>

          <h3 style={{ marginTop: 4 }}>{ad?.title || "Untitled promo"}</h3>

          <p className="muted" style={{ marginTop: 6 }}>
            {formatDate(ad)}
            {formatTime(ad) ? ` • ${formatTime(ad)}` : ""}
          </p>

          <p className="muted" style={{ marginTop: 6 }}>
            {[ad?.venue, ad?.location, ad?.parish].filter(Boolean).join(" • ") ||
              "Jamaica"}
          </p>

          {ad?.price ? (
            <p style={{ marginTop: 8, fontWeight: 800 }}>{ad.price}</p>
          ) : null}

          <div style={{ marginTop: 14 }}>
            <Link className="btn btn-primary" href={`/ad/${slug}`}>
              View promo
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CalendarPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    let alive = true;

    async function loadCalendarAds() {
      setLoading(true);
      setMessage("");

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("event_date", { ascending: true })
          .order("event_time", { ascending: true });

        if (error) throw error;

        const publicUpcomingAds = (data || [])
          .filter(isPublicLiveAd)
          .filter(isUpcoming);

        if (alive) {
          setAds(publicUpcomingAds);
        }
      } catch (error) {
        console.error("Calendar load error:", error);

        if (alive) {
          setMessage("Unable to load upcoming events right now.");
          setAds([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadCalendarAds();

    return () => {
      alive = false;
    };
  }, []);

  function goToPreviousMonth() {
    setCurrentMonth((month) => {
      return new Date(month.getFullYear(), month.getMonth() - 1, 1);
    });
  }

  function goToNextMonth() {
    setCurrentMonth((month) => {
      return new Date(month.getFullYear(), month.getMonth() + 1, 1);
    });
  }

  function goToThisMonth() {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayBlankCells = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstDayBlankCells }, (_, index) => ({
        type: "blank",
        key: `blank-${index}`,
      })),
      ...Array.from({ length: daysInMonth }, (_, index) => ({
        type: "day",
        day: index + 1,
        key: `day-${index + 1}`,
      })),
    ];
  }, [currentMonth]);

  const adsByDay = useMemo(() => {
    const grouped = {};

    ads.forEach((ad) => {
      const date = getEventDate(ad);
      if (!date || !sameMonth(date, currentMonth)) return;

      const day = date.getDate();

      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(ad);
    });

    return grouped;
  }, [ads, currentMonth]);

  const currentMonthAds = useMemo(() => {
    return ads.filter((ad) => {
      const date = getEventDate(ad);
      return date && sameMonth(date, currentMonth);
    });
  }, [ads, currentMonth]);

  return (
    <section className="section calendar-page">
      <div className="container calendar-container">
        <div className="section-head calendar-title-row">
          <div>
            <p className="kicker">Calendar</p>
            <h1>Events calendar.</h1>
            <p className="muted">
              View upcoming public promos and events across Jamaica. No signup
              needed.
            </p>
          </div>

          <Link className="btn btn-primary calendar-post-btn" href="/create">
            Post Event
          </Link>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            className="btn btn-light calendar-nav-btn"
            onClick={goToPreviousMonth}
          >
            Previous
          </button>

          <button
            type="button"
            className="btn btn-light calendar-nav-btn"
            onClick={goToThisMonth}
          >
            This Month
          </button>

          <h2>{monthLabel(currentMonth)}</h2>

          <button
            type="button"
            className="btn btn-light calendar-nav-btn"
            onClick={goToNextMonth}
          >
            Next
          </button>

          <Link className="btn btn-light calendar-nav-btn" href="/browse">
            Browse
          </Link>
        </div>

        {loading ? (
          <div className="empty" style={{ marginTop: 22 }}>
            <h3>Loading calendar...</h3>
            <p className="muted">Fetching upcoming public promos.</p>
          </div>
        ) : null}

        {!loading && message ? (
          <div className="empty" style={{ marginTop: 22 }}>
            <h3>Calendar unavailable</h3>
            <p className="muted">{message}</p>
          </div>
        ) : null}

        {!loading && !message ? (
          <>
            <div className="calendar-weekdays">
              {weekdays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarCells.map((cell) => {
                if (cell.type === "blank") {
                  return <div className="calendar-cell blank" key={cell.key} />;
                }

                const events = adsByDay[cell.day] || [];

                return (
                  <div
                    className={`calendar-cell ${
                      events.length ? "has-event" : ""
                    }`}
                    key={cell.key}
                  >
                    <span className="calendar-day-number">{cell.day}</span>

                    {events.slice(0, 2).map((event) => (
                      <Link
                        className="calendar-event"
                        href={`/ad/${getSlug(event)}`}
                        key={event.id || getSlug(event)}
                      >
                        {event.title || "Untitled promo"}
                      </Link>
                    ))}

                    {events.length > 2 ? (
                      <small className="muted">+{events.length - 2} more</small>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="calendar-upcoming panel">
              <div className="section-head compact">
                <div>
                  <p className="kicker">Upcoming</p>
                  <h2>Promos this month.</h2>
                </div>

                <Link className="btn btn-light" href="/browse">
                  View All
                </Link>
              </div>

              {currentMonthAds.length ? (
                <div
                  className="calendar-upcoming-list"
                  style={{ display: "grid", gap: 14 }}
                >
                  {currentMonthAds.map((ad) => (
                    <CalendarEventCard key={ad.id || getSlug(ad)} ad={ad} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <h3>No events for {monthLabel(currentMonth)}.</h3>
                  <p className="muted">
                    Use Previous or Next to browse another month.
                  </p>
                  <Link
                    className="btn btn-primary"
                    href="/create"
                    style={{ marginTop: 14 }}
                  >
                    Post your promo
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}