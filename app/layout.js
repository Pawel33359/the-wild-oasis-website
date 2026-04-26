import { Josefin_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import Header from "@/app/_components/Header";
import { ReservationProvider } from "./_components/ReservatnContext";

const josephin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  // title: "The Wild Oasiss",
  description:
    "The Wild Oasis is a cozy and charming cabin rental business located in the heart of nature. We offer a variety of cabins for rent, each with its own unique charm and character. Our cabins are nestled in a serene and picturesque setting, surrounded by lush greenery and breathtaking views. Whether you're looking for a romantic getaway, a family vacation, or a peaceful retreat, The Wild Oasis has the perfect cabin for you. Our cabins are equipped with modern amenities and provide a comfortable and relaxing atmosphere for our guests. Come and experience the beauty of nature while enjoying the comfort of our cozy cabins at The Wild Oasis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josephin.className} antialiased bg-primary-950 text-primary-100  min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
