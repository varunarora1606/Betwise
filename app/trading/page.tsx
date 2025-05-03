import dynamic from "next/dynamic";

// Dynamically import the Trading component with SSR disabled
const Trading = dynamic(() => import("@/components/trading/Trading"), {
  ssr: false,
});

export default function Page() {
  return <Trading />;
}
