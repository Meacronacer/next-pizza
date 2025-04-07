// pages/index.js
import React from "react";

const products = {
  pizzas: [
    { id: 1, name: "Маргарита", image: "/images/margarita.jpg", price: 10 },
    { id: 2, name: "Пепперони", image: "/images/pepperoni.jpg", price: 12 },
    { id: 3, name: "Четыре сыра", image: "/images/fourcheese.jpg", price: 14 },
    { id: 4, name: "Гавайская", image: "/images/hawaiian.jpg", price: 11 },
    { id: 5, name: "Мясная", image: "/images/meatlover.jpg", price: 15 },
    { id: 6, name: "Овощная", image: "/images/vegetarian.jpg", price: 9 },
    { id: 7, name: "Диабло", image: "/images/diablo.jpg", price: 13 },
    {
      id: 8,
      name: "С морепродуктами",
      image: "/images/seafood.jpg",
      price: 16,
    },
  ],
  zakuski: [
    { id: 1, name: "Крылышки", image: "/images/wings.jpg", price: 8 },
    { id: 2, name: "Начос", image: "/images/nachos.jpg", price: 7 },
    {
      id: 3,
      name: "Сырные палочки",
      image: "/images/cheese-sticks.jpg",
      price: 6,
    },
    { id: 4, name: "Салат Цезарь", image: "/images/caesar.jpg", price: 9 },
  ],
  drinks: [
    { id: 1, name: "Кола", image: "/images/cola.jpg", price: 2 },
    { id: 2, name: "Спрайт", image: "/images/sprite.jpg", price: 2 },
    { id: 3, name: "Фанта", image: "/images/fanta.jpg", price: 2 },
    { id: 4, name: "Лимонад", image: "/images/lemonade.jpg", price: 2 },
  ],
  cocktails: [
    { id: 1, name: "Мохито", image: "/images/mojito.jpg", price: 5 },
    {
      id: 2,
      name: "Маргарита",
      image: "/images/margarita-cocktail.jpg",
      price: 6,
    },
    {
      id: 3,
      name: "Космополитен",
      image: "/images/cosmopolitan.jpg",
      price: 7,
    },
    { id: 4, name: "Пина Колада", image: "/images/pinacolada.jpg", price: 6 },
  ],
  coffee: [
    { id: 1, name: "Эспрессо", image: "/images/espresso.jpg", price: 3 },
    { id: 2, name: "Латте", image: "/images/latte.jpg", price: 4 },
    { id: 3, name: "Капучино", image: "/images/cappuccino.jpg", price: 4 },
    { id: 4, name: "Американо", image: "/images/americano.jpg", price: 3 },
  ],
  desserts: [
    { id: 1, name: "Чизкейк", image: "/images/cheesecake.jpg", price: 5 },
    { id: 2, name: "Тирамису", image: "/images/tiramisu.jpg", price: 6 },
    { id: 3, name: "Мороженое", image: "/images/icecream.jpg", price: 4 },
    { id: 4, name: "Эклер", image: "/images/eclair.jpg", price: 4 },
  ],
  sauces: [
    { id: 1, name: "Чесночный", image: "/images/garlic-sauce.jpg", price: 1 },
    { id: 2, name: "Барбекю", image: "/images/bbq-sauce.jpg", price: 1 },
    { id: 3, name: "Сырный", image: "/images/cheese-sauce.jpg", price: 1 },
    { id: 4, name: "Острый", image: "/images/spicy-sauce.jpg", price: 1 },
  ],
};

function ProductCard({ product }: any) {
  return (
    <div className="border rounded-lg p-4 text-center transition-shadow hover:shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="mx-auto mb-4 rounded"
      />
      <h3 className="text-lg font-medium">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.price} $</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-7xl w-full mx-auto p-4">
      {Object.entries(products).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <div className="my-24 px-2">
        <h5 className="font-bold text-[34px]">Delivery and payment</h5>

        <div className="flex gap-x-10 mt-10">
          <div className="flex flex-col gap-y-4">
            <h6 className="text-primary font-bold text-[20px]">
              60 minutes or free pizza
            </h6>
            <p className="max-w-[450px]">
              If we fail to deliver in 60 minutes, you will receive an excused
              pizza. It can be added to one of the following orders.
            </p>
            <span>All prices on the menu do not include discounts..</span>
          </div>
          <div className="flex flex-wrap gap-x-10">
            <div>
              <span className="text-primary font-bold text-[20px]">
                from 6.90 $
              </span>
              <p>Minimum delivery amount</p>
            </div>
            <div>
              <span className="text-primary font-bold text-[20px]">
                100.00 $
              </span>
              <p>Maximum amount when paying in cash</p>
              <p>Product images may differ from the products in your order.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
