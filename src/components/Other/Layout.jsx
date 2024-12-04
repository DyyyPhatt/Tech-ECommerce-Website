import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export const Layout = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <Outlet />
      <Footer />

      {showScrollToTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
};

export default Layout;
