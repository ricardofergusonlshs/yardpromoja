"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabaseClient";
import styles from "./AdsGrid.module.css";

/**
 * Phase 38:
 * The Trending cards should use the real uploaded post/flyer image from Supabase,
 * not the decorative reels/parish fallback artwork.
 */

const IMAGE_FIELD_NAMES = [
  "image_url",
  "flyer_url",
  "thumbnail_url",
  "cover_image_url",
  "cover_url",
  "poster_url",
  "photo_url",
  "media_url",
  "public_url",
  "file_url",
  "upload_url",
  "uploaded_image_url",
  "imageUrl",
  "flyerUrl",
  "thumbnailUrl",
  "coverImageUrl",
  "posterUrl",
  "photoUrl",
  "mediaUrl",
  "publicUrl",
  "fileUrl",
  "uploadUrl",
  "uploadedImageUrl",
  "image",
  "flyer",
  "poster",
  "photo",
  "cover",
  "picture",
  "url",
  "src",
];

const IMAGE_PATH_FIELD_NAMES = [
  "image_path",
  "flyer_path",
  "thumbnail_path",
  "cover_image_path",
  "cover_path",
  "poster_path",
  "photo_path",
  "media_path",
  "file_path",
  "upload_path",
  "uploaded_image_path",
  "storage_path",
  "object_path",
  "path",
  "key",
  "imagePath",
  "flyerPath",
  "thumbnailPath",
  "coverImagePath",
  "posterPath",
  "photoPath",
  "mediaPath",
  "filePath",
  "uploadPath",
  "uploadedImagePath",
  "storagePath",
  "objectPath",
];

const ARRAY_FIELD_NAMES = [
  "images",
  "gallery",
  "media",
  "photos",
  "attachments",
  "files",
  "flyers",
  "uploads",
  "assets",
];

const BUCKET_FIELD_NAMES = [
  "bucket",
  "storage_bucket",
  "image_bucket",
  "flyer_bucket",
  "media_bucket",
  "file_bucket",
  "upload_bucket",
  "bucket_name",
  "storageBucket",
  "imageBucket",
  "flyerBucket",
  "mediaBucket",
  "fileBucket",
  "uploadBucket",
  "bucketName",
];

const LIKELY_BUCKETS = [
  "ad-images",
  "ads",
  "flyers",
  "uploads",
  "promo-images",
  "promos",
  "images",
  "media",
  "listing-images",
  "business-images",
  "yardpromo",
  "public",
];

const FINAL_PLACEHOLDER = "/assets/yardpromo-brand-preview.png";

function firstValue(...values) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0);
}

function dedupe(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function tryJson(value) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function looksLikeImage(value) {
  if (typeof value !== "string") return false;

  const lower = value.toLowerCase();

  return (
    lower.includes("supabase") ||
    lower.includes("storage") ||
    lower.includes("upload") ||
    lower.includes("flyer") ||
    lower.includes("image") ||
    lower.includes("photo") ||
    lower.includes("poster") ||
    lower.includes(".jpg") ||
    lower.includes(".jpeg") ||
    lower.includes(".png") ||
    lower.includes(".webp") ||
    lower.includes(".gif") ||
    lower.includes(".avif")
  );
}

function extractStrings(value, depth = 0) {
  const parsed = tryJson(value);

  if (depth > 4 || parsed == null) return [];

  if (typeof parsed === "string") {
    return looksLikeImage(parsed) ? [parsed] : [];
  }

  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => extractStrings(item, depth + 1));
  }

  if (typeof parsed === "object") {
    const output = [];

    for (const [key, nestedValue] of Object.entries(parsed)) {
      const lowerKey = key.toLowerCase();

      if (
        IMAGE_FIELD_NAMES.map((field) => field.toLowerCase()).includes(lowerKey) ||
        IMAGE_PATH_FIELD_NAMES.map((field) => field.toLowerCase()).includes(lowerKey) ||
        lowerKey.includes("image") ||
        lowerKey.includes("flyer") ||
        lowerKey.includes("photo") ||
        lowerKey.includes("poster") ||
        lowerKey.includes("media") ||
        lowerKey.includes("url") ||
        lowerKey.includes("path")
      ) {
        output.push(...extractStrings(nestedValue, depth + 1));
      }
    }

    return output;
  }

  return [];
}

