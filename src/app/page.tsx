'use client';

import React, { useState, useEffect, createContext, useContext, MouseEvent, SVGProps, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from './firebaseConfig'; 

// --- 1. Tipe Data & Data Statis ---
interface Product {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
}

const navItems = [
  { name: "Shop", href: "#shop" },
  { name: "About", href: "#about" },
  { name: "History", href: "#history" },
  { name: "Philosophy", href: "#filosofi" },
];

const products: Product[] = [
    { id: 1, name: "Citrine Flame", price: "390.000", desc: "Fresh, fruity, and woody. A dance of bergamot, apple, plum, and cedarwood.", image: "/products/cf.png" },
    { id: 2, name: "Ivory Bloom", price: "290.000", desc: "A radiant blend of lychee, rhubarb, saffron, and Turkish rose, capturing serenity.", image: "/products/ib.png" },
    { id: 3, name: "Or du Soir", price: "350.000", desc: "A sensual blend of coffee, amaretto, and vanilla bourbon. Warm, smooth, and intimate.", image: "/products/ods.png" },
    { id: 4, name: "Oud Legendaire", price: "270.000", desc: "A tropical yet mysterious symphony of passion fruit, mango, and pineapple.", image: "/products/ol.png" },
    { id: 5, name: "Midnight Cherry", price: "350.000", desc: "A bold fusion of cherry liqueur, bitter almond, and sparkling bergamot.", image: "/products/mc.png" },
];

// --- 2. THEME CONTEXT ---
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      html.classList.add('dark');
    } else {
      setIsDarkMode(false);
      html.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      const html = document.documentElement;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      if (newMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- 3. ICON COMPONENTS ---
const MenuIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg> );
const XIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const SunIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> );
const MoonIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> );
const ShoppingCartIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> );
const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg> );
const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg> );


// --- 4. HEADER COMPONENT ---
interface HeaderProps {
  showCartNotification: boolean;
}

