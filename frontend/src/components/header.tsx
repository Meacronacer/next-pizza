"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import CartPanel from "./cartPanel";
import ProductModal from "./productModal";
import { LinkTo } from "@/utils/navigations";
import { usePathname, useRouter } from "next/navigation";
import { disableScroll, enableScroll } from "@/utils/scrollbar";
import { useCart } from "@/hooks/useCart";
import { useLogout, useUserProfile } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/api/base";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Iproduct } from "@/@types/product";
import Image from "next/image";

const navItems = [
  { id: "pizzas", label: "Pizzas" },
  { id: "snacks", label: "Snacks" },
  { id: "beverages", label: "Beverages" },
  { id: "cocktails", label: "Cocktails" },
  { id: "coffe", label: "Coffes" },
  { id: "desserts", label: "Desserts" },
  { id: "sauces", label: "Sauces" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const [modalProduct, setModalProduct] = useState<Iproduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cartItems = [] } = useCart();
  const { data: user, isLoading: loadingUser, isError } = useUserProfile();
  const { mutate: logout } = useLogout();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
  useClickOutside(desktopSearchRef, () => {
    // only clear desktop results if mobile panel is closed
    if (!mobileSearchOpen) {
      setQuery("");
    }
  });
  useClickOutside(mobileSearchRef, () => {
    setMobileSearchOpen(false);
    setQuery("");
  });

  useClickOutside(profileMenuRef, () => {
    if (profileMenuOpen) setProfileMenuOpen(false);
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
    results: Iproduct[];
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
              <Image
                width={40}
                height={40}
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
                  ${product.price_from}
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
    <header className="w-full fixed top-0 z-30 bg-white dark:bg-[#0a0a0a]/50 backdrop-blur transition-all duration-300">
      <div className="max-w-7xl mx-auto border-b border-gray-200 dark:border-white/40 relative">
        <div
          className={`flex items-center justify-between p-4 ${
            mobileSearchOpen ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          {/* Logo */}
          <Link href={LinkTo.home}>
            <h1 className="text-xl font-bold cursor-pointer">NEXT PIZZA</h1>
          </Link>

          {/* Desktop Search */}
          <div
            ref={desktopSearchRef}
            className="hidden md:block flex-1 mx-4 relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pizzas or beverages..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {query && (
              <SearchResults results={results} loading={loadingSearch} />
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-1 text-xl rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              🔍
            </button>

            {/* Theme Toggle */}
            {!mounted ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <button
                onClick={toggleTheme}
                className="p-1 text-xl rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            )}

            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 border rounded text-sm"
            >
              {language.toUpperCase()}
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => {
                  disableScroll();
                  setCartModal(true);
                }}
                className="p-1 cursor-pointer text-xl rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                🛒
              </button>
              {cartItems.length > 0 && (
                <span className="absolute pointer-events-none -bottom-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* User Profile / Login */}
            {loadingUser ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isError || !user?.id ? (
              <button
                onClick={() => router.push(LinkTo.login)}
                className="px-4 cursor-pointer py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <Image
                  src={user.img_url || "/avatar.jpg"}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                />
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                    <Link
                      href={LinkTo.orders}
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm("Are you sure you want to logout?")
                        ) {
                          logout(
                            {},
                            {
                              onSuccess: () => {
                                router.push(LinkTo.home);
                                setProfileMenuOpen(false);
                              },
                            }
                          );
                        }
                      }}
                      className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Panel */}
        {mobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="absolute inset-0 bg-white dark:bg-gray-900 p-4 z-40 flex items-center"
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pizzas or beverages..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="ml-2 p-1 text-2xl rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
            {query && (
              <SearchResults results={results} loading={loadingSearch} />
            )}
          </div>
        )}

        {path === "/" && (
          <nav className="ml-4">
            <div className="container mx-auto py-2 max-[480px]:pr-4 flex space-x-4 overflow-x-auto">
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