function normalizeLocalUrl(value) {
  if (!value || typeof value !== "string") return "";

  const cleaned = value.trim();

  if (!cleaned) return "";

  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("data:")
  ) {
    return cleaned;
  }

  if (cleaned.startsWith("/")) {
    return cleaned;
  }

  if (cleaned.startsWith("public/")) {
    return `/${cleaned.replace(/^public\//, "")}`;
  }

  if (cleaned.startsWith("assets/")) {
    return `/${cleaned}`;
  }

  return "";
}

function getBucketsFromAd(ad) {
  const buckets = [];

  for (const field of BUCKET_FIELD_NAMES) {
    const value = ad?.[field];

    if (typeof value === "string" && value.trim()) {
      buckets.push(value.trim());
    }
  }

  return dedupe([...buckets, ...LIKELY_BUCKETS]);
}

function supabasePublicUrl(supabase, bucket, path) {
  if (!supabase || !bucket || !path) return "";

  try {
    const cleanedPath = String(path)
      .trim()
      .replace(/^\/+/, "")
      .replace(/^public\//, "");

    if (!cleanedPath) return "";

    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanedPath);

    return data?.publicUrl || "";
  } catch {
    return "";
  }
}

function maybeBucketAndPath(value) {
  const cleaned = String(value || "").trim().replace(/^\/+/, "");

  if (!cleaned || !cleaned.includes("/")) return null;

  const [bucket, ...rest] = cleaned.split("/");

  if (!bucket || rest.length === 0) return null;

  return {
    bucket,
    path: rest.join("/"),
  };
}

function getRawImageValues(ad) {
  const values = [];

  for (const field of IMAGE_FIELD_NAMES) {
    values.push(ad?.[field]);
  }

  for (const field of IMAGE_PATH_FIELD_NAMES) {
    values.push(ad?.[field]);
  }

  for (const field of ARRAY_FIELD_NAMES) {
    values.push(...extractStrings(ad?.[field]));
  }

  // Also scan the full row because uploaded file paths are sometimes stored
  // under custom columns from form builders.
  values.push(...extractStrings(ad));

  return dedupe(
    values
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
  );
}

function getImageCandidates(ad, supabase) {
  const rawValues = getRawImageValues(ad);
  const buckets = getBucketsFromAd(ad);
  const candidates = [];

  for (const raw of rawValues) {
    const localOrRemote = normalizeLocalUrl(raw);

    if (localOrRemote) {
      candidates.push(localOrRemote);
    }

    const parsedBucketPath = maybeBucketAndPath(raw);

    if (parsedBucketPath) {
      candidates.push(
        supabasePublicUrl(supabase, parsedBucketPath.bucket, parsedBucketPath.path)
      );
    }

    // When a row stores only "folder/file.png", try each likely storage bucket.
    for (const bucket of buckets) {
      candidates.push(supabasePublicUrl(supabase, bucket, raw));
    }
  }

  candidates.push(FINAL_PLACEHOLDER);

  return dedupe(candidates);
}

function getSlug(ad) {
  if (ad?.slug) return ad.slug;

  const title = ad?.title || ad?.name || ad?.business_name || ad?.id || "yardpromo-event";

  return String(title)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTitle(ad) {
  return ad?.title || ad?.name || ad?.business_name || "YardPromo Event";
}

function getCategory(ad) {
  return ad?.category || ad?.type || ad?.business_type || "Promo";
}

function getLocation(ad) {
  return ad?.location || ad?.venue || ad?.address || ad?.parish || ad?.city || "Jamaica";
}

function getDateValue(ad) {
  return (
    ad?.event_date ||
    ad?.date ||
    ad?.starts_at ||
    ad?.start_time ||
    ad?.eventDate ||
    ad?.startDate ||
    ad?.created_at ||
    ""
  );
}

function formatShortDate(ad) {
  const value = getDateValue(ad);

  if (!value) return "";

  const raw = String(value).trim();

  if (!raw) return "";

  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-JM", {
      month: "short",
      day: "numeric",
    }).format(parsed);
  }

  return raw.split("T")[0] || raw;
}

function getInterested(ad) {
  return Number(ad?.interested_count || ad?.interested || ad?.views || ad?.view_count || 0);
}

function getShares(ad) {
  return Number(ad?.share_count || ad?.shares || ad?.click_count || ad?.link_clicks || 0);
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();

  if (!status) return true;

  return ["active", "approved", "published"].includes(status);
}

