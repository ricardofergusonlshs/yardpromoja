"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { activeAds, cleanAd, sampleAds } from "@/lib/yardpromoData";
import styles from "./HeroStack.module.css";

/**
 * Phase 50:
 * Hero must use PROMO UPLOAD images only.
 *
 * Fix:
 * Earlier phases scanned too broadly for any image-like value in a row. That
 * allowed non-promo assets such as reels, parish artwork, or brand graphics to
 * appear in the hero.
 *
 * This version:
 * - prefers the actual uploaded promo/flyer/post image fields
 * - ignores reel images
 * - ignores parish images
 * - ignores brand/placeholder images unless every real upload is missing
 * - filters hero slides to rows that have a real promo upload image first
 */

const PROMO_UPLOAD_IMAGE_FIELDS = [
  "flyer_url",
  "flyerUrl",
  "flyer",
  "flyer_image",
  "flyerImage",
  "flyer_image_url",
  "flyerImageUrl",
  "flyer_public_url",
  "flyerPublicUrl",
  "flyer_path",
  "flyerPath",

  "image_url",
  "imageUrl",
  "image",
  "image_public_url",
  "imagePublicUrl",
  "image_path",
  "imagePath",

  "uploaded_image_url",
  "uploadedImageUrl",
  "uploaded_image",
  "uploadedImage",
  "uploaded_image_path",
  "uploadedImagePath",
  "upload_url",
  "uploadUrl",
  "upload_path",
  "uploadPath",

  "promo_image_url",
  "promoImageUrl",
  "promo_image",
  "promoImage",
  "promo_image_path",
  "promoImagePath",

  "post_image_url",
  "postImageUrl",
  "post_image",
  "postImage",
  "post_image_path",
  "postImagePath",

  "poster_url",
  "posterUrl",
  "poster",
  "poster_image_url",
  "posterImageUrl",
  "poster_path",
  "posterPath",

  "cover_image_url",
  "coverImageUrl",
  "cover_url",
  "coverUrl",
  "cover",
  "cover_image_path",
  "coverImagePath",

  "media_url",
  "mediaUrl",
  "media_path",
  "mediaPath",

  "thumbnail_url",
  "thumbnailUrl",
  "thumbnail_path",
  "thumbnailPath",

  "file_url",
  "fileUrl",
  "file_path",
  "filePath",
  "public_url",
  "publicUrl",
  "storage_path",
  "storagePath",
  "object_path",
  "objectPath",
];

const PROMO_UPLOAD_ARRAY_FIELDS = [
  "images",
  "gallery",
  "photos",
  "attachments",
  "files",
  "uploads",
  "flyers",
  "assets",
  "media",
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

const PROMO_BUCKETS = [
  "ad-images",
  "ads",
  "flyers",
  "uploads",
  "promo-images",
  "promos",
  "promo_uploads",
  "promo-uploads",
  "post-images",
  "listing-images",
  "business-images",
  "images",
  "media",
  "public",
];

const BLOCKED_IMAGE_HINTS = [
  "/assets/reels/",
  "assets/reels/",
  "/reels/",
  "reels/",
  "/assets/parishes/",
  "assets/parishes/",
  "/parishes/",
  "parishes/",
  "jamaica-parish-map",
  "yardpromo-brand",
  "yardpromo-logo",
  "yardpromo-icon",
  "app-icon",
  "favicon",
  "brand-preview",
  "brand-presentation",
];

const HERO_FINAL_PLACEHOLDER = "/assets/yardpromo-brand-preview.png";

const fallbackPromos = [
  {
    id: "fallback-uploaded-promo",
    title: "Featured Promo",
    category: "Promo",
    location: "Jamaica",
    date: "Featured now",
    slug: "featured-promo",
    image_url: HERO_FINAL_PLACEHOLDER,
  },
];

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
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("/") ||
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

function isBlockedNonPromoImage(value) {
  if (!value || typeof value !== "string") return true;

  const lower = value.toLowerCase();

  if (!looksLikeImage(lower)) return true;

  return BLOCKED_IMAGE_HINTS.some((hint) => lower.includes(hint));
}

function extractUploadStrings(value, depth = 0) {
  const parsed = tryJson(value);

  if (depth > 4 || parsed == null) return [];

  if (typeof parsed === "string") {
    return looksLikeImage(parsed) && !isBlockedNonPromoImage(parsed) ? [parsed] : [];
  }

  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => extractUploadStrings(item, depth + 1));
  }

  if (typeof parsed === "object") {
    const output = [];

    for (const [key, nestedValue] of Object.entries(parsed)) {
      const lowerKey = key.toLowerCase();

      const likelyUploadKey =
        lowerKey.includes("flyer") ||
        lowerKey.includes("poster") ||
        lowerKey.includes("promo") ||
        lowerKey.includes("post") ||
        lowerKey.includes("upload") ||
        lowerKey.includes("image") ||
        lowerKey.includes("photo") ||
        lowerKey.includes("media") ||
        lowerKey.includes("file") ||
        lowerKey.includes("url") ||
        lowerKey.includes("path");

      const blockedKey =
        lowerKey.includes("reel") ||
        lowerKey.includes("parish") ||
        lowerKey.includes("brand") ||
        lowerKey.includes("logo") ||
        lowerKey.includes("icon");

      if (likelyUploadKey && !blockedKey) {
        output.push(...extractUploadStrings(nestedValue, depth + 1));
      }
    }

    return output;
  }

  return [];
}

