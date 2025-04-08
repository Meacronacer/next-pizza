"use client";

import ArrowTopIcone from "../assets/arrow-top.svg";
import { useEffect, useState } from "react";

const ScrollUpButton = () => {
  const [showButton, setShowButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      const scrolledPercentage =
        (currentScrollY / (scrollHeight - windowHeight)) * 100;

      if (scrolledPercentage < 20) {
        setShowButton(false); // Скрываем кнопку, если проскролили меньше 30%
      } else if (currentScrollY < lastScrollY) {
        setShowButton(true); // Показываем кнопку, если начали скроллить вверх
      } else {
        setShowButton(false); // Скрываем кнопку, если продолжаем скроллить вниз
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`fixed group bottom-5 right-5 h-12 w-12 rounded-full border border-white/50 text-white hover:border-orange-500/50 transition-all duration-300 ${
        showButton
          ? "opacity-100 cursor-pointer"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowTopIcone className="flex mx-auto group-hover:text-orange-400/90 group-hover:-translate-y-0.5 duration-300" />
    </button>
  );
};

export default ScrollUpButton;
