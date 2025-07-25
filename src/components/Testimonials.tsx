import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  opportunity: string;
  quote: string;
  rating: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 22,
    location: "Singapore",
    opportunity: "Google Summer of Code",
    quote: "The AI agent helped me find the perfect open source project that matched my skills. I got accepted into GSoC and it completely changed my career trajectory!",
    rating: 5,
    initials: "SC"
  },
  {
    id: "2",
    name: "Marcus Johnson",
    age: 19,
    location: "Chicago, USA",
    opportunity: "Gates Millennium Scholarship",
    quote: "I never thought I could afford college until OpportunityAI showed me scholarships I never knew existed. Now I'm studying at MIT with full funding!",
    rating: 5,
    initials: "MJ"
  },
  {
    id: "3",
    name: "Priya Patel",
    age: 21,
    location: "Mumbai, India",
    opportunity: "Fulbright Research Fellowship",
    quote: "The platform's AI understood my research interests better than I did! It suggested the Fulbright program which led to my current PhD at Stanford.",
    rating: 5,
    initials: "PP"
  },
  {
    id: "4",
    name: "Alex Rivera",
    age: 20,
    location: "Mexico City, Mexico",
    opportunity: "UN Youth Climate Summit",
    quote: "Thanks to OpportunityAI, I represented my country at the UN Climate Summit. The experience opened doors I never imagined possible.",
    rating: 5,
    initials: "AR"
  },
  {
    id: "5",
    name: "Fatima Al-Zahra",
    age: 23,
    location: "Cairo, Egypt",
    opportunity: "Rhodes Scholarship",
    quote: "The AI helped me craft my application essays and prepare for interviews. Now I'm studying at Oxford with the most prestigious scholarship in the world!",
    rating: 5,
    initials: "FA"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Real stories from young people who transformed their lives through opportunities discovered on our platform
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="relative bg-white/10 backdrop-blur-sm border border-white/20 shadow-glow">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-12 w-12 text-white/50 mb-6" />
              
              <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                "{currentTestimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white/30">
                    <AvatarFallback className="bg-primary text-white font-bold text-lg">
                      {currentTestimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="text-white font-semibold text-lg">
                      {currentTestimonial.name}, {currentTestimonial.age}
                    </div>
                    <div className="text-white/80">
                      {currentTestimonial.location}
                    </div>
                    <div className="text-primary-glow font-medium">
                      {currentTestimonial.opportunity}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(currentTestimonial.rating)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center space-x-2 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-white/80">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">$2.3M+</div>
            <div className="text-white/80">Total Awards Won</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">127</div>
            <div className="text-white/80">Countries Reached</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;