// app/(customer)/products/[slug]/page.jsx
import Footer from "@/components/customer/Footer";
import PreFooter from "@/components/customer/PreFooter";
import ProductDetail from "@/components/customer/ProductDetail";

export default function ProductPage() {
  return (
    <>
      <ProductDetail />
      <PreFooter />
      <Footer />
    </>
  );
}