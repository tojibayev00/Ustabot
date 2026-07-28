/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Telegram Theme Params bilan sinxron — theme/telegramTheme.ts orqali
        // CSS custom propertylarga yoziladi (Part 8: "Never hardcode colors")
        bg: "var(--tg-bg-color)",
        "secondary-bg": "var(--tg-secondary-bg-color)",
        text: "var(--tg-text-color)",
        hint: "var(--tg-hint-color)",
        link: "var(--tg-link-color)",
        button: "var(--tg-button-color)",
        "button-text": "var(--tg-button-text-color)",
        "header-bg": "var(--tg-header-bg-color)",
        accent: "var(--tg-accent-text-color)",
        "section-bg": "var(--tg-section-bg-color)",
        "section-header": "var(--tg-section-header-text-color)",
        subtitle: "var(--tg-subtitle-text-color)",
        destructive: "var(--tg-destructive-text-color)",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6"
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px"
      },
      spacing: {
        4.5: "18px"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Inter",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "soft-md": "0 4px 16px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 24px rgba(0, 0, 0, 0.10)"
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 250ms ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
