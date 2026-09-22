import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Shop",
    path: "/shop",
  },
  {
    label: "Collections",
    path: "/collections",
  },
  {
    label: "New Arrivals",
    path: "/new-arrivals",
  },
  {
    label: "Best Sellers",
    path: "/best-sellers",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

function NavLinks() {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-7 xl:gap-8">
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) => `
            relative
            block
            rounded-lg
            px-3
            py-2.5
            text-[15px]
            font-medium
            transition-all
            duration-200

            lg:px-0
            lg:py-1
            lg:rounded-none

            ${
              isActive
                ? "text-[#8A7356]"
                : "text-[#403a34] hover:text-[#8A7356]"
            }

            lg:after:absolute
            lg:after:left-0
            lg:after:-bottom-2
            lg:after:h-[1.5px]
            lg:after:bg-[#8A7356]
            lg:after:transition-all
            lg:after:duration-300

            ${
              isActive
                ? "lg:after:w-full"
                : "lg:after:w-0 hover:lg:after:w-full"
            }

            hover:bg-[#f5eee6]
            lg:hover:bg-transparent
          `}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;