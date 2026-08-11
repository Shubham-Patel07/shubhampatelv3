import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { Bento } from "@/components/home/bento";
import { WritingTeaser } from "@/components/home/writing-teaser";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Bento />
      <WritingTeaser />
      <CTA />
    </>
  );
}
