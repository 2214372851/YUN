import { CallToAction } from "@/components/call-to-action";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Carwlsy } from "@/components/carwlsy";
import { Navbar } from "@/components/navbar";
import { D0Tools } from "@/components/d0-tools";
import {TechStack} from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <TechStack />
      <D0Tools />
      <Carwlsy />
      <CallToAction />
      <Footer />
    </main>
  );
}
