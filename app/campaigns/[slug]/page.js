import Link from "next/link";
import { notFound } from "next/navigation";
import { activeCampaigns, getCampaign } from "@/lib/yardpromoData";
import CampaignClient from "../CampaignClient";

export const dynamicParams = true;

export function generateStaticParams() {
  return activeCampaigns().map((campaign) => ({
    slug: campaign.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);

  if (!campaign) {
    return {
      title: "Campaign Not Found | YardPromo Jamaica",
    };
  }

  return {
    title: `${campaign.title} | YardPromo Jamaica`,
    description:
      campaign.subtitle ||
      "Join this YardPromo campaign, giveaway, poll, guest list, or hashtag challenge.",
  };
}

export default async function CampaignDetailPage({ params }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);

  if (!campaign) {
    notFound();
  }

  const status = String(campaign.status || "").toLowerCase();

  if (!["active", "approved"].includes(status)) {
    notFound();
  }

  return (
    <main className="section campaign-detail-page">
      <div className="container">
        <Link className="btn btn-light" href="/campaigns">
          ← Back to Campaigns
        </Link>

        <CampaignClient campaign={campaign} />
      </div>
    </main>
  );
}