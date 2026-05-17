import { createContext, useMemo, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedSize = "M", customDimensions = null) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => {
        if (customDimensions) {
          return (
            item.id === product.id &&
            JSON.stringify(item.customDimensions) === JSON.stringify(customDimensions)
          );
        }

        return item.id === product.id && item.size === selectedSize;
      });

      if (existingItem) {
        return prev.map((item) => {
          if (customDimensions) {
            return item.id === product.id &&
              JSON.stringify(item.customDimensions) === JSON.stringify(customDimensions)
              ? { ...item, quantity: item.quantity + 1 }
              : item;
          }

          return item.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }

      return [
        ...prev,
        {
          ...product,
          size: customDimensions ? null : selectedSize,
          customDimensions,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id, size = null, customDimensions = null) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        if (customDimensions) {
          return !(
            item.id === id &&
            JSON.stringify(item.customDimensions) === JSON.stringify(customDimensions)
          );
        }

        return !(item.id === id && item.size === size);
      })
    );
  };

  const increaseQty = (id, size = null, customDimensions = null) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (customDimensions) {
          return item.id === id &&
            JSON.stringify(item.customDimensions) === JSON.stringify(customDimensions)
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        }

        return item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      })
    );
  };

  const decreaseQty = (id, size = null, customDimensions = null) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (customDimensions) {
            return item.id === id &&
              JSON.stringify(item.customDimensions) === JSON.stringify(customDimensions)
              ? { ...item, quantity: item.quantity - 1 }
              : item;
          }

          return item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;