function normalizeAd(ad, index, supabase) {
  const imageCandidates = getImageCandidates(ad, supabase);

  return {
    id: ad?.id || `live-${index}`,
    slug: getSlug(ad),
    title: getTitle(ad),
    category: getCategory(ad),
    location: getLocation(ad),
    imageCandidates,
    date: formatShortDate(ad),
    interested: getInterested(ad),
    shares: getShares(ad),
    is_featured: ad?.is_featured ?? ad?.featured ?? index < 4,
  };
}

export default function AdsGrid({ limit = 6, ads: providedAds, section = "" }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    let mounted = true;

    async function loadAds() {
      setLoading(true);

      const supabase = createClient();

      if (providedAds && providedAds.length) {
        if (mounted) {
          setAds(providedAds.slice(0, limit).filter(isPublicLiveAd).map((ad, index) => normalizeAd(ad, index, supabase)));
          setImageIndexes({});
          setLoading(false);
        }
        return;
      }

      try {
        let query = supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (section === "premium") {
          query = query.eq("is_premium", true);
        }

        if (section === "weekend") {
          query = query.eq("is_weekend_pick", true);
        }

        if (section === "featured") {
          query = query.eq("is_featured", true);
        }

        const { data, error } = await query;

        if (error) {
          console.error("AdsGrid Supabase error:", error.message);
          if (mounted) {
            setAds([]);
            setLoading(false);
          }
          return;
        }

        const liveData = (data || []).filter(isPublicLiveAd);

        if (liveData.length > 0) {
          if (mounted) {
            setAds(liveData.slice(0, limit).map((ad, index) => normalizeAd(ad, index, supabase)));
            setImageIndexes({});
            setLoading(false);
          }
          return;
        }

        if (section === "premium" || section === "weekend" || section === "featured") {
          const { data: fallbackLiveAds, error: fallbackError } = await supabase
            .from("ads")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

          if (fallbackError) {
            console.error("AdsGrid fallback Supabase error:", fallbackError.message);
            if (mounted) {
              setAds([]);
              setLoading(false);
            }
            return;
          }

          const fallbackData = (fallbackLiveAds || []).filter(isPublicLiveAd);

          if (fallbackData.length > 0) {
            if (mounted) {
              setAds(fallbackData.slice(0, limit).map((ad, index) => normalizeAd(ad, index, supabase)));
              setImageIndexes({});
              setLoading(false);
            }
            return;
          }
        }

        if (mounted) {
          setAds([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("AdsGrid load error:", error);
        if (mounted) {
          setAds([]);
          setLoading(false);
        }
      }
    }

    loadAds();

    return () => {
      mounted = false;
    };
  }, [limit, providedAds, section]);

  function tryNextImage(ad) {
    setImageIndexes((current) => {
      const currentIndex = current[ad.slug] || 0;
      const nextIndex = Math.min(currentIndex + 1, ad.imageCandidates.length - 1);

      return {
        ...current,
        [ad.slug]: nextIndex,
      };
    });
  }

  if (loading) {
    return (
      <div className={styles.empty}>
        <h3>Loading promos...</h3>
        <p>Fetching the latest YardPromo listings.</p>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>No promos yet</h3>
        <p>Promos will appear here soon.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} ${isHomePage ? styles.homeGrid : ""}`}>
      {ads.map((ad, index) => {
        const href = `/ad/${encodeURIComponent(ad.slug)}`;
        const imageIndex = imageIndexes[ad.slug] || 0;
        const imageSrc = ad.imageCandidates[imageIndex] || FINAL_PLACEHOLDER;

        return (
          <article className={styles.card} key={ad.id || ad.slug || index}>
            <Link href={href} className={styles.cardLink} aria-label={`View ${ad.title}`}>
              <div className={styles.media}>
                <img
                  src={imageSrc}
                  alt={ad.title}
                  onError={() => tryNextImage(ad)}
                />

                {ad.is_featured ? <span className={styles.featured}>Featured</span> : null}
              </div>

              <div className={styles.body}>
                <span className={styles.category}>{ad.category}</span>
                <h3>{ad.title}</h3>

                <p className={styles.location}>
                  <span aria-hidden="true">⌖</span>
                  {ad.location}
                </p>

                <div className={styles.footer}>
                  <span title="Interested">
                    <em aria-hidden="true">♡</em>
                    {ad.interested}
                  </span>
                  <span title="Shares">
                    <em aria-hidden="true">↗</em>
                    {ad.shares}
                  </span>
                  {ad.date ? <small>{ad.date}</small> : null}
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
