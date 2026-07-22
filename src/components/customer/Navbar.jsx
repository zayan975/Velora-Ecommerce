"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingBag,Handbag, User } from "lucide-react";

const MENU_LINKS = [
  { label: "Men", href: "/products?category=men" },
  { label: "Women", href: "/products?category=women" },
  { label: "About us", href: "/about" },
  // future links yahan add karte jana, jaise: { label: "Sale", href: "/sale" }
];

export default function Navbar({ cartCount = 0 }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-8 z-40 ">
        <nav className="flex items-center justify-between px-5 md:px-8 h-5">
          {/* Left — hamburger */}
          <div className="">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className=" flex gap-1 hover:border-b items-center text-[#d9d0ca] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Menu size={20} />
          
          <p className="font-sans text-lg ">menu</p>
          </button>
          </div>

          {/* Center — wordmark */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-4xl md:text-2xl sm:xl lg:text-5xl text-white lg:tracking-wide font-semibold"
          >
            Velora
          </Link>

          {/* Right — search, bag, profile */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              aria-label="Search"
              className="p-2 text-white hover:opacity-70 transition-opacity"
            >
              <Search size={19} />
            </button>

            <Link
              href="/cart"
              aria-label="Handbag"
              className="relative p-2 text-white hover:opacity-70 transition-opacity"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose text-bone text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Account"
                className="p-2 text-white hover:opacity-70 transition-opacity"
              >
                <User size={19} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 z-50 w-44 bg-bone border border-ink/10 shadow-sm"
                    >
                      {session?.user ? (
                        <>
                          <div className="px-4 py-3 border-b border-ink/10">
                            <p className="text-sm text-ink font-medium truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-taupe truncate">
                              {session.user.email}
                            </p>
                          </div>
                          <Link
                            href="/orders"
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors"
                          >
                            My orders
                          </Link>
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              signOut();
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-rose-deep hover:bg-ink/5 transition-colors"
                          >
                            Log out
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors"
                        >
                          Sign in
                        </Link>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>

      {/* Hamburger drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[98%] max-w-xs bg-bone flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-ink/10">
                <span className="font-display font-semibold text-2xl text-ink">Velora</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 text-ink hover:opacity-70 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col px-6 py-8 gap-1">
                {MENU_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-2xl text-ink py-2.5 hover:text-rose transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto px-6 py-6 text-xs text-taupe border-t border-ink/10">
                velora.com
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}