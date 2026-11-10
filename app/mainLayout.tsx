import React from "react";
import MainLayoutClient from "./MainLayoutClient";

interface MainLayoutProps {
  children: React.ReactNode;
  /** Start the page right under the header, without the 16px gap (e.g. the feed on phones). */
  flushTop?: boolean;
}

export default function MainLayout({ children, flushTop }: MainLayoutProps) {
  return <MainLayoutClient flushTop={flushTop}>{children}</MainLayoutClient>;
}
