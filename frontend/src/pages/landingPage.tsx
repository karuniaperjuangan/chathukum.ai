import { useEffect, useState } from "react";
import HomePage from "./landing/home";
import ExploreLawsPage from "./landing/explore";
import AboutPage from "./landing/about";
import GuidePage from "./landing/guide";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiMenu } from "react-icons/hi";

export default function LandingPage() {
  const [isLogged, setIsLogged] = useState(false);
  const pages = [
    <HomePage />,
    <GuidePage />,
    <ExploreLawsPage />,
    <AboutPage />,
  ];
  const [activePageIdx, setActivePageIdx] = useState(0);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }
    try {
      fetch(import.meta.env.VITE_BASE_API_URL + "/auth/check", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.ok) {
          setIsLogged(true);
        } else {
          localStorage.removeItem("token");
        }
      });
    } catch (error) {
      console.error(error);
      return;
    }
  }, []);

  return (
    <>
      <nav className="fixed h-16 w-screen bg-white top-0 shadow-lg">
        <div className="flex h-full items-center mx-8">
          <a
            href="/"
            className=" text-xl font-bold text-ch-coral hover:text-ch-brick-red transition-colors"
          >
            ChatHukum.ai
          </a>
          <div className="flex-1"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => setActivePageIdx(0)}
              className="font-semibold"
            >
              Beranda
            </button>
            {!isLogged && (
              <a href="/auth/login" className="font-semibold">
                Login
              </a>
            )}
            {isLogged && (
              <a href="/chat" className="font-semibold">
                Chat
              </a>
            )}
            <button
              onClick={() => setActivePageIdx(1)}
              className="font-semibold"
            >
              Petunjuk
            </button>
            <button
              onClick={() => setActivePageIdx(2)}
              className="font-semibold"
            >
              Daftar Peraturan
            </button>
            <button
              onClick={() => setActivePageIdx(3)}
              className="font-semibold"
            >
              Tentang
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Menu as="div" className="relative">
              <MenuButton className="text-xl font-bold">
                <HiMenu size={25} />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md focus:outline-none z-50">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setActivePageIdx(0)}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                        active ? "bg-gray-400" : ""
                      }`}
                    >
                      Beranda
                    </button>
                  )}
                </MenuItem>
                {!isLogged && (
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/auth/login"
                        className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                          active ? "bg-gray-400" : ""
                        }`}
                      >
                        Login
                      </a>
                    )}
                  </MenuItem>
                )}
                {isLogged && (
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/chat"
                        className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                          active ? "bg-gray-400" : ""
                        }`}
                      >
                        Chat
                      </a>
                    )}
                  </MenuItem>
                )}
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setActivePageIdx(1)}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                        active ? "bg-gray-400" : ""
                      }`}
                    >
                      Petunjuk
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setActivePageIdx(2)}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                        active ? "bg-gray-400" : ""
                      }`}
                    >
                      Daftar Peraturan
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setActivePageIdx(3)}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-200 ${
                        active ? "bg-gray-400" : ""
                      }`}
                    >
                      Tentang
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
      <div className="min-h-[calc(100vh-7rem)]">{pages[activePageIdx]}</div>
      <footer className="bg-black h-12 ">
        <div className="flex justify-center items-center h-full text-white">
          © 2024{" "}
          <a href="https://www.linkedin.com/in/karunia-perjuangan-mustadl-afin-620420175/">
            {" "}
            Karunia Perjuangan M
          </a>
        </div>
      </footer>
    </>
  );
}