function normalizeLocalUrl(value) {
  if (!value || typeof value !== "string") return "";

  const cleaned = value.trim();

  if (!cleaned || isBlockedNonPromoImage(cleaned)) return "";

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

  return dedupe([...buckets, ...PROMO_BUCKETS]);
}

function supabasePublicUrl(supabase, bucket, path) {
  if (!supabase || !bucket || !path) return "";

  try {
    const cleanedPath = String(path)
      .trim()
      .replace(/^\/+/, "")
      .replace(/^public\//, "");

    if (!cleanedPath || isBlockedNonPromoImage(cleanedPath)) return "";

    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanedPath);

    return data?.publicUrl || "";
  } catch {
    return "";
  }
}

function maybeBucketAndPath(value) {
  const cleaned = String(value || "").trim().replace(/^\/+/, "");

  if (!cleaned || !cleaned.includes("/") || isBlockedNonPromoImage(cleaned)) return null;

  const [bucket, ...rest] = cleaned.split("/");

  if (!bucket || rest.length === 0) return null;

  return {
    bucket,
    path: rest.join("/"),
  };
}

function getPromoUploadValues(ad) {
  const values = [];

  for (const field of PROMO_UPLOAD_IMAGE_FIELDS) {
    values.push(ad?.[field]);
  }

  for (const field of PROMO_UPLOAD_ARRAY_FIELDS) {
    values.push(...extractUploadStrings(ad?.[field]));
  }

  return dedupe(
    values
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter((value) => value && !isBlockedNonPromoImage(value))
  );
}

function getImageCandidates(ad, supabase) {
  const rawValues = getPromoUploadValues(ad);
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

    for (const bucket of buckets) {
      candidates.push(supabasePublicUrl(supabase, bucket, raw));
    }
  }

  return dedupe(candidates.filter((candidate) => !isBlockedNonPromoImage(candidate)));
}

function mergeRawWithClean(rawRow) {
  let cleaned = {};

  try {
    cleaned = cleanAd(rawRow) || {};
  } catch {
    cleaned = {};
  }

  return {
    ...rawRow,
    ...cleaned,
  };
}

