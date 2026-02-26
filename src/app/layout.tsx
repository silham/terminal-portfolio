import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { MouseVisibilityController } from "@/components/MouseVisibilityController";
import "./globals.css";

// Load JetBrains Mono and expose it as a CSS variable used in globals.css
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "terminal-portfolio",
  description: "Terminal-styled personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        {/* Attaches global mouse-cursor hide/show behaviour */}
        <MouseVisibilityController />
        {children}
      </body>
    </html>
  );
}
