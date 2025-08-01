import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                OpportunityAI
              </span>
            </div>
            <p className="text-muted mb-6 leading-relaxed">
              Empowering young people worldwide to discover life-changing
              opportunities through the power of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:text-background p-2"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:text-background p-2"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:text-background p-2"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:text-background p-2"
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-muted hover:text-background transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#opportunities"
                  className="text-muted hover:text-background transition-colors"
                >
                  Browse Opportunities
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="text-muted hover:text-background transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted hover:text-background transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-muted hover:text-background transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#help"
                  className="text-muted hover:text-background transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-muted hover:text-background transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-muted hover:text-background transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-muted hover:text-background transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#feedback"
                  className="text-muted hover:text-background transition-colors"
                >
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-muted mb-4">
              Get weekly updates on new opportunities and career advice.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-muted"
              />
              <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-background/20 mb-8" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-muted">support@opportunityai.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-muted">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-muted">San Francisco, CA</span>
          </div>
        </div>

        <Separator className="bg-background/20 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted text-sm">
            © 2024 OpportunityAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#accessibility"
              className="text-muted hover:text-background text-sm transition-colors"
            >
              Accessibility
            </a>
            <a
              href="#sitemap"
              className="text-muted hover:text-background text-sm transition-colors"
            >
              Sitemap
            </a>
            <a
              href="#cookies"
              className="text-muted hover:text-background text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
