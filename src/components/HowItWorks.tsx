import { Search, Bot, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore thousands of curated opportunities including scholarships, internships, and fellowships from around the world.",
  },
  {
    icon: Bot,
    title: "AI-Powered Matching",
    description:
      "Our intelligent AI agent analyzes your profile, interests, and goals to recommend the most relevant opportunities for you.",
  },
  {
    icon: Target,
    title: "Apply with Confidence",
    description:
      "Get detailed application guidance, deadlines, and requirements. Our AI helps you craft compelling applications.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Future",
    description:
      "Track your applications, celebrate successes, and continue discovering new opportunities as you advance in your career.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to unlock your potential and discover
            life-changing opportunities
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary-glow opacity-30 z-0"
                    style={{ width: "calc(100% - 3rem)" }}
                  />
                )}

                <div className="relative z-10 text-center group">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow group-hover:animate-glow transition-all duration-300">
                    <IconComponent className="h-10 w-10 !text-primary-glow" />
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-glow rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to start your journey? It only takes a few minutes to get
            personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const chatWidget = document.getElementById("chat-widget");
                if (chatWidget) {
                  chatWidget.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-glow transition-all duration-300"
            >
              Start with AI Agent
            </button>
            <button
              onClick={() => {
                const section = document.getElementById(
                  "featured-opportunities"
                );
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300"
            >
              Browse Opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
