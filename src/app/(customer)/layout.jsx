import "../globals.css";
import Navbar from "@/components/customer/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <>
        <Navbar />
        {children}
      </>
    </html>
  );
}
