import Link from "next/link";
import {
  activeCampaigns,
  campaignStatSummary,
  campaignUrl,
} from "@/lib/yardpromoData";

export const metadata = {
  title: "Campaigns & Giveaways | YardPromo Jamaica",
  description:
    "Join YardPromo campaigns, share to win tickets, vote for DJs, RSVP for guest lists, and enter hashtag challenges across Jamaica.",
};

export default function CampaignsPage() {
  const publicCampaigns = activeCampaigns();

  return (
    <section className="section campaigns-page">
      <div className="container">
        <div className="campaigns-hero panel">
          <p className="kicker">Campaigns & Giveaways</p>
          <h1>Win tickets, vote for DJs, join guest lists, and support promos.</h1>
          <p>
            YardPromo campaigns help promoters and businesses run interactive
            promotions across Jamaica — from share-to-win giveaways to DJ polls,
            guest lists, hashtag challenges, referrals, and sale offers.
          </p>

          <div className="hero-actions">
           
            
          </div>
        </div>

        <div className="section-head">
          <div>
            <p className="kicker">Active campaigns</p>
            <h2>Choose a campaign to join.</h2>
          </div>
        </div>

        {publicCampaigns.length ? (
          <div className="campaign-grid">
            {publicCampaigns.map((campaign) => {
              const stats = campaignStatSummary(campaign);

              return (
                <article className="campaign-card campaign-feature-card" key={campaign.slug}>
                  <div className="campaign-card-media">
                    <div className="campaign-placeholder">
                      <span>{campaign.type}</span>
                    </div>
                    {campaign.featured ? <span className="featured-tag">Featured</span> : null}
                  </div>

                  <div className="campaign-body">
                    <span className="campaign-type">{campaign.type}</span>
                    <h3>{campaign.title}</h3>
                    <p className="muted">{campaign.subtitle}</p>

                    <div className="campaign-mini-stats">
                      <span>{stats.participants} participants</span>
                      <span>{stats.shares} shares</span>
                      <span>{stats.votes} votes</span>
                      <span>{stats.rsvps} RSVPs</span>
                    </div>

                    {campaign.reward ? (
                      <p className="campaign-reward">
                        <strong>Reward:</strong> {campaign.reward}
                      </p>
                    ) : null}

                    <Link className="btn btn-primary" href={campaignUrl(campaign.slug)}>
                      Open Campaign
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <h3>No active campaigns yet.</h3>
            <p className="muted">
              When campaigns are approved, they will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}