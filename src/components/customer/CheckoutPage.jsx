"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// TEMP dummy data — API integration sabse last mein hoga
// (checkout summary API se aayega: subtotal, shipping, discount, tax, total)
const CART_ITEMS = [
  {
    id: "1",
    name: "Kerned Confidence",
    price: 25,
    quantity: 1,
    size: "M",
    image: "/assets/images/Men2-2.webp",
  },
  {
    id: "2",
    name: "Off by Design",
    price: 36.5,
    quantity: 2,
    size: "L",
    image: "/assets/images/Men1.1.webp",
  },
];

const SHIPPING_FLAT_RATE = 10;

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;
  const discount = 0;
  const tax = 0;
  const total = subtotal + shipping - discount + tax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setPlacing(true);
    // API integration baad mein: POST /api/orders { shippingAddress: form, paymentMethod }
    console.log("Place order:", { form, paymentMethod, total });
    setTimeout(() => setPlacing(false), 800);
  };

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-14">
      <h1 className="font-outfit text-3xl md:text-4xl text-[#d9d0ca] mb-10">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">
        {/* Left — shipping form + payment */}
        <form onSubmit={handlePlaceOrder}>
          <span className="text-xs tracking-[0.15em] uppercase text-[#d9d0ca] block mb-5">
            Shipping address
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Field label="Full name" full>
              <input
                type="text"
                placeholder="Olivia Carter"
                value={form.fullName}
                onChange={update("fullName")}
                required
                className="w-full py-2.5 bg-transparent border-b border-[#d9d0ca] text-[15px] text-[#d9d0ca] placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
              />
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                placeholder="03001234567"
                value={form.phone}
                onChange={update("phone")}
                required
                className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
              />
            </Field>

            <Field label="City">
              <input
                type="text"
                placeholder="Lahore"
                value={form.city}
                onChange={update("city")}
                required
                className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
              />
            </Field>

            <Field label="Address" full>
              <input
                type="text"
                placeholder="Street 12, Model Town"
                value={form.addressLine}
                onChange={update("addressLine")}
                required
                className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
              />
            </Field>

            <Field label="Postal code (optional)">
              <input
                type="text"
                placeholder="54000"
                value={form.postalCode}
                onChange={update("postalCode")}
                className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
              />
            </Field>
          </div>

          <div className="h-px bg-ink/10 my-8" />

          <span className="text-xs tracking-[0.15em] uppercase text-ink block mb-5">
            Payment method
          </span>

          <div className="flex flex-col gap-3">
            <PaymentOption
              id="cod"
              label="Cash on delivery"
              description="Pay with cash when your order arrives"
              selected={paymentMethod === "cod"}
              onSelect={() => setPaymentMethod("cod")}
            />
            <PaymentOption
              id="stripe"
              label="Card"
              description="Pay securely with Visa, Mastercard, or Amex"
              selected={paymentMethod === "stripe"}
              onSelect={() => setPaymentMethod("stripe")}
            />
          </div>

          <button
            type="submit"
            disabled={placing}
            className="mt-10 w-full lg:hidden py-4 bg-ink text-bone text-[13px] tracking-[0.1em] uppercase hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Right — order summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <span className="text-xs tracking-[0.15em] uppercase text-ink block mb-5">
            Order summary
          </span>

          <div className="flex flex-col gap-4">
            {CART_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="relative w-16 h-20 flex-none bg-ink/5 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-bone text-[10px] flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{item.name}</p>
                  <p className="text-xs text-taupe">Size {item.size}</p>
                </div>
                <span className="text-sm text-ink whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="h-px bg-ink/10 my-6" />

          <div className="flex flex-col gap-2.5 text-sm">
            <Row label="Subtotal" value={subtotal} />
            <Row label="Shipping" value={shipping} />
            <Row label="Discount" value={-discount} />
            <Row label="Tax" value={tax} />
          </div>

          <div className="h-px bg-ink/10 my-4" />

          <div className="flex items-center justify-between text-ink">
            <span className="text-base font-medium">Total</span>
            <span className="text-base font-medium">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="hidden lg:block mt-8 w-full py-4 bg-ink text-bone text-[13px] tracking-[0.1em] uppercase hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place order — $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={`mb-5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="block text-[11px] tracking-[0.1em] uppercase text-taupe mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function PaymentOption({ id, label, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-start gap-3 text-left border px-4 py-3.5 transition-colors ${
        selected ? "border-ink bg-ink/[0.03]" : "border-ink/10 hover:border-ink/30"
      }`}
    >
      <span
        className={`mt-0.5 w-4 h-4 rounded-full border flex-none flex items-center justify-center ${
          selected ? "border-ink" : "border-ink/30"
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-ink" />}
      </span>
      <span>
        <span className="block text-sm text-ink">{label}</span>
        <span className="block text-xs text-taupe mt-0.5">{description}</span>
      </span>
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-taupe">
      <span>{label}</span>
      <span>{value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}</span>
    </div>
  );
}