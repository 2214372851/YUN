import {CallToAction} from "@/components/call-to-action";
import {FeaturesSection} from "@/components/features-section";
import {Hero} from "@/components/hero";
import {Carwlsy} from "@/components/carwlsy";
import {D0Tools} from "@/components/d0-tools";
import {TechStack} from "@/components/tech-stack";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <Hero/>
            <FeaturesSection/>
            <TechStack/>
            <D0Tools/>
            <Carwlsy/>
            <CallToAction/>
        </main>
    );
}
