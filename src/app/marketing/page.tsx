import { HeroHeaderSection } from "../_components/HeroHeaderSection";
import { MediaPartnersSection } from "../_components/MediaPartnersSection";
import { StickyVideoSteps } from "../_components/StickyVideoSteps";
import { AgentDirectoryTabs } from "../_components/AgentDirectoryTabs";
import { SuperbuiltEffectSection } from "../_components/SuperbuiltEffectSection";
import { PricingSection } from "../_components/PricingSection";
import { ResearchMarqueeSection } from "../_components/ResearchMarqueeSection";
import { FooterSection } from "../_components/FooterSection";

export default function MarketingPage() {
  return (
    <main className=" bg-black">
      <HeroHeaderSection />
      <MediaPartnersSection />
      <StickyVideoSteps />
      <AgentDirectoryTabs />
      <SuperbuiltEffectSection />
      <PricingSection />
      <ResearchMarqueeSection />
      <FooterSection />
    </main>
  );
}
