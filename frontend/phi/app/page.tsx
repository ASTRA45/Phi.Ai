import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { UseCases } from "@/components/sections/UseCases";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Features />
      <Architecture />
      <UseCases />
      <CTA />
    </main>
  );
}
