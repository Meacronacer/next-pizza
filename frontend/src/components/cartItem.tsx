import React from "react";
import Image from "next/image";
import { IcartItem } from "@/@types/cart";

interface Props {
  item: IcartItem;
  calcTotal: (item: IcartItem) => number;
  onChangeQty: (key: string, newQty: number) => void;
  disabled?: boolean;
}

export function CartItem({ item, calcTotal, onChangeQty, disabled }: Props) {
  const unitTotals = calcTotal(item) / item.quantity;
  return (
    <div className="flex justify-between items-start py-4 border-b">
      <div className="flex gap-3">
        <Image
          src={item.img_url}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
        <div>
          <h3 className="font-medium">{item.name}</h3>
          {item.extras.length > 0 && (
            <ul className="text-xs text-gray-600">
              {item.extras.map((e) => (
                <li key={e.id}>
                  +{e.name} ({e.price.toFixed(2)})
                </li>
              ))}
            </ul>
          )}
          <p className="text-green-600 text-sm">
            Unit: {unitTotals.toFixed(2)}$
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            disabled={disabled}
            onClick={() => onChangeQty(item.key, item.quantity - 1)}
            className="w-6 h-6"
          >
            –
          </button>
          <span>{item.quantity}</span>
          <button
            disabled={disabled}
            onClick={() => onChangeQty(item.key, item.quantity + 1)}
            className="w-6 h-6"
          >
            +
          </button>
        </div>
        <p className="text-green-500 font-semibold">
          {calcTotal(item).toFixed(2)}$
        </p>
      </div>
    </div>
  );
}
