import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com'),
    title: {
        default: "kartsquare Portal",
        template: "%s | kartsquare"
    },
    description: "Enterprise Web Portal for Products and Services",
    openGraph: {
        title: "kartsquare Portal",
        description: "Enterprise Web Portal for Products and Services",
        siteName: "kartsquare",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{ fontFamily: "'Poppins', system-ui, -apple-system, sans-serif" }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
