const Footer = () => {
  return (
    <section className="pb-10 h-full w-full">
      <div className="max-w-[1280px] m-auto">
        <div className="grid grid-cols-4 py-10 px-4 gap-4 justify-between max-w-[900px] tablet:grid-cols-2 tablet:text-center">
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">Django Pizza</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">About us</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Django-book</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Blog power of mind</a>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">Work</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">At the pizzeria</a>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">For partners</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Franchise</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">investments</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">For suppliers</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Offer a room</a>
            </li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li className="font-bold text-[18px]">This is interesting</li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Why do we cook without gloves?</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Excursions and master classes</a>
            </li>
            <li className=" cursor-pointer hover:text-gray-300">
              <a href="/">Corporate orders</a>
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
            <a href="/">Legal information</a>
          </li>
          <li className="cursor-pointer hover:text-gray-500">
            <a href="/">Calorie content and composition</a>
          </li>
          <li className="cursor-pointer hover:text-gray-500">
            <a href="/">Help</a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Footer;
