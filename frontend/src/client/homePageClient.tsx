"use client";
import { Iproduct } from "@/@types/product";
import { CartItem } from "@/api/cartApi";
import ProductList from "@/components/productList";
import ProductModal from "@/components/productModal";
import { useState } from "react";

const HomePageClient = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<Iproduct | null>(null);

  return (
    <div className="pt-34 max-w-7xl w-full mx-auto p-4">
      <ProductList setIsOpen={setIsOpen} setProduct={setProduct} />

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
      <ProductModal
        product={product}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default HomePageClient;
