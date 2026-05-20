"use client";

import { useEffect, useMemo, useState } from "react";

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function cleanCountryCode(value) {
  const digits = digitsOnly(value);
  return digits ? `+${digits}` : "+1";
}

function buildPhone(countryCode, localNumber) {
  return `${cleanCountryCode(countryCode)}${digitsOnly(localNumber)}`;
}

function isValidPhone(countryCode, localNumber) {
  return /^\+[1-9]\d{7,14}$/.test(buildPhone(countryCode, localNumber));
}

function getSessionId() {
  const key = "yp_campaign_session_id";
  let value = window.localStorage.getItem(key);

  if (!value) {
    value = `sess_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    window.localStorage.setItem(key, value);
  }

  return value;
}

export default function CampaignClient({ campaign }) {
  const [message, setMessage] = useState("");
  const [shareCount, setShareCount] = useState(Number(campaign.shares || 0));
  const [participantCount, setParticipantCount] = useState(Number(campaign.participants || 0));
  const [rsvpCount, setRsvpCount] = useState(Number(campaign.rsvps || 0));
  const [referralCount, setReferralCount] = useState(Number(campaign.referrals || 0));
  const [optionVotes, setOptionVotes] = useState(
    (campaign.options || []).map((_, index) => Number((campaign.option_votes || [])[index] || 0))
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [localPhone, setLocalPhone] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: "1",
    socialHandle: "",
    postLink: "",
  });

  const campaignType = String(campaign.type || "").toLowerCase();
  const isVoteCampaign = campaignType.includes("vote") || campaignType.includes("poll");
  const isRsvpCampaign = campaignType.includes("rsvp") || campaignType.includes("guest");
  const isHashtagCampaign = campaignType.includes("hashtag");

  const shareUrl =
    typeof window === "undefined"
      ? `/campaigns/${campaign.slug}`
      : `${window.location.origin}/campaigns/${campaign.slug}`;

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "server";
    return getSessionId();
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(`yp_campaign_${campaign.slug}`);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);
      if (typeof saved.shareCount === "number") setShareCount(saved.shareCount);
      if (typeof saved.participantCount === "number") setParticipantCount(saved.participantCount);
      if (typeof saved.rsvpCount === "number") setRsvpCount(saved.rsvpCount);
      if (typeof saved.referralCount === "number") setReferralCount(saved.referralCount);
      if (Array.isArray(saved.optionVotes)) setOptionVotes(saved.optionVotes);
    } catch {
      // Ignore invalid local data.
    }
  }, [campaign.slug]);

  function saveLocal(next) {
    window.localStorage.setItem(
      `yp_campaign_${campaign.slug}`,
      JSON.stringify({
        shareCount,
        participantCount,
        rsvpCount,
        referralCount,
        optionVotes,
        ...next,
      })
    );
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function copyShareLink() {
    const caption = `${campaign.title}\n${campaign.reward ? `${campaign.reward}\n` : ""}${shareUrl}`;

    await navigator.clipboard.writeText(caption);

    const nextShareCount = shareCount + 1;
    const nextReferralCount = referralCount + 1;

    setShareCount(nextShareCount);
    setReferralCount(nextReferralCount);
    saveLocal({ shareCount: nextShareCount, referralCount: nextReferralCount });
    setMessage("Campaign caption copied. Share it to invite others.");
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({
        title: campaign.title,
        text: `${campaign.title}${campaign.reward ? ` — ${campaign.reward}` : ""}`,
        url: shareUrl,
      });

      const nextShareCount = shareCount + 1;
      setShareCount(nextShareCount);
      saveLocal({ shareCount: nextShareCount });
      setMessage("Thanks for sharing this campaign.");
      return;
    }

    copyShareLink();
  }

  function submitEntry(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!isValidPhone(countryCode, localPhone)) {
      setMessage("Choose your country code and enter a valid WhatsApp number.");
      return;
    }

    const nextParticipantCount = participantCount + 1;
    setParticipantCount(nextParticipantCount);
    saveLocal({ participantCount: nextParticipantCount });
    setMessage("Entry received for review. No entry is auto-approved.");

    setForm({
      name: "",
      email: "",
      guests: "1",
      socialHandle: "",
      postLink: "",
    });
    setLocalPhone("");
  }

  function submitVote(event) {
    event.preventDefault();

    if (!selectedOption) {
      setMessage("Choose an option before voting.");
      return;
    }

    const voteKey = `yp_voted_${campaign.slug}_${sessionId}`;

    if (window.localStorage.getItem(voteKey)) {
      setMessage("You already voted on this device.");
      return;
    }

    const optionIndex = (campaign.options || []).findIndex((option) => option === selectedOption);

    if (optionIndex < 0) {
      setMessage("Invalid vote option.");
      return;
    }

    const nextVotes = optionVotes.map((count, index) =>
      index === optionIndex ? Number(count || 0) + 1 : Number(count || 0)
    );

    setOptionVotes(nextVotes);
    window.localStorage.setItem(voteKey, selectedOption);
    saveLocal({ optionVotes: nextVotes });
    setMessage("Vote counted on this device. Final results may be reviewed.");
  }

  function submitRsvp(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!isValidPhone(countryCode, localPhone)) {
      setMessage("Choose your country code and enter a valid WhatsApp number.");
      return;
    }

    const nextRsvpCount = rsvpCount + 1;
    const nextParticipantCount = participantCount + 1;

    setRsvpCount(nextRsvpCount);
    setParticipantCount(nextParticipantCount);
    saveLocal({
      rsvpCount: nextRsvpCount,
      participantCount: nextParticipantCount,
    });
    setMessage("RSVP received as pending. The promoter may confirm the guest list.");

    setForm({
      name: "",
      email: "",
      guests: "1",
      socialHandle: "",
      postLink: "",
    });
    setLocalPhone("");
  }

  const totalVotes = optionVotes.reduce((sum, count) => sum + Number(count || 0), 0);

  return (
    <div className="campaign-detail-shell">
      <section className="campaign-detail-hero panel">
        <div>
          <p className="kicker">{campaign.type}</p>
          <h1>{campaign.title}</h1>
          <p className="muted">{campaign.subtitle}</p>

          <div className="trust-row">
            <span>{campaign.location || campaign.parish || "Jamaica"}</span>
            {campaign.ends_at ? <span>Ends {campaign.ends_at}</span> : null}
            {campaign.reward ? <span>Reward: {campaign.reward}</span> : null}
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={nativeShare}>
              Share Campaign
            </button>
            <button className="btn btn-light" type="button" onClick={copyShareLink}>
              Copy Caption
            </button>
            <a
              className="btn btn-gold"
              href={`https://wa.me/?text=${encodeURIComponent(`${campaign.title}\n${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="campaign-score-card">
          <div className="engagement-strip">
            <div className="engagement-stat">
              <strong>{participantCount}</strong>
              <span>Participants</span>
            </div>
            <div className="engagement-stat">
              <strong>{shareCount}</strong>
              <span>Shares</span>
            </div>
            <div className="engagement-stat">
              <strong>{totalVotes || Number(campaign.votes || 0)}</strong>
              <span>Votes</span>
            </div>
            <div className="engagement-stat">
              <strong>{rsvpCount}</strong>
              <span>RSVPs</span>
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div className="mini-success" style={{ marginTop: 18 }}>
          {message}
        </div>
      ) : null}

      <section className="layout-2" style={{ marginTop: 24 }}>
        <div className="panel">
          <p className="kicker">Campaign action</p>

          {isVoteCampaign ? (
            <>
              <h2>Vote now.</h2>

              <form className="form-grid" onSubmit={submitVote}>
                {(campaign.options || []).map((option, index) => {
                  const count = Number(optionVotes[index] || 0);
                  const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

                  return (
                    <label className="campaign-option" key={option}>
                      <span>
                        <input
                          type="radio"
                          name="vote"
                          value={option}
                          checked={selectedOption === option}
                          onChange={(event) => setSelectedOption(event.target.value)}
                        />
                        {option}
                      </span>

                      <strong>{count} votes</strong>

                      <div className="progress-line">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                    </label>
                  );
                })}

                <button className="btn btn-primary" type="submit">
                  Submit Vote
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>
                {isRsvpCampaign
                  ? "Join the guest list."
                  : isHashtagCampaign
                  ? "Submit your hashtag entry."
                  : "Enter share-to-win."}
              </h2>

              {isHashtagCampaign ? (
                <p className="muted">
                  Post publicly using <strong>{campaign.hashtag}</strong>, then submit your
                  handle or post link.
                </p>
              ) : null}

              <CampaignEntryForm
                form={form}
                updateForm={updateForm}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                localPhone={localPhone}
                setLocalPhone={setLocalPhone}
                onSubmit={isRsvpCampaign ? submitRsvp : submitEntry}
                showGuests={isRsvpCampaign}
                showSocial={isHashtagCampaign}
                buttonText={
                  isRsvpCampaign
                    ? "Submit RSVP"
                    : isHashtagCampaign
                    ? "Submit Challenge Entry"
                    : "Enter Campaign"
                }
              />
            </>
          )}
        </div>

        <aside className="panel">
          <p className="kicker">Rules</p>
          <h3>Campaign rules.</h3>

          <ul className="campaign-rules">
            {(campaign.rules || []).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <div className="mini-success">
            Entries are kept pending for review. No campaign entry is auto-approved.
          </div>
        </aside>
      </section>
    </div>
  );
}

