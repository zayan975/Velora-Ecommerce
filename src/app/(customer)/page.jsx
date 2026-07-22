// app/(customer)/page.jsx
import Hero from "@/components/customer/Hero";
import ProductGrid from "@/components/customer/ProductGrid";
import VideoHero from "@/components/customer/VideoHero";
import MenArrival from "@/components/customer/MenArrival"
import WomenArrival from "@/components/customer/WomenArrival"
import PreFooter from "@/components/customer/PreFooter";
import Footer from "@/components/customer/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <VideoHero />
      <MenArrival />
      <WomenArrival />
      <PreFooter />
      <Footer />
    </>
  );
}