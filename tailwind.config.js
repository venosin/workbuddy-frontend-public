/** @type {import('tailwindcss').Config} */
import animatePlugin from "tailwindcss-animate"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#B7A18B", 
          foreground: "#4A403A", 
        },
        contrast: "#4A403A", 
        accent: "#8C705F", 
        secondary: {
          DEFAULT: "#D8C3A5", 
          foreground: "#4A403A", 
        },
        additional: "#6E9075", 
        
        brown: {
          100: "#F5F0EB",
          200: "#E6DFD8",
          300: "#D8CEC5",
          400: "#C9BDB2",
          500: "#B7A18B", 
          600: "#A69078",
          700: "#8C705F", 
          800: "#4A403A", 
          900: "#2D2621",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Bodoni Moda", "serif"],
        body: ["Cormorant", "serif"],
        display: ["Bodoni Moda", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "text-reveal": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "text-gradient": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "0% 50%",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "100% 50%",
          },
        },
        "split-reveal": {
          "0%": { 
            transform: "translateY(100%)", 
            opacity: 0, 
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" 
          },
          "100%": { 
            transform: "translateY(0)", 
            opacity: 1, 
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
          },
        },
        "char-slide": {
          "0%": { 
            transform: "translateY(100%)", 
            opacity: 0,
          },
          "100%": { 
            transform: "translateY(0)", 
            opacity: 1,
          },
        },
        "letter-wave": {
          "0%, 100%": {
            transform: "translateY(0px)"
          },
          "25%": {
            transform: "translateY(-10px)"
          },
          "50%": {
            transform: "translateY(0px)"
          },
          "75%": {
            transform: "translateY(10px)"
          }
        },
        "stroke-fill": {
          "0%": {
            "fill-opacity": 0,
            "stroke-dashoffset": 400
          },
          "30%": {
            "fill-opacity": 0,
            "stroke-dashoffset": 0
          },
          "60%, 100%": {
            "fill-opacity": 1,
            "stroke-dashoffset": 0
          }
        },
        "rotate3d": {
          "0%": {
            transform: "perspective(1000px) rotateY(0deg)"
          },
          "50%": {
            transform: "perspective(1000px) rotateY(15deg)"
          },
          "100%": {
            transform: "perspective(1000px) rotateY(0deg)"
          }
        },
        "background-shine": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "text-reveal": "text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "text-gradient": "text-gradient 1.5s ease infinite",
        "split-reveal": "split-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "char-slide": "char-slide 0.35s cubic-bezier(.3,0,.7,1) forwards",
        "letter-wave": "letter-wave 1.2s ease-in-out infinite",
        "stroke-fill": "stroke-fill 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "3d-rotate": "rotate3d 3s ease-in-out infinite",
        "background-shine": "background-shine 2s linear infinite",
      },
    },
  },
  plugins: [animatePlugin],
}