function CampaignEntryForm({
  form,
  updateForm,
  countryCode,
  setCountryCode,
  localPhone,
  setLocalPhone,
  onSubmit,
  showGuests = false,
  showSocial = false,
  buttonText = "Submit",
}) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={updateForm}
          placeholder="Your name"
          required
        />
      </label>

      <div className="form-row">
        <label>
          Country code
          <input
            value={countryCode}
            onChange={(event) => setCountryCode(cleanCountryCode(event.target.value))}
            placeholder="+1"
            required
          />
        </label>

        <label>
          Phone / WhatsApp
          <input
            value={localPhone}
            onChange={(event) => setLocalPhone(digitsOnly(event.target.value))}
            placeholder="8761234567"
            required
          />
        </label>
      </div>

      <label>
        Email optional
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={updateForm}
          placeholder="you@example.com"
        />
      </label>

      {showGuests ? (
        <label>
          Number of guests
          <input
            name="guests"
            type="number"
            min="1"
            max="10"
            value={form.guests}
            onChange={updateForm}
          />
        </label>
      ) : null}

      {showSocial ? (
        <>
          <label>
            Social handle
            <input
              name="socialHandle"
              value={form.socialHandle}
              onChange={updateForm}
              placeholder="@yourhandle"
            />
          </label>

          <label>
            Post link optional
            <input
              name="postLink"
              value={form.postLink}
              onChange={updateForm}
              placeholder="https://..."
            />
          </label>
        </>
      ) : null}

      <button className="btn btn-primary" type="submit">
        {buttonText}
      </button>
    </form>
  );
}