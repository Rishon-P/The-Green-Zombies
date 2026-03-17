import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import PipelineSection from "@/components/PipelineSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import DashboardSection from "@/components/DashboardSection";
import ChartsSection from "@/components/ChartsSection";
import BlockchainSection from "@/components/BlockchainSection";
import CodeShowcase from "@/components/CodeShowcase";
import TerminalDemo from "@/components/TerminalDemo";
import TechStackSection from "@/components/TechStackSection";
import ComparisonSection from "@/components/ComparisonSection";
import ImpactSection from "@/components/ImpactSection";
import TimelineSection from "@/components/TimelineSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <PipelineSection />
      <FeaturesGrid />
      <DashboardSection />
      <ChartsSection />
      <BlockchainSection />
      <CodeShowcase />
      <TerminalDemo />
      <TechStackSection />
      <ComparisonSection />
      <ImpactSection />
      <TimelineSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Index;
