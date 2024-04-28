import { useState,useEffect,useMemo } from "react";
import { db } from "../data/db";
import type { Guitars,CartItem } from "../types";

export const useCart = () => {
    
  const initialCart = () : CartItem[] => {
    const lcoalStorageCart = localStorage.getItem("cart");
    return lcoalStorageCart ? JSON.parse(lcoalStorageCart) : [];
  };
  //STATES
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item:Guitars) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updateCart = [...cart];
      updateCart[itemExists].quantity++;
      setCart(updateCart);
    } else {
      const newItem : CartItem = {...item,quantity : 1}
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id : Guitars['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id != id));
  }

  function increaseQuantity(id : Guitars['id']) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function decreaseQuantity(id : Guitars['id']) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function clearCart() {
    setCart([]);
  }

  //! state derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  };
};
