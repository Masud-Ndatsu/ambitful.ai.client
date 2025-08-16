import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Search } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const scrollToOpportunities = () => {
    const section = document.getElementById("featured-opportunities");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToChat = () => {
    const chatWidget = document.getElementById("chat-widget");
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Young people discovering opportunities with AI"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary-glow/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Let’s make your dream a reality.
            <span className="block bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">
              Starting now
            </span>
          </h1>

          {/* <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unlock life-changing opportunities with the power of AI. From scholarships to internships, 
            we help young people like you find the perfect path to success.
          </p> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={scrollToOpportunities}
              className="bg-white text-primary hover:bg-white/90 hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={scrollToChat}
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-lg px-8 py-6"
            >
              <Bot className="mr-2 h-5 w-5" />
              Talk to AI Agent
            </Button>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-white/80">Opportunities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-white/80">Students Helped</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">AI-Powered</div>
              <div className="text-white/80">Matching</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
