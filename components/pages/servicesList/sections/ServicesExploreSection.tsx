"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { SAMPLE_EXPLORE_POSTS } from "../servicesSampleData";
import { useGetInfinitePosts, useGetReels } from "@/hooks/usePosts";
import { Visibility, Posts } from "@/services/post/postInterfaces";

interface ServicesExploreSectionProps {
  categoryName?: string;
  cityName?: string;
}

export const ServicesExploreSection: React.FC<ServicesExploreSectionProps> = ({
  categoryName = "electricians",
  cityName = "Jaipur",
}) => {
  const { data: postsData } = useGetInfinitePosts({ limit: 6, visibility: Visibility.PUBLIC });
  const { data: reelsData } = useGetReels();

  const exploreItems = useMemo(() => {
    const liveItems: Array<{
      id: string;
      title: string;
      author: string;
      badge: string;
      image: string;
      isReel: boolean;
      link: string;
    }> = [];

    // Check live reels
    const reels: Posts[] = (reelsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls);
    reels.slice(0, 2).forEach((r) => {
      const uName =
        r.user?.business_name ||
        [r.user?.first_name, r.user?.last_name].filter(Boolean).join(" ") ||
        "Verified Pro";
      let img = "";
      if (Array.isArray(r.media_urls) && r.media_urls.length > 0) {
        img =
          typeof r.media_urls[0] === "string"
            ? r.media_urls[0]
            : (r.media_urls[0] as { url?: string })?.url || "";
      } else if (typeof r.media_urls === "string") {
        img = r.media_urls;
      }
      if (img) {
        liveItems.push({
          id: r.id || `reel-${Math.random()}`,
          title: r.caption || "Recent project demonstration",
          author: uName,
          badge: "Reel",
          image: img,
          isReel: true,
          link: "/cus/reels",
        });
      }
    });

    // Check live posts
    const posts: Posts[] = (postsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls);
    posts.slice(0, 4 - liveItems.length).forEach((p) => {
      const uName =
        p.user?.business_name ||
        [p.user?.first_name, p.user?.last_name].filter(Boolean).join(" ") ||
        "Local Pro";
      let img = "";
      if (Array.isArray(p.media_urls) && p.media_urls.length > 0) {
        img =
          typeof p.media_urls[0] === "string"
            ? p.media_urls[0]
            : (p.media_urls[0] as { url?: string })?.url || "";
      } else if (typeof p.media_urls === "string") {
        img = p.media_urls;
      }
      if (img) {
        liveItems.push({
          id: p.id || `post-${Math.random()}`,
          title: p.caption || "Completed client installation",
          author: uName,
          badge: p.user?.business_name ? "Business post" : "Customer post",
          image: img,
          isReel: p.post_type === "video",
          link: "/cus/reels",
        });
      }
    });

    // Fallback if live items are empty or fewer than 4
    if (liveItems.length < 4) {
      const needed = 4 - liveItems.length;
      return [...liveItems, ...SAMPLE_EXPLORE_POSTS.slice(0, needed)];
    }

    return liveItems.slice(0, 4);
  }, [postsData, reelsData]);

  return (
    <section className="mt-14 mb-8 pt-10 border-t border-gray-200" aria-label="Recent work from explore">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
            <span>From Explore</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Recent work by {categoryName} near you
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real photos and reels shared by verified service providers and customers{" "}
            {cityName ? `in ${cityName}` : ""}.
          </p>
        </div>

        <Link
          href="/cus/reels"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors shrink-0 group"
        >
          <span>Explore all reels & posts</span>
          <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exploreItems.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer block"
          >
            {/* Image / Thumbnail Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                priority={false}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                    item.badge === "Reel"
                      ? "bg-red-500/90 text-white"
                      : item.badge === "Customer post"
                      ? "bg-amber-500/90 text-white"
                      : "bg-white/90 text-gray-800"
                  }`}
                >
                  {item.badge === "Reel" ? (
                    <PlayArrowRoundedIcon sx={{ fontSize: 14 }} />
                  ) : item.badge === "Customer post" ? (
                    <VerifiedUserRoundedIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <CheckCircleRoundedIcon sx={{ fontSize: 14 }} className="text-purple-600" />
                  )}
                  {item.badge}
                </span>
              </div>

              {/* Center Play Button on Hover if Reel */}
              {item.isReel && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <PlayArrowRoundedIcon sx={{ fontSize: 24 }} className="text-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 text-white">
                <p className="text-sm font-semibold leading-snug line-clamp-2 drop-shadow-xs">
                  {item.title}
                </p>
                <p className="text-xs text-gray-200 mt-1 line-clamp-1 font-normal opacity-90">
                  {item.author}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
