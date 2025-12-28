import "../styles/globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
import { CustomerAuthProvider } from "../contexts/CustomerAuthContext";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body"
});

export const metadata = {
  title: "Rupantorii | Bengali Jewelry & Lifestyle",
  description: "Local-first e-commerce platform for Rupantorii jewelry and lifestyle collections.",
  icons: {
    icon: "/logo.png"
  },
  openGraph: {
    title: "Rupantorii | Bengali Jewelry & Lifestyle",
    description: "Local-first e-commerce platform for Rupantorii jewelry and lifestyle collections.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Rupantorii"
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <Header />
              <main className="min-h-[70vh]">{children}</main>
              <Footer />
            </CartProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
