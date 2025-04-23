"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import CartPanel from "./cartPanel";
import ProductModal from "./productModal";
import { LinkTo } from "@/utils/navigations";
import { useRouter } from "next/navigation";
import { disableScroll, enableScroll } from "@/utils/scrollbar";
import { useCart } from "@/hooks/useCart";
import { useUserProfile } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/base";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Iproduct } from "@/@types/product";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const router = useRouter();

  const [modalProduct, setModalProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cartItems = [] } = useCart();
  const { data: user, isLoading: loadingUser, isError } = useUserProfile();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isLoading: loadingSearch } = useQuery({
    queryKey: ["products", debouncedQuery],
    queryFn: () =>
      fetch(
        `${API_URL}/api/products/all-products/?search=${encodeURIComponent(
          debouncedQuery
        )}`
      ).then((res) => res.json()),
    enabled: debouncedQuery.trim().length > 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    placeholderData: (prev) => prev,
  });

  // Обработка кликов вне области поиска
  useClickOutside(desktopSearchRef, () => setQuery(""));
  useClickOutside(mobileSearchRef, () => {
    setMobileSearchOpen(false);
    setQuery("");
  });

  const handleSelect = (prod: Iproduct) => {
    setModalProduct(prod);
    setIsModalOpen(true);
    setMobileSearchOpen(false);
    setQuery("");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "uk" : "en"));

  useEffect(() => setMounted(true), []);

  const SearchResults = ({
    results,
    loading,
  }: {
    results: any[];
    loading: boolean;
  }) => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Загрузка...</div>
      ) : results.length > 0 ? (
        results.map((product) => (
          <div
            key={product.id}
            onClick={() => handleSelect(product)}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <img
                src={product.img_url || "/default-product.png"}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-product.png";
                }}
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.category} · ${product.price_from}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          Ничего не найдено
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full fixed top-0 z-30 bg-white dark:bg-[#0a0a0a]/50 dark:backdrop-blur-3xl transition-all duration-300">
      <div className="max-w-7xl mx-auto border-b-2 border-gray-200 dark:border-white/40 backdrop-blur-3xl relative">
        <div
          className={`flex items-center justify-between p-4 transition-opacity duration-300 ${
            mobileSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Link href={LinkTo.home}>
            <h1 className="cursor-pointer font-bold text-xl">NEXT PIZZA</h1>
          </Link>

          <div
            ref={desktopSearchRef}
            className="flex-1 mx-4 hidden md:block relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск пицц и напитков..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            />
            {query && (
              <SearchResults results={results} loading={loadingSearch} />
            )}
          </div>

          <div className="flex-shrink-0 flex items-center gap-x-3">
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden text-xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              🔍
            </button>

            {!mounted ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className="text-xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            )}

            <button
              onClick={toggleLanguage}
              className="border px-2 py-1 rounded text-sm"
            >
              {language.toUpperCase()}
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  disableScroll();
                  setCartModal(true);
                }}
                className="text-xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                🛒
              </button>
              {cartItems.length > 0 && (
                <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs">
                  {cartItems.length}
                </div>
              )}
            </div>

            {loadingUser ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isError || !user?.id ? (
              <button
                onClick={() => router.push(LinkTo.login)}
                className="bg-orange-500 cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            ) : user.img_url ? (
              <img
                onClick={() => router.push(LinkTo.profile)}
                src={user.img_url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <button
                onClick={() => router.push(LinkTo.profile)}
                className="p-2 border rounded-full"
              >
                👤
              </button>
            )}
          </div>
        </div>

        {mobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="absolute inset-0 bg-white dark:bg-gray-900 z-40 p-4 flex items-center"
          >
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск пицц и напитков..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              />
              {query && (
                <div className="absolute top-full left-0 right-0 mt-2">
                  {" "}
                  {/* Добавляем обертку */}
                  <SearchResults results={results} loading={loadingSearch} />
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="ml-2 text-2xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <CartPanel
        open={cartModal}
        onClose={() => {
          enableScroll();
          setCartModal(false);
        }}
        cartItems={cartItems}
      />

      <ProductModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
