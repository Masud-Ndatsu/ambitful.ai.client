// Environment configuration for Vite React app
export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",

  // Environment
  NODE_ENV:
    import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || "development",

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Destinn",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // External Services
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || "",
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || "",

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT !== "false", // default true
  ENABLE_TESTIMONIALS: import.meta.env.VITE_ENABLE_TESTIMONIALS !== "false", // default true

  // Social Auth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || "",

  // Development
  DEBUG: import.meta.env.VITE_DEBUG === "true",
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === "true",

  // Computed values
  get isDevelopment() {
    return this.NODE_ENV === "development";
  },

  get isProduction() {
    return this.NODE_ENV === "production";
  },

  get isTest() {
    return this.NODE_ENV === "test";
  },
};

// Type-safe environment validation
export const validateEnv = () => {
  const requiredVars = ["API_URL", "API_BASE_URL"];
  const missing = requiredVars.filter((key) => !env[key as keyof typeof env]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate URLs
  try {
    new URL(env.API_URL);
    new URL(env.API_BASE_URL);
  } catch (error) {
    throw new Error("Invalid URL format in environment variables");
  }
};

// Initialize environment validation in development
if (env.isDevelopment) {
  try {
    validateEnv();
    console.log("✅ Environment variables validated successfully");
  } catch (error) {
    console.error("❌ Environment validation failed:", error);
  }
}
