// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext"; // adjust path if needed
import Navigation from "@/components/Navigation";
import "./styles/globals.css"; // Import global styles
import localFont from "next/font/local";

const roboto = localFont({
  src: [
    {
      path: "./fonts/roboto/Roboto-VariableFont_wdth,wght.ttf", // ✅ Corrected path
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-Italic-VariableFont_wdth,wght.ttf", // ✅ Corrected path
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${roboto.variable} font-sans`}>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <Navigation />
          <Component {...pageProps} />
        </CartProvider>
      </SessionProvider>
    </div>
  );
}