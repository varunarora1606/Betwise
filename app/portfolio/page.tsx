"use client";

import dynamic from "next/dynamic";

// Dynamically import the Trading component with SSR disabled
const Portfolio = dynamic(() => import("@/components/portfolio/Portfolio"), {
  ssr: false,
});

export default function Page() {
  return <Portfolio />;
}
