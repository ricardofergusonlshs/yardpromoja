"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { sampleAds } from "../../lib/yardpromoData";

const monthName = "May 2026";

const calendarEvents = [
  {
    day: 22,
    title: "Uptown Friday Dancehall Party",
    slug: "uptown-friday-dancehall-party",
  },
  {
    day: 24,
    title: "Reggae Sunset Live",
    slug: "reggae-sunset-live",
  },
  {
    day: 29,
    title: "MoBay Comedy Night",
    slug: "mobay-comedy-night",
  },
];

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getEventForDay(day) {
  return calendarEvents.find((event) => event.day === day);
}

export default function CalendarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data?.user) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (checking) {
    return (
      <main className="section">
        <div className="container">
          <div className="toast">Checking login status...</div>
        </div>
      </main>
    );
  }

  const firstDayBlankCells = 5; // May 1, 2026 is Friday.
  const daysInMonth = 31;

  const cells = [
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

  return (
    <section className="section calendar-page">
      <div className="container calendar-container">
        <div className="section-head calendar-title-row">
          <div>
            <p className="kicker">Calendar</p>
            <h1>Events calendar.</h1>
          </div>

          <Link className="btn btn-primary calendar-post-btn" href="/create">
            Post Event
          </Link>
        </div>

        <div className="calendar-controls">
          <Link className="btn btn-light calendar-nav-btn" href="/calendar">
            Previous
          </Link>

          <h2>{monthName}</h2>

          <Link className="btn btn-light calendar-nav-btn" href="/calendar">
            Next
          </Link>
        </div>

        <div className="calendar-weekdays">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((cell) => {
            if (cell.type === "blank") {
              return <div className="calendar-cell blank" key={cell.key} />;
            }

            const event = getEventForDay(cell.day);

            return (
              <div
                className={`calendar-cell ${event ? "has-event" : ""}`}
                key={cell.key}
              >
                <span className="calendar-day-number">{cell.day}</span>

                {event && (
                  <Link className="calendar-event" href={`/ad/${event.slug}`}>
                    {event.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-upcoming panel">
          <div className="section-head compact">
            <div>
              <p className="kicker">Upcoming</p>
              <h2>Upcoming promos.</h2>
            </div>

            <Link className="btn btn-light" href="/browse">
              View All
            </Link>
          </div>

          <div className="calendar-upcoming-list">
            {calendarEvents.map((event) => {
              const ad = sampleAds.find((item) => item.slug === event.slug);

              return (
                <Link
                  className="calendar-upcoming-item"
                  href={`/ad/${event.slug}`}
                  key={event.slug}
                >
                  <span className="calendar-upcoming-date">
                    May {event.day}
                  </span>

                  <span>
                    <strong>{event.title}</strong>
                    <small>{ad?.location || "Jamaica"}</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}