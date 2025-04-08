import CheckIcon from "../assets/check.svg";

export interface ExtraOptionType {
  id: number;
  name: string;
  img_url: string;
  price: number;
}

const ExtraOptionItem: React.FC<{
  extraOption: ExtraOptionType;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ extraOption, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`relative border-2 shadow-xl cursor-pointer p-2 flex flex-col justify-between items-center rounded-[15px] transition-all 
          ${
            isSelected
              ? "border-orange-500"
              : "hover:border-orange-100 border-white hover:scale-[1.02] duration-300"
          }`}
    >
      <img
        className="mt-[10px] ml-1"
        src={extraOption.img_url}
        alt={extraOption.name}
      />
      {isSelected && (
        <div className="absolute right-2 p-[1px] top-2 border-2 rounded-4xl border-primary border-[#fe5f00]">
          <CheckIcon className="text-[#fe5f00]" />
        </div>
      )}
      <h5 className="mt-2 mb-2 text-[12px] text-center">{extraOption.name}</h5>
      <h6 className="font-bold">{extraOption.price}$</h6>
    </div>
  );
};

export default ExtraOptionItem;
