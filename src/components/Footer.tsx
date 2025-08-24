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
        {/* Brand & Social Media */}
        <div className="text-center mb-12">
          <div className="flex justify-center space-x-4">
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

        <Separator className="bg-background/20 mb-8" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 mb-8">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-muted">support@ambitful.ai</span>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-3">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-muted">+1 (555) 123-4567</span>
          </div>
        </div>

        <Separator className="bg-background/20 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-muted text-sm mb-4 md:mb-0">
            © 2024 AmbitfulAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
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
