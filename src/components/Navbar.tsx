import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in real app

  const scrollToChat = () => {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                OpportunityAI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-smooth">
                Home
              </a>
              <a href="/opportunities" className="text-foreground hover:text-primary transition-smooth">
                Opportunities
              </a>
              <a href="#categories" className="text-foreground hover:text-primary transition-smooth">
                Categories
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-smooth">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
                Contact
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={scrollToChat}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get Career Advice
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={scrollToChat}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get Career Advice
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              <a href="#home" className="block px-3 py-2 text-foreground hover:text-primary transition-smooth">
                Home
              </a>
              <a href="/opportunities" className="block px-3 py-2 text-foreground hover:text-primary transition-smooth">
                Opportunities
              </a>
              <a href="#categories" className="block px-3 py-2 text-foreground hover:text-primary transition-smooth">
                Categories
              </a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary transition-smooth">
                About
              </a>
              <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary transition-smooth">
                Contact
              </a>
              
              <div className="pt-4 pb-3 border-t border-border">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={scrollToChat}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Get Career Advice
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={scrollToChat}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Get Career Advice
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;