const Header = ({ showCartNotification }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showQris, setShowQris] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const handleRemoveItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => {
      const cleanPrice = Number(String(item.price).replace(/\./g, ""));
      return acc + cleanPrice;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      await addDoc(collection(db, "transactions"), {
        cart: cartItems,
        total: getTotal(),
        timestamp: serverTimestamp(),
      });
      setShowQris(true);
      setIsCartOpen(false);
    } catch (error) {
      console.error("❌ Firestore error:", error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 p-4 font-orbitron bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md border-b border-gray-200 dark:border-gray-800"
      >
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <a href="#hero" className="z-50"><motion.span whileHover={{ scale: 1.05 }} className="text-2xl font-black text-blue-600 dark:text-cyan-200 cursor-pointer tracking-wider">E-VOSTE</motion.span></a>
          <nav className="hidden md:flex space-x-10 items-center">
            {navItems.map((item) => (
              <a key={item.name} href={item.href}><motion.span whileHover={{ y: -2, color: isDarkMode ? "#22D3EE" : "#2563EB" }} className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">{item.name}</motion.span></a>
            ))}
          </nav>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsCartOpen(!isCartOpen)} className="cart-icon p-2 rounded-full cursor-pointer text-gray-800 dark:text-cyan-200 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Open Cart">
                <ShoppingCartIcon />
              </motion.button>
              <AnimatePresence>
                {(showCartNotification || cartItems.length > 0) && (
                  <motion.div key="cart-notification" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </AnimatePresence>
              <AnimatePresence>
          {isCartOpen && (
            <motion.div
              key="cart-popup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="
                absolute z-50
                mt-2 w-80
                bg-white dark:bg-gray-800 border dark:border-gray-700
                rounded-xl shadow-2xl
                left-1/2 -translate-x-1/2
                md:left-auto md:right-0 md:translate-x-0
              "
            >
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 dark:text-white">Your Cart</h3>

                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover rounded-md"
                            />
                            <div>
                              <p className="text-sm font-semibold dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Rp {item.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t dark:border-gray-700 mt-3 pt-3">
                      <p className="text-right font-bold dark:text-gray-100">
                        Total: Rp {getTotal().toLocaleString("id-ID")}
                      </p>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="mt-4 w-full py-2 bg-blue-600 dark:bg-cyan-500 text-white font-semibold rounded-full hover:bg-blue-700 dark:hover:bg-cyan-600 transition"
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

            </div>
            <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400" aria-label="Toggle Dark Mode">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={isDarkMode ? 'moon' : 'sun'} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle Menu">{isMenuOpen ? <XIcon /> : <MenuIcon />}</button></div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav key="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden">
              <ul className="flex flex-col items-center space-y-4 py-6">
                {navItems.map((item) => (<li key={item.name}><a href={item.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-700 dark:text-gray-300">{item.name}</a></li>))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {showQris && (
          <motion.div key="qris-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl text-center w-[90%] max-w-sm">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Total Payment</h2>
              <p className="text-xl mb-4 font-semibold text-blue-600 dark:text-cyan-200">Rp {getTotal().toLocaleString("id-ID")}</p>
              <div className="relative w-60 h-60 mx-auto mb-6"><Image src="/qris.png" alt="QRIS Payment" fill className="object-contain" /></div>
              <button onClick={() => setShowQris(false)} className="w-full py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition">Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


// --- 5. REUSABLE SECTION CONTAINER ---
// ✅ FIX: Menambahkan tipe `Variants` dari framer-motion untuk memperbaiki error TypeScript.
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  },
};

interface SectionContainerProps {
  id: string;
  title: string;
  children: ReactNode;
  isAlternate?: boolean;
}

const SectionContainer = ({ id, title, children, isAlternate = false }: SectionContainerProps) => (
  <motion.section 
    id={id} 
    variants={sectionVariants} 
    initial="hidden" 
    whileInView="visible" 
    viewport={{ once: true, amount: 0.2 }} 
    className={`py-24 font-orbitron ${isAlternate ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900"}`}
  >
    <div className="container mx-auto px-6 max-w-7xl">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900 dark:text-cyan-300">{title}</h2>
      {children}
    </div>
  </motion.section>
);


// --- 6. QUIZ SECTION ---
declare global { interface Window { dataLayer: unknown[]; } }

const QuizSection = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const questions = [
        { q: "Which vibe describes you best?", options: ["Elegant & Romantic", "Bold & Daring", "Playful & Energetic", "Mysterious & Deep", "Warm & Comforting"] },
        { q: "When do you usually wear perfume?", options: ["Morning", "Afternoon", "Evening", "Night Out"] },
        { q: "What’s your favorite color palette?", options: ["Soft pastels", "Bright yellow/orange", "Deep red tones", "Dark gold & black", "Cream & brown hues"] },
        { q: "Choose your perfect statement:", options: ["I shine with positivity", "I define elegance", "I leave a bold impression", "I love peace and warmth", "I embrace mystery"] },
    ];

    useEffect(() => {
        const savedResult = localStorage.getItem("quizResult");
        if (savedResult) setResult(savedResult);
    }, []);

    const handleAnswer = (option: string) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (ans: string[]) => {
        let finalResult = "";
        const match = ans.join(" ").toLowerCase();
        if (match.includes("red") || match.includes("bold") || match.includes("night")) finalResult = "Midnight Cherry";
        else if (match.includes("romantic") || match.includes("elegant") || match.includes("pastel")) finalResult = "Ivory Bloom";
        else if (match.includes("energetic") || match.includes("bright") || match.includes("yellow")) finalResult = "Citrine Flame";
        else if (match.includes("mysterious") || match.includes("dark") || match.includes("black")) finalResult = "Oud Legendaire";
        else finalResult = "Or du Soir";
        setResult(finalResult);
        localStorage.setItem("quizResult", finalResult);
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({ event: "quiz_complete", quiz_result: finalResult });
        }
    };

    const handleRestart = () => {
        setStep(0);
        setAnswers([]);
        setResult(null);
        localStorage.removeItem("quizResult");
    };

    const progress = ((step + 1) / questions.length) * 100;
    const perfumeImages: Record<string, string> = { "Midnight Cherry": "/products/mc1.png", "Ivory Bloom": "/products/ib1.png", "Citrine Flame": "/products/cf1.png", "Oud Legendaire": "/products/ol1.png", "Or du Soir": "/products/ods1.png" };

    return (
        <SectionContainer id="quiz" title="Find Your Signature Scent" isAlternate={true}>
            <div className="relative max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300 overflow-hidden rounded-2xl">
                <motion.div
                    className="absolute inset-0 z-0 opacity-30 blur-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 dark:from-cyan-600 dark:via-blue-800 dark:to-purple-700"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                />
                <div className="relative z-10 p-6 md:p-10">
                    {!result && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-10 overflow-hidden">
                            <motion.div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                <h3 className="text-2xl font-semibold mb-6">{questions[step].q}</h3>
                                <div className="flex flex-col space-y-4">
                                    {questions[step].options.map((opt, idx) => (
                                        <motion.button key={idx} onClick={() => handleAnswer(opt)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-3 px-6 bg-blue-600 dark:bg-cyan-500 text-white rounded-full font-medium shadow-lg hover:bg-blue-700 dark:hover:bg-cyan-600 transition">{opt}</motion.button>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm opacity-70">Question {step + 1} of {questions.length}</p>
                            </motion.div>
                        ) : (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-8">
                                <h3 className="text-3xl font-bold text-blue-600 dark:text-cyan-200">Your Perfect Match:</h3>
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                                  <Image src={perfumeImages[result]} alt={result} width={240} height={240} className="mx-auto rounded-xl object-cover shadow-2xl border dark:border-gray-700" />
                                </motion.div>
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-semibold dark:text-white">{result}</motion.p>
                                <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                                    {result === "Midnight Cherry" && "A daring scent for bold nights seductive, rich, and unforgettable."}
                                    {result === "Ivory Bloom" && "Soft, floral elegance that defines romantic confidence."}
                                    {result === "Citrine Flame" && "Bright, energetic, and refreshing perfect for daytime joy."}
                                    {result === "Oud Legendaire" && "Deep, mysterious, and luxurious a true timeless aura."}
                                    {result === "Or du Soir" && "Warm, cozy, and sensual embrace the calm of twilight."}
                                </p>
                                <motion.div className="flex justify-center gap-4 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                    <a href="#shop" className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-blue-700 transition">View in Shop</a>
                                    <button onClick={handleRestart} className="px-8 py-3 border-2 border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-200 rounded-full font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-gray-900 transition">Restart Quiz</button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </SectionContainer>
    );
};


// --- 7. SHOP SECTION ---
const ShopSection = ({ triggerCartAnimation }: { triggerCartAnimation: () => void; }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);
  const currentProduct = products[currentIndex];

  const handleBuyClick = async (e: MouseEvent<HTMLButtonElement>) => {
    triggerCartAnimation();
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      const img = document.createElement("img");
      img.src = currentProduct.image;
      img.className = "fixed w-24 h-24 object-cover rounded-full z-[999] transition-all duration-700 ease-in-out pointer-events-none";
      img.style.left = `${e.clientX - 48}px`;
      img.style.top = `${e.clientY - 48}px`;
      document.body.appendChild(img);
      setTimeout(() => {
        const rect = cartIcon.getBoundingClientRect();
        img.style.left = `${rect.left + rect.width / 2 - 20}px`;
        img.style.top = `${rect.top + rect.height / 2 - 20}px`;
        img.style.opacity = "0";
        img.style.transform = "scale(0.2)";
      }, 100);
      setTimeout(() => img.remove(), 800);
    }
    const currentCart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!currentCart.some(item => item.id === currentProduct.id)) {
        localStorage.setItem("cart", JSON.stringify([...currentCart, currentProduct]));
    }
    window.dispatchEvent(new Event("cartUpdated"));
    setPopupProduct(currentProduct);
    setShowPopup(true);
    try {
      await addDoc(collection(db, "orders"), { ...currentProduct, timestamp: serverTimestamp() });
    } catch (error) {
      console.error("❌ Error adding order:", error);
    }
  };

  return (
    <SectionContainer id="shop" title="Find Your Essence">
      <p className="max-w-4xl mx-auto text-center text-lg mb-12 text-gray-700 dark:text-gray-300">Fragrance is more than a scent; it is a story, a memory, and a signature. Each creation is made to define you.</p>
      <div className="relative flex items-center justify-center">
        <motion.button onClick={() => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute left-0 md:-left-16 p-3 z-30 rounded-full bg-blue-600 dark:bg-cyan-500 text-white shadow-xl"><ChevronLeftIcon className="w-6 h-6" /></motion.button>
        {/* ✅ STYLE: Border (stroke) dibuat lebih soft dan modern */}
        <div className="relative w-full max-w-5xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={currentProduct.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="grid md:grid-cols-2 gap-10 items-center">
             <div
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-gray-300/30 dark:border-gray-600/40 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] ">
              <Image src={currentProduct.image} alt={currentProduct.name} fill className="object-cover transition-transform duration-500 hover:scale-105"/>
            </div>
              <div className="text-left space-y-4">
                <h3 className="text-3xl font-bold dark:text-white">{currentProduct.name}</h3>
                <p className="text-md text-gray-600 dark:text-gray-400 leading-relaxed">{currentProduct.desc}</p>
                <p className="text-3xl font-black text-blue-500 dark:text-cyan-400">Rp {currentProduct.price}</p>
                <motion.button onClick={handleBuyClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/50 dark:bg-cyan-500 dark:shadow-cyan-500/50 transition-all">Buy Now</motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.button onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute right-0 md:-right-16 p-3 z-30 rounded-full bg-blue-600 dark:bg-cyan-500 text-white shadow-xl"><ChevronRightIcon className="w-6 h-6" /></motion.button>
      </div>
      <AnimatePresence>
        {showPopup && popupProduct && (
          <motion.div key="cart-product-popup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <h3 className="text-2xl font-bold dark:text-white mb-4">Added to Cart 🛒</h3>
              <Image src={popupProduct.image} alt={popupProduct.name} width={160} height={160} className="object-cover mx-auto rounded-lg mb-4" />
              <p className="font-semibold dark:text-white">{popupProduct.name}</p>
              <p className="text-blue-500 dark:text-cyan-400 text-lg font-bold mb-6">Rp {popupProduct.price}</p>
              <button onClick={() => setShowPopup(false)} className="px-6 py-3 bg-blue-600 dark:bg-cyan-500 text-white rounded-full font-semibold transition">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
};


// --- 8. ABOUT SECTION ---
const AboutSection = () => (
  <SectionContainer id="about" title="About Us" isAlternate={true}>
    <div className="relative rounded-3xl overflow-hidden" style={{ backgroundImage: "url('/home2.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm" />
      <div className="relative grid md:grid-cols-3 gap-12 items-center text-gray-700 dark:text-gray-300 p-8 md:p-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="relative h-64 md:h-full rounded-2xl overflow-hidden border-4 border-dashed border-blue-400 dark:border-cyan-500">
          <Image src="/about.png" alt="About EVOSTE" fill className="object-cover" />
        </motion.div>
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            <h3 className="text-3xl font-bold mb-4 dark:text-white">EVOSTE Vision</h3>
            <p className="text-lg leading-relaxed">Every drop holds a story. A scent is more than aroma it is memory woven into the soul. Guided by the vision “Be Timeless. Crafted Your Scent Legacy,” each creation is born to last.</p>
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
            <p className="text-lg leading-relaxed border-l-4 border-blue-500 dark:border-cyan-500 pl-4 italic">Crafted with artistry, every note becomes a chapter of life’s journey. From fleeting moments to eternal impressions, it preserves what words cannot. Each layer is composed with harmony, precision, and depth that endures. It is a silent language of presence, confidence, and individuality. Not just to be worn, but to be lived and remembered. An invitation to leave traces that time itself cannot erase.</p>
          </motion.div>
        </div>
      </div>
    </div>
  </SectionContainer>
);


// --- 9. HISTORY SECTION ---
const HistorySection = () => (
  <SectionContainer id="history" title="Our History">
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
      <div className="space-y-36 relative before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-0 before:bottom-0 before:w-1 before:bg-gray-200 dark:before:bg-gray-700">
        <TimelineEvent year="2000" title="A Timeless Beginning">The story began with a vision to create perfumes that are more than just scents they are timeless legacies. EVOSTE was born to redefine how fragrance captures emotion and memory.</TimelineEvent>
        <TimelineEvent year="2008" title="Crafting with Soul">Over the years, only the finest and most unique ingredients were carefully selected, ensuring each creation carried authenticity, elegance, and depth. </TimelineEvent>
        <TimelineEvent year="2015" title="The Art of Composition">Each variant is the result of years of dedication blending more than 200 carefully chosen notes into a single harmonious composition. </TimelineEvent>
        <TimelineEvent year="2023" title="Be Timeless. Craft Your Legacy.">Today, the collection stands as a testament to that vision. With the philosophy <em>“Be Timeless. Craft Your Scent Legacy,”</em> every creation is designed to transcend time.</TimelineEvent>
      </div>
    </motion.div>
  </SectionContainer>
);

const TimelineEvent = ({ year, title, children }: { year: string; title: string; children: ReactNode; }) => (
  <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative md:w-1/2 md:even:ml-auto md:odd:pr-8 md:even:pl-8">
    <div className="absolute top-0 -left-[23px] w-5 h-5 bg-blue-600 dark:bg-cyan-500 rounded-full z-10 md:left-1/2 md:-translate-x-1/2"></div>
    {/* ✅ STYLE: Border kartu dibuat lebih soft */}
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <h4 className="text-xl font-bold mb-2 text-blue-600 dark:text-cyan-400">{year} - {title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  </motion.div>
);


// --- 10. PHILOSOPHY SECTION ---
const FilosofiSection = () => (
  <SectionContainer id="filosofi" title="Philosophy: The Essences" isAlternate={true}>
    <div className="relative max-w-5xl mx-auto text-center space-y-10 px-8 py-12 leading-relaxed">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-semibold italic text-gray-900 dark:text-white">Perfume is not merely worn; it is lived, remembered, and passed on.</motion.p>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="space-y-6 text-lg md:text-xl font-light text-gray-700 dark:text-gray-300">
          <p>We believe that scent is an eternal trace that lingers in memory. Each drop carries a story, every layer unfolds a journey, and every impression becomes a legacy.</p>
          <p>Guided by the vision <em>“Be Timeless. Craft Your Scent Legacy,”</em> every creation is designed to transcend time, weaving fleeting moments into memories that never fade. Parfume is not only meant to be worn, but to be lived as an unspoken language, as a presence that leaves a mark, and as a legacy passed from one generation to the next.</p>
        </motion.div>
    </div>
  </SectionContainer>
);


// --- 11. FOOTER & FLOATING CTA ---
const Footer = () => (
  <footer className="py-10 bg-gray-900 dark:bg-black text-gray-400 font-orbitron border-t border-blue-600/50 dark:border-cyan-500/50">
    <div className="container mx-auto px-6 max-w-7xl text-center"><p className="mb-6 text-xl font-black text-blue-500 dark:text-cyan-200">EVOSTE</p><div className="flex justify-center space-x-8 mb-6 text-sm"><a href="#shop" className="hover:text-white">Catalog</a><a href="#about" className="hover:text-white">Vision</a><a href="#" className="hover:text-white">Contact</a></div><p className="text-xs">&copy; {new Date().getFullYear()} EVOSTE - Matrix Sync. All Rights Reserved.</p></div>
  </footer>
);

const FloatingCTA = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="cta-popup"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-16 right-0 w-48 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-2xl p-4 space-y-3"
                    >
                        <a href="https://wa.me/6285187732004" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 .01 5.37.01 12c0 2.1.55 4.16 1.6 5.97L0 24l6.22-1.63A11.96 11.96 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.48-8.52zM12 22a10.02 10.02 0 01-5.09-1.37l-.36-.21-3.68.97.98-3.59-.23-.37A10.04 10.04 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.64-.81-1.89-.9s-.43-.14-.62.14-.71.9-.87 1.09c-.16.19-.32.21-.6.07-1.18-.43-2.25-1.38-2.25-1.38s-1.04-1.37-1.55-1.93c-.16-.28-.02-.43.12-.57s.43-.48.43-.48.19-.28.28-.47.05-.35-.02-.49-.85-2.06-.85-2.06-.22-.52-.45-.45h-.53s-.43.07-.66.35-.87.85-.87 2.07.89 2.4 1.02 2.57 1.76 2.69 4.27 3.77c2.51 1.08 2.96.68 2.96.68s1.46-.59 1.67-1.16.21-1.06.14-1.16c-.07-.1-.25-.17-.53-.31z"/></svg><span>WhatsApp</span></a>
                        <a href="https://www.instagram.com/msync.tech" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"></line></svg><span>Instagram</span></a>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button onClick={() => setOpen(!open)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-14 h-14 rounded-full bg-blue-600 dark:bg-cyan-500 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all" aria-label="Contact Options">
                <AnimatePresence mode="wait">
                    <motion.div key={open ? 'close' : 'open'} initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <i className={`fas ${open ? 'fa-seedling' : 'fa-rocket'} text-2xl`}></i>
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
};


// --- 12. HOME PAGE COMPONENT ---
export default function Home() { 
  const [showCartNotification, setShowCartNotification] = useState(false);
  const triggerCartAnimation = () => {
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000); 
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen antialiased transition-colors duration-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header showCartNotification={showCartNotification} />
        <main>
          <section id="hero" className="relative flex items-center justify-center h-[80vh] min-h-[500px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/home1.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent" />
            <div className="relative z-10 container mx-auto px-10 max-w-7xl text-center">
              <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl font-black mb-4 text-gray-900 dark:text-white drop-shadow-lg">EVOSTE</motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-3xl font-light text-blue-600 dark:text-cyan-200 tracking-widest mb-8">Be Timeless Crafted Your Scent Legacy</motion.p>
              <motion.a href="#shop" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 150, delay: 0.4 }} className="inline-block px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-xl hover:bg-blue-700 dark:hover:bg-gray-200 transition">Explore Now</motion.a>
            </div>
          </section>
          <QuizSection />
          <ShopSection triggerCartAnimation={triggerCartAnimation} />
          <AboutSection />
          <HistorySection />
          <FilosofiSection />
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </ThemeProvider>
  );
}
