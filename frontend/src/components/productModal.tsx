import { IextrasOptions, Iproduct, IproductDetails } from "@/@types/product";
import { useProductDetail } from "@/api/productsApi";
import { useAddToCart, useEditCartItem } from "@/hooks/useCart";
import React, { useEffect, useState } from "react";
import ExtraOptionItem from "./extraOptionItem";
import Image from "next/image";
import { enableScroll } from "@/utils/scrollbar";

interface ModalProps {
  product: Iproduct | null;
  isOpen: boolean;
  onClose: () => void;
  extras?: IextrasOptions[];
  variant_id?: number;
  changeMode?: boolean;
}

const ProductModal: React.FC<ModalProps> = ({
  product,
  isOpen,
  onClose,
  extras,
  variant_id,
  changeMode = false,
}) => {
  const { data, isLoading: productDetailLoading } = useProductDetail(
    changeMode
      ? product?.product_id || ""
      : product?.id
      ? product.id.toString()
      : ""
  );
  const productData = data as IproductDetails;
  const { mutate: addToCart } = useAddToCart();
  const { mutate: changeCartItem } = useEditCartItem();

  // Выбранный вариант (по дефолту первый)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  // Массив id выбранных дополнительных опций
  const [selectedExtras, setSelectedExtras] = useState<number[]>(
    extras?.map((item) => item.id) || []
  );

  useEffect(() => {
    if (productData?.variants && variant_id) {
      const index = productData.variants.findIndex((v) => v.id === variant_id);
      if (index !== -1) setSelectedVariantIndex(index);
    }
  }, [productData, variant_id, isOpen]);

  // Обновление extras при изменении входных данных
  useEffect(() => {
    if (extras) {
      setSelectedExtras(extras.map((e) => e.id));
    }
  }, [extras, isOpen]);

  // Сброс значений при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setSelectedVariantIndex(0);
      setSelectedExtras([]);
    }
  }, [isOpen]);

  const handleExtraToggle = (extraId: number) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const calculateTotalPrice = (): number => {
    const basePrice = Number(
      productData?.variants[selectedVariantIndex]?.price ||
        product?.price_from ||
        0
    );
    const extrasPrice = productData?.extra_options.reduce((sum, extra) => {
      return (
        sum + (selectedExtras.includes(extra.id) ? Number(extra.price) : 0)
      );
    }, 0);
    return basePrice + extrasPrice;
  };

  const handleAddToCart = () => {
    if (changeMode) {
      //    - item_key: текущий уникальный ключ позиции в корзине, которую нужно изменить
      //    - variant_id: новый ID выбранного варианта продукта
      //    - extras: (опционально) новый список ID доп. опций
      //    - quantity: (опционально) новое количество; если не указано – сохраняется текущее количество
      const itemData = {
        item_key: product?.key,
        variant_id: productData.variants[selectedVariantIndex].id, // установите выбранный вариант
        extras: selectedExtras || [], // список ID выбранных доп. опций
      };

      changeCartItem(itemData);
    } else {
      const itemData = {
        product_id: product?.id,
        variant_id: productData.variants[selectedVariantIndex].id, // установите выбранный вариант
        extras: selectedExtras || [], // список ID выбранных доп. опций
        quantity: 1, // или другое выбранное количество
      };

      addToCart(itemData);
    }
    enableScroll();
    onClose();
  };

  return (
    <div
      onClick={() => {
        if (!changeMode) {
          enableScroll();
        }
        onClose();
      }}
      className={`fixed inset-0 z-50 flex h-dvh items-center justify-center bg-black/70 p-4 transition-colors duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          isOpen ? "visible scale-100 opacity-100" : "scale-125 opacity-0"
        } relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl transform transition-all duration-200 overflow-y-auto max-h-[90vh]`}
      >
        {/* Кнопка закрытия */}
        <div
          onClick={() => {
            enableScroll();
            onClose();
          }}
          className="absolute px-4 py-2 right-0.5 top-1 hover:bg-black/90 cursor-pointer duration-200 rounded-full"
        >
          <button className="text-gray-500 cursor-pointer dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors">
            x
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Левая колонка – изображение продукта */}
          <div className="md:w-1/2 p-4 flex justify-center items-center h-auto md:h-[500px]">
            <Image
              width={500}
              height={500}
              src={product?.img_url || "/pizza.svg"}
              alt={product?.name || "product"}
              className="w-full rounded-md sm:ml-10 ml-5 object-cover"
            />
          </div>

          {/* Правая колонка – информация */}
          <div className="md:w-1/2 py-6 px-3.5 pt-12 flex flex-col h-auto md:h-[500px]">
            {/* Прокручиваемая область */}
            <div className="overflow-y-auto flex-grow pr-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {product?.name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {product?.description}
              </p>

              {productDetailLoading && (
                <div className="mt-6 space-y-2">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 animate-pulse mb-2" />
                  <div className="flex gap-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-full h-10 bg-gray-300 dark:bg-gray-600 rounded-3xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              )}

              {!productDetailLoading &&
                productData?.variants.some((i) => i.size) && (
                  <div className="mt-2">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      Select Size
                    </h2>
                    <div className="flex  gap-3 mt-2 border-b border-gray-200 dark:border-gray-700">
                      {productData?.variants?.map((variant, index) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantIndex(index)}
                          className={`px-4 py-2 w-full rounded-3xl  border-b-2 transition-colors duration-300 ${
                            selectedVariantIndex === index
                              ? "border-orange-500 text-white bg-orange-500"
                              : "border-transparent text-gray-500 cursor-pointer hover:text-orange-500 hover:border-orange-500"
                          }`}
                        >
                          {variant.size} cm
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {productDetailLoading && (
                <div className="mt-6 pb-6">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4 animate-pulse" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              )}

              {!productDetailLoading &&
                productData?.extra_options &&
                productData?.extra_options.length > 0 && (
                  <div className="mt-6 pb-6">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      Extra Options
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 px-1">
                      {productData?.extra_options?.map((extra) => (
                        <ExtraOptionItem
                          key={extra.id}
                          extraOption={extra}
                          isSelected={selectedExtras.includes(extra.id)}
                          onToggle={() => handleExtraToggle(extra.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Футер */}
            <div className="mt-4">
              <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Total Price:{" "}
                <span className="text-green-400">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full cursor-pointer bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
