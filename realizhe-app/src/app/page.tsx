import { HomeHero } from "@/components/home/HomeHero";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeHighlights />
      <HomeShowcase />
      <HomeCTA />
    </>
  );
}
