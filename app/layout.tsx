import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "RXALIENS",
  description: "CS2 Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
