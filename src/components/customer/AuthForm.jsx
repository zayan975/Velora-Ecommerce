"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function AuthForm({ initialMode = "login" }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setStatus({ loading: false, error: "" });
    router.push(newMode === "login" ? "/login" : "/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Registration failed");

        setForm((f) => ({ ...f, password: "" }));
        setStatus({ loading: false, error: "" });
        switchMode("login");
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) throw new Error("Invalid email or password");

      setStatus({ loading: false, error: "" });
      router.push("/");
      router.refresh();
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Left editorial panel */}
     <div className="hidden md:flex flex-none w-[46%] relative flex-col justify-between p-12 overflow-hidden">
  {/* Background image */}
  <Image
    src="/assets/images/Men4.webp"
    alt=""
    fill
    priority
    className="object-cover"
  />
</div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12">
        <div className="w-full max-w-95">
          <span className="block mb-5 font-outfit text-6xl text-ink">Velora</span>

          <div className="flex gap-7 mb-8 border-b border-ink/10">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`relative pb-3 font-sans text-[17px] transition-colors ${
                  mode === m ? "text-ink" : "text-taupe hover:text-ink/70"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
                {mode === m && (
                  <motion.span
                    layoutId="auth-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-rose"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {mode === "register" && (
                <Field label="Full name">
                  <input
                    type="text"
                    placeholder="Olivia Carter"
                    value={form.name}
                    onChange={update("name")}
                    required
                    className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
                  />
                </Field>
              )}

              <Field label="Email">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                  required
                  className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={update("password")}
                  required
                  minLength={8}
                  className="w-full py-2.5 bg-transparent border-b border-ink/10 text-[15px] text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors"
                />
              </Field>

              {mode === "login" && (
                <div className="text-right mb-6">
                  <a href="/forgot-password" className="text-[13px] text-taupe hover:text-ink transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {status.error && (
                <p className="text-rose-deep text-[13px] -mt-2 mb-4">{status.error}</p>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className={`w-full py-3.5 bg-ink text-bone text-[13px] tracking-widest uppercase transition-opacity ${
                  mode === "register" ? "mt-2" : ""
                } ${status.loading ? "opacity-60 cursor-default" : "hover:opacity-90 active:scale-[0.99]"}`}
              >
                {status.loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="mt-7 text-[13px]  text-taupe text-center">
            {mode === "login" ? "New to Velora?" : "Already have an account?"}{" "}
            <span
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="text-ink font-medium cursor-pointer"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-5">
      <label className="block text-[11px] tracking-widest uppercase text-taupe mb-2">{label}</label>
      {children}
    </div>
  );
}