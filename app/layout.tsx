import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "kartsquare Portal",
    description: "Enterprise Web Portal",
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
