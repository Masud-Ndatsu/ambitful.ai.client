import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Grid3x3,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/use-auth";
import { UI_CATEGORIES } from "@/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToChat = () => {
    const chatWidget = document.getElementById("chat-widget");
    if (chatWidget) {
      chatWidget.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
                AmbitfulAI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-foreground hover:text-primary transition-smooth ${
                    isActive ? "text-primary font-medium" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/opportunities"
                className={({ isActive }) =>
                  `text-foreground hover:text-primary transition-smooth ${
                    isActive ? "text-primary font-medium" : ""
                  }`
                }
              >
                Opportunities
              </NavLink>
              <DropdownMenu
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-primary transition-smooth"
                  >
                    Categories
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[600px] max-h-[400px] overflow-y-auto"
                >
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    Browse by Category
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {UI_CATEGORIES.map((category) => (
                      <DropdownMenuItem
                        key={category.value}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          navigate(
                            `/opportunities?category=${encodeURIComponent(
                              category.value
                            )}`
                          );
                          setIsCategoriesOpen(false);
                        }}
                      >
                        {category.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer font-medium"
                    onClick={() => {
                      navigate("/opportunities");
                      setIsCategoriesOpen(false);
                    }}
                  >
                    View All Opportunities
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavLink
                to="/#about"
                className="text-foreground hover:text-primary transition-smooth"
              >
                About
              </NavLink>
              <a
                href="/#contact"
                className="text-foreground hover:text-primary transition-smooth"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {!user?.role || user.role !== "admin" ? (
                  <Button variant="outline" size="sm" onClick={scrollToChat}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Get Career Advice
                  </Button>
                ) : (
                  <NavLink to="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </NavLink>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profile?.avatar}
                          alt={user?.name || ""}
                        />
                        <AvatarFallback>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.role === "admin" ? "Administrator" : "User"}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button size="sm" onClick={scrollToChat}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get Career Advice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
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
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 text-foreground hover:text-primary transition-smooth ${
                    isActive ? "text-primary font-medium" : ""
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/opportunities"
                className={({ isActive }) =>
                  `block px-3 py-2 text-foreground hover:text-primary transition-smooth ${
                    isActive ? "text-primary font-medium" : ""
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Opportunities
              </NavLink>
              <a
                href="#categories"
                className="block px-3 py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </a>
              <NavLink
                to="/#about"
                className="block px-3 py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <a
                href="#contact"
                className="block px-3 py-2 text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              <div className="pt-4 pb-3 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={scrollToChat}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Get Career Advice
                    </Button>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profile?.avatar}
                          alt={user?.name || ""}
                        />
                        <AvatarFallback>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" onClick={scrollToChat}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Get Career Advice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Sign In
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
