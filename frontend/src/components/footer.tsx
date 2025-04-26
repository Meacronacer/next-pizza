import Link from "next/link";

const Footer = () => {
  return (
    <section className="pb-10 h-full w-full">
      <div className="max-w-[1280px] m-auto">
        <div className="grid grid-cols-4 py-10 px-4 gap-4 justify-between max-w-[900px] tablet:grid-cols-2 tablet:text-center">
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">Next Pizza</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">About us</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Django-book</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Blog power of mind</Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">Work</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">At the pizzeria</Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">For partners</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Franchise</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">investments</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">For suppliers</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Offer a room</Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">This is interesting</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Why do we cook without gloves?</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Excursions and master classes</Link>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <Link href="/">Corporate orders</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap max-w-[350px] px-4 gap-10 mt-4 tablet:text-center tablet:m-auto">
          <div>
            <h6 className="mb-3 font-bold text-[24px]">217,494.55 $</h6>
            <p className="">
              Revenue of the UK network this month. In the past - Dollars
              157,588.40 $
            </p>
          </div>
          <div>
            <h6 className="mb-3 font-bold text-[24px]">24 pizzerias</h6>
            <p className="">
              Our pizzerias are already in two countries in UK and RO
            </p>
          </div>
        </div>

        <hr className="my-12 opacity-25" />

        <ul className="flex flex-wrap gap-4 px-4 text-[18px] font-bold items-center justify-center">
          <li>Next Pizza © 2024</li>
          <li className="cursor-pointer hover:text-gray-500">
            <Link href="/">Legal information</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-500">
            <Link href="/">Calorie content and composition</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-500">
            <Link href="/">Help</Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Footer;
