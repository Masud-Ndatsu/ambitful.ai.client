import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedOpportunities />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
