import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartInfo, setCartInfo] = useState({ totalQuantity: 0, totalPrice: 0 });
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (userToken) {
          const decodedToken = jwtDecode(userToken);
          const userId = decodedToken.id;

          const cartResponse = await axios.get(
            `http://localhost:8081/api/cart/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const cartItemsFromDb = cartResponse.data.items || [];

          const cartItemsForLocalStorage = cartItemsFromDb.map((item) => ({
            id: item.product,
            quantity: item.quantity,
            selectedColor: item.color,
          }));

          const storedCartItems =
            JSON.parse(localStorage.getItem("cartItems")) || [];

          const mergedCartItems = storedCartItems.map((item) => {
            const serverItem = cartItemsFromDb.find(
              (serverItem) =>
                serverItem.product === item.id &&
                serverItem.color === item.selectedColor
            );
            if (serverItem) {
              return {
                ...item,
                quantity: serverItem.quantity,
              };
            }
            return item;
          });

          const finalCartItems = [
            ...mergedCartItems,
            ...cartItemsForLocalStorage.filter(
              (serverItem) =>
                !mergedCartItems.some(
                  (item) =>
                    item.id === serverItem.id &&
                    item.selectedColor === serverItem.selectedColor
                )
            ),
          ];

          localStorage.setItem("cartItems", JSON.stringify(finalCartItems));

          setCartItems(finalCartItems);
          updateCartInfo(finalCartItems);
        } else {
          const storedCartItems =
            JSON.parse(localStorage.getItem("cartItems")) || [];
          setCartItems(storedCartItems);
          updateCartInfo(storedCartItems);
        }
      } catch (error) {
        console.error("Không thể lấy giỏ hàng từ cơ sở dữ liệu", error);
      }
      if (userToken) {
        syncCart();
      }
    };

    fetchCartData();
  }, [userToken]);

  const updateCartInfo = (cartItems) => {
    const totalQuantity = cartItems.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    const totalPrice = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + price * quantity;
    }, 0);

    setCartInfo({ totalQuantity, totalPrice });
  };

  const syncCart = async () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (userToken) {
      const userId = JSON.parse(atob(userToken.split(".")[1])).id;

      const updatedCartItems = storedCartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        color: item.selectedColor,
      }));

      try {
        await axios.post(
          `http://localhost:8081/api/cart/sync/${userId}`,
          updatedCartItems,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.info("Giỏ hàng đã được đồng bộ!", "success");
      } catch (syncError) {
        console.error("Không thể đồng bộ giỏ hàng, vui lòng thử lại.", "error");
      }
    }
  };

  const addToCart = async (product, selectedColor, selectedQuantity) => {
    const maxQuantity =
      product.colors.find((color) => color.name === selectedColor)?.quantity ||
      0;

    const itemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.selectedColor === selectedColor
    );

    let updatedCartItems = [...cartItems];

    if (itemIndex === -1) {
      updatedCartItems.push({
        id: product.id,
        selectedColor,
        quantity: selectedQuantity,
      });
    } else {
      updatedCartItems[itemIndex].quantity = Math.min(
        updatedCartItems[itemIndex].quantity + selectedQuantity,
        maxQuantity
      );
    }

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    updateCartInfo(updatedCartItems);

    if (userToken) {
      syncCart();
    }
  };

  const updateColor = async (productId, oldColor, newColor, maxQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === productId && item.selectedColor === oldColor
        ? {
            ...item,
            selectedColor: newColor,
            quantity: Math.min(item.quantity, maxQuantity),
          }
        : item
    );

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    updateCartInfo(updatedCartItems);

    if (userToken) {
      syncCart();
    }
  };

  const updateQuantity = async (productId, selectedColor, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === productId && item.selectedColor === selectedColor
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    updateCartInfo(updatedCartItems);

    if (userToken) {
      syncCart();
    }
  };

  const removeFromCart = async (productId, selectedColor) => {
    const updatedCartItems = cartItems.filter(
      (item) => !(item.id === productId && item.selectedColor === selectedColor)
    );

    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    updateCartInfo(updatedCartItems);

    if (userToken) {
      syncCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartInfo,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateColor,
        setUserToken,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
