import Layout from "../components/Layout";
import { 
  Hero, 
  AudiencePathways, 
  DecisionEngineSection, 
  FeaturedGuides, 
  TopPicks,
  BrandStory, 
  B2BSection, 
  EmailCapture 
} from "../components/Home/HomeSections";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <AudiencePathways />
      <DecisionEngineSection />
      <FeaturedGuides />
      <TopPicks />
      <BrandStory />
      <B2BSection />
      <EmailCapture />
    </Layout>
  );
}