function getPromoSlug(ad) {
  if (ad?.slug) return ad.slug;

  const base = String(ad?.title || ad?.name || ad?.business_name || "promo")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base || "promo"}-${ad?.id || Date.now()}`;
}

function getPromoTitle(ad) {
  return ad?.title || ad?.name || ad?.business_name || "Featured Promo";
}

function formatPromoDate(value) {
  if (!value) return "Featured now";

  const raw = String(value).trim();

  if (!raw) return "Featured now";

  if (!raw.includes("T") && !/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw;

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) return raw.split("T")[0] || raw;

  return new Intl.DateTimeFormat("en-JM", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getPromoDate(ad) {
  return formatPromoDate(
    ad?.date ||
      ad?.event_date ||
      ad?.starts_at ||
      ad?.start_date ||
      ad?.eventDate ||
      ad?.startDate ||
      ad?.created_at
  );
}

function getPromoLocation(ad) {
  return (
    ad?.location ||
    ad?.venue ||
    ad?.address ||
    ad?.parish ||
    ad?.city ||
    "Jamaica"
  );
}

function getPromoCategory(ad) {
  return ad?.category || ad?.type || ad?.business_type || "Featured";
}

function isPublicLiveAd(ad) {
  const status = String(ad?.status || "").toLowerCase();

  if (!status) return true;

  return ["active", "approved", "published"].includes(status);
}

function isNotReelOrSystemRow(ad) {
  const typeText = [
    ad?.type,
    ad?.category,
    ad?.business_type,
    ad?.kind,
    ad?.source,
    ad?.collection,
    ad?.page_type,
  ]
    .join(" ")
    .toLowerCase();

  return (
    !typeText.includes("reel") &&
    !typeText.includes("parish") &&
    !typeText.includes("map") &&
    !typeText.includes("brand")
  );
}

function normalisePromo(rawAd, index = 0, supabase = null) {
  const ad = mergeRawWithClean(rawAd);
  const imageCandidates = getImageCandidates(ad, supabase);

  return {
    ...ad,
    title: getPromoTitle(ad),
    category: getPromoCategory(ad),
    location: getPromoLocation(ad),
    date: getPromoDate(ad),
    slug: getPromoSlug(ad),
    imageCandidates,
  };
}

function hasRealUploadImage(ad, supabase) {
  return getImageCandidates(mergeRawWithClean(ad), supabase).length > 0;
}

export default function HeroStack() {
  const [promos, setPromos] = useState(
    fallbackPromos.map((promo, index) => normalisePromo(promo, index))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    let alive = true;

    async function loadPromos() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(40);

        if (error) throw error;

        const rawRows = (data || [])
          .filter(isPublicLiveAd)
          .filter(isNotReelOrSystemRow);

        const uploadRows = rawRows.filter((row) => hasRealUploadImage(row, supabase));
        const selectedRows = uploadRows.length > 0 ? uploadRows : rawRows;

        const source =
          selectedRows.length > 0
            ? selectedRows
            : activeAds && activeAds.length > 0
              ? activeAds.filter(isNotReelOrSystemRow)
              : sampleAds && sampleAds.length > 0
                ? sampleAds.filter(isNotReelOrSystemRow)
                : fallbackPromos;

        if (alive) {
          const normalized = source
            .slice(0, 8)
            .map((promo, index) => normalisePromo(promo, index, supabase))
            .filter((promo) => promo.imageCandidates.length > 0);

          setPromos(normalized.length > 0 ? normalized.slice(0, 6) : fallbackPromos.map((promo, index) => normalisePromo(promo, index)));
          setActiveIndex(0);
          setImageIndexes({});
        }
      } catch (error) {
        console.error("HeroStack promo-upload-only load error:", error);

        const source =
          activeAds && activeAds.length > 0
            ? activeAds.filter(isNotReelOrSystemRow)
            : sampleAds && sampleAds.length > 0
              ? sampleAds.filter(isNotReelOrSystemRow)
              : fallbackPromos;

        if (alive) {
          const normalized = source
            .slice(0, 8)
            .map((promo, index) => normalisePromo(promo, index))
            .filter((promo) => promo.imageCandidates.length > 0);

          setPromos(normalized.length > 0 ? normalized.slice(0, 6) : fallbackPromos.map((promo, index) => normalisePromo(promo, index)));
          setActiveIndex(0);
          setImageIndexes({});
        }
      }
    }

    loadPromos();

    return () => {
      alive = false;
    };
  }, []);

  const safePromos = useMemo(() => {
    const list =
      promos && promos.length > 0
        ? promos
        : fallbackPromos.map((promo, index) => normalisePromo(promo, index));

    return list.slice(0, 6);
  }, [promos]);

  const activePromo =
    safePromos[activeIndex] ||
    safePromos[0] ||
    normalisePromo(fallbackPromos[0]);

  const promoHref = `/ad/${encodeURIComponent(activePromo.slug)}`;
  const imageIndex = imageIndexes[activePromo.slug] || 0;
  const imageSrc =
    activePromo.imageCandidates?.[imageIndex] ||
    activePromo.imageCandidates?.[0] ||
    HERO_FINAL_PLACEHOLDER;

  useEffect(() => {
    if (safePromos.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safePromos.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [safePromos.length]);

  function goPrevious() {
    setActiveIndex((current) =>
      current === 0 ? safePromos.length - 1 : current - 1
    );
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % safePromos.length);
  }

  function tryNextImage() {
    setImageIndexes((current) => {
      const currentIndex = current[activePromo.slug] || 0;
      const maxIndex = Math.max((activePromo.imageCandidates?.length || 1) - 1, 0);
      const nextIndex = Math.min(currentIndex + 1, maxIndex);

      return {
        ...current,
        [activePromo.slug]: nextIndex,
      };
    });
  }

  return (
    <div className={styles.carousel} aria-label="Featured promos">
      <div className={styles.frame}>
        <Link className={styles.slide} href={promoHref}>
          <div className={styles.featureBadge}>★ Featured promo</div>

          <div className={styles.imageStage}>
            <img
              className={styles.image}
              src={imageSrc}
              alt={activePromo.title}
              onError={tryNextImage}
            />
          </div>

          <div className={styles.overlay}>
            <span className={styles.category}>{activePromo.category}</span>
            <h3 title={activePromo.title}>{activePromo.title}</h3>
            <p>
              {activePromo.date} · {activePromo.location}
            </p>
            <span className={styles.cta}>View Promo</span>
          </div>
        </Link>
      </div>

      {safePromos.length > 1 ? (
        <>
          <button
            className={`${styles.navButton} ${styles.prev}`}
            type="button"
            aria-label="Previous featured promo"
            onClick={goPrevious}
          >
            ‹
          </button>

          <button
            className={`${styles.navButton} ${styles.next}`}
            type="button"
            aria-label="Next featured promo"
            onClick={goNext}
          >
            ›
          </button>

          <div className={styles.dots} aria-label="Featured promo slides">
            {safePromos.map((promo, index) => (
              <button
                key={promo?.id || promo?.slug || index}
                type="button"
                aria-label={`Show featured promo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
                className={index === activeIndex ? styles.activeDot : styles.dot}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
