import React, { createContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (product) => {
    const index = favorites.findIndex((item) => item.id === product.id);
    let updatedFavorites;

    if (index === -1) {
      updatedFavorites = [...favorites, product];
    } else {
      updatedFavorites = favorites.filter((item) => item.id !== product.id);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
