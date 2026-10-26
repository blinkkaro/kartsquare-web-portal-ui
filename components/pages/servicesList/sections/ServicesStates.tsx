"use client";

import React from "react";
import Link from "next/link";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { RELATED_CATEGORIES_FOR_EMPTY } from "../servicesSampleData";

interface ServicesLoadingSkeletonProps {
  count?: number;
}

export const ServicesLoadingSkeleton: React.FC<ServicesLoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full" aria-label="Loading services" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse"
        >
          <div className="flex flex-col md:flex-row gap-5">
            {/* Avatar & cover placeholder */}
            <div className="w-full md:w-44 h-36 bg-gray-200 rounded-xl shrink-0" />

            {/* Info placeholder */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="h-3.5 w-60 bg-gray-100 rounded" />
              <div className="h-3.5 w-full max-w-md bg-gray-100 rounded" />

              {/* Sub services tags */}
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-24 bg-gray-100 rounded-full" />
                <div className="h-6 w-28 bg-gray-100 rounded-full" />
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>

              {/* Recent works thumbnail skeleton */}
              <div className="flex gap-2 pt-2">
                <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                <div className="h-12 w-12 bg-gray-200 rounded-lg" />
              </div>
            </div>

            {/* Price & action placeholder */}
            <div className="w-full md:w-48 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-6 w-28 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2 pt-3">
                <div className="h-10 w-full bg-gray-200 rounded-xl" />
                <div className="h-8 w-full bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ServicesEmptyStateProps {
  categoryName?: string;
  cityName?: string;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const ServicesEmptyState: React.FC<ServicesEmptyStateProps> = ({
  categoryName = "electricians",
  cityName = "Jaipur",
  onResetFilters,
  hasActiveFilters = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-8 md:p-12 text-center shadow-xs">
      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
        <SearchOffRoundedIcon sx={{ fontSize: 32 }} />
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
        No {categoryName} found {cityName ? `in ${cityName}` : ""} matching your filters
      </h3>

      <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto mt-2 leading-relaxed">
        {hasActiveFilters
          ? "Try clearing some filters, widening your rating range, or expanding your search to all nearby localities."
          : `We couldn't find active verified ${categoryName} in this area right now. Browse related services or explore all categories.`}
      </p>

      {hasActiveFilters && onResetFilters && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshRoundedIcon sx={{ fontSize: 18 }} />
            Reset all filters
          </button>
        </div>
      )}

      {/* Related categories */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Popular related categories {cityName ? `in ${cityName}` : ""}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {RELATED_CATEGORIES_FOR_EMPTY.map((cat) => (
            <Link
              key={cat.name}
              href={cat.path}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs md:text-sm font-medium text-gray-700 rounded-full transition-colors"
            >
              <span>{cat.name}</span>
              <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Merchant / Provider Callout */}
      <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 18 }} className="text-purple-600" />
            Run a business or provide services here?
          </h4>
          <p className="text-xs text-gray-600 mt-0.5">
            List your business on Kartsquare for free and start receiving verified customer leads today.
          </p>
        </div>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs shrink-0 transition-colors"
        >
          <span>List your business</span>
          <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
        </Link>
      </div>
    </div>
  );
};

interface ServicesErrorStateProps {
  categoryName?: string;
  cityName?: string;
  onRetry?: () => void;
}

export const ServicesErrorState: React.FC<ServicesErrorStateProps> = ({
  categoryName = "services",
  cityName = "Jaipur",
  onRetry,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-8 md:p-12 text-center shadow-xs">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
        <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
        Couldn&apos;t load {categoryName} {cityName ? `in ${cityName}` : ""}
      </h3>

      <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
        Something went wrong while connecting to our servers. Your connection might be unstable, or our team is updating services.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RefreshRoundedIcon sx={{ fontSize: 18 }} />
            Try again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition-colors"
        >
          Browse all categories
        </Link>
      </div>
    </div>
  );
};
