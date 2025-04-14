"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useClickOutside } from "@/hooks/useClickOutside";
import CartPanel from "./cartPanel";
import { LinkTo } from "@/utils/navigations";
import { usePathname, useRouter } from "next/navigation";
import { disableScroll, enableScroll } from "@/utils/scrollbar";
import { useCart } from "@/hooks/useCart";
import { useUserProfile } from "@/hooks/useAuth";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en"); // en или uk
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const { data = [] } = useCart();
  const { data: user, isLoading } = useUserProfile();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "uk" : "en"));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "pizzas", label: "Пицца" },
    { id: "zakuski", label: "Закуски" },
    { id: "drinks", label: "Напитки" },
    { id: "cocktails", label: "Коктейли" },
    { id: "coffee", label: "Кофе" },
    { id: "desserts", label: "Десерты" },
    { id: "sauces", label: "Соусы" },
  ];

  // ref для поиска, чтобы отлавливать клики вне него
  const searchRef = useRef(null);
  useClickOutside(searchRef, () => {
    if (mobileSearchOpen) setMobileSearchOpen(false);
  });

  return (
    <header className="w-full dark:bg-[#0a0a0a]/50 dark:backdrop-blur-3xl fixed top-0 z-30 transition-all duration-300">
      {" "}
      <div className="max-w-7xl mx-auto border-b-2 backdrop-blur-3xl border-white/40">
        {/* Основной контент Header */}
        <div
          className={`w-full mx-auto p-4 flex items-center justify-between transition-opacity duration-300 ${
            mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Логотип */}
          <Link href={LinkTo.home}>
            <h1 className="cursor-pointer font-bold">NEXT PIZZA</h1>
          </Link>

          {/* Центр: поиск для десктопа и иконка для мобильных */}
          <div className="flex-1 mx-4">
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Поиск"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="block md:hidden">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="text-xl"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Элементы управления справа */}
          <div className="flex-shrink-0 flex items-center gap-x-3">
            {!mounted ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className="text-xl dark:hover:bg-white/30 hover:bg-black/50 duration-200 p-1 cursor-pointer"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            )}
            {/* Переключатель языка */}
            <button
              onClick={toggleLanguage}
              className="text-sm border rounded px-2 py-1 cursor-pointer"
            >
              {language === "en" ? "EN" : "UK"}
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  disableScroll();
                  setCartModal(true);
                }}
                className="text-xl dark:hover:bg-white/30 hover:bg-black/50 duration-200 p-1 cursor-pointer"
              >
                🛒
              </button>

              {data && data?.length > 0 && (
                <div className="absolute pointer-events-none bottom-0 bg-green-500 h-5 w-5 right-0 rounded-full">
                  <span className="text-[12px] flex items-center mx-auto justify-center mt-0.5 ml-0.5">
                    {data?.length}
                  </span>
                </div>
              )}
            </div>
            {isLoading ? (
              // Если данные загружаются, отображаем скелетон
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user?.id ? (
              // Если пользователь есть, проверяем наличие img_url
              user.img_url ? (
                // Если img_url присутствует, отображаем его как аватарку
                <img
                  onClick={() => router.push(LinkTo.profile)}
                  src={user?.img_url}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                // Если изображения нет, используем дефолтную аватарку
                <button
                  onClick={() => router.push(LinkTo.profile)}
                  className="p-2 cursor-pointer rounded-full border"
                >
                  <span role="img" aria-label="User">
                    👤
                  </span>
                </button>
              )
            ) : (
              // Если пользователь не залогинен, предлагаем перейти на страницу логина
              <button
                onClick={() => router.push(LinkTo.login)}
                className="bg-orange-500 hover:bg-orange-700 cursor-pointer duration-200 text-white px-4 py-2 rounded-lg"
              >
                Войти
              </button>
            )}
          </div>
        </div>
        {/* Анимированный блок поиска для мобильных */}
        <div
          ref={searchRef}
          className={`absolute top-0 left-0 right-0 h-16 flex items-center px-4 transition-transform duration-200 md:hidden ${
            mobileSearchOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <input
            autoFocus
            type="text"
            placeholder="Поиск"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="ml-2 text-xl"
          >
            ✖️
          </button>
        </div>
        {/* Нижняя навигационная панель */}
        {path === "/" && (
          <nav className="ml-4">
            <div className="container mx-auto py-2 flex space-x-4 overflow-x-auto">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="whitespace-nowrap text-sm hover:underline hover:text-purple-500"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
      <CartPanel
        open={cartModal}
        onClose={() => {
          enableScroll();
          setCartModal(false);
        }}
        cartItems={data}
      />
    </header>
  );
}
