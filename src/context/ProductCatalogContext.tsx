"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { infoproduct } from "@/Data/infoproduct";

import type {
  InfoProduct,
  ProductStatus,
} from "@/types/type_infoProduct";

import type { Order } from "@/types/type_order";

type ProductCatalogContextValue = {
  products: InfoProduct[];
  myPosts: InfoProduct[];
  orders: Order[];
  cart: InfoProduct[];
  favorites: InfoProduct[];

  addProduct: (
    product: InfoProduct,
  ) => void;

  updateProduct: (
    id: string,
    product: InfoProduct,
  ) => void;

  deleteProduct: (
    id: string,
  ) => void;

  updateProductStatus: (
    id: string,
    status: ProductStatus,
  ) => void;

  addOrder: (
    product: InfoProduct,
    buyerName: string,
    buyerEmail: string,
    shippingAddress: string,
    phone: string,
  ) => void;

  markOrderNotificationAsRead: (
    orderId: string,
  ) => void;

  addToCart: (
    product: InfoProduct,
  ) => void;

  removeFromCart: (
    id: string,
  ) => void;

  clearCart: () => void;

  toggleFavorite: (
    product: InfoProduct,
  ) => void;
};

const ProductCatalogContext =
  createContext<ProductCatalogContextValue | null>(
    null,
  );

export function ProductCatalogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<InfoProduct[]>(infoproduct);

  const [myPosts, setMyPosts] =
    useState<InfoProduct[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [cart, setCart] =
    useState<InfoProduct[]>([]);

  const [favorites, setFavorites] =
    useState<InfoProduct[]>([]);

  function addProduct(
    product: InfoProduct,
  ) {
    setProducts((currentProducts) => [
      product,
      ...currentProducts,
    ]);

    setMyPosts((currentPosts) => [
      product,
      ...currentPosts,
    ]);
  }

  function updateProduct(
    id: string,
    updatedProduct: InfoProduct,
  ) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? updatedProduct
          : product,
      ),
    );

    setMyPosts((currentPosts) =>
      currentPosts.map((product) =>
        product.id === id
          ? updatedProduct
          : product,
      ),
    );

    setFavorites((currentFavorites) =>
      currentFavorites.map((product) =>
        product.id === id
          ? updatedProduct
          : product,
      ),
    );

    setCart((currentCart) =>
      currentCart.map((product) =>
        product.id === id
          ? updatedProduct
          : product,
      ),
    );
  }

  function deleteProduct(
    id: string,
  ) {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) =>
          product.id !== id,
      ),
    );

    setMyPosts((currentPosts) =>
      currentPosts.filter(
        (product) =>
          product.id !== id,
      ),
    );

    setCart((currentCart) =>
      currentCart.filter(
        (product) =>
          product.id !== id,
      ),
    );

    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (product) =>
          product.id !== id,
      ),
    );
  }

  function updateProductStatus(
    id: string,
    status: ProductStatus,
  ) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              status,
            }
          : product,
      ),
    );

    setMyPosts((currentPosts) =>
      currentPosts.map((product) =>
        product.id === id
          ? {
              ...product,
              status,
            }
          : product,
      ),
    );

    setFavorites((currentFavorites) =>
      currentFavorites.map((product) =>
        product.id === id
          ? {
              ...product,
              status,
            }
          : product,
      ),
    );

    setCart((currentCart) =>
      currentCart.map((product) =>
        product.id === id
          ? {
              ...product,
              status,
            }
          : product,
      ),
    );

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (
          order.product.id !== id
        ) {
          return order;
        }

        const newStatus =
          status === "Sold"
            ? "Sold"
            : "Reserved";

        return {
          ...order,

          status: newStatus,

          product: {
            ...order.product,
            status,
          },

          notificationRead: false,
        };
      }),
    );
  }

  function addOrder(
    product: InfoProduct,
    buyerName: string,
    buyerEmail: string,
    shippingAddress: string,
    phone: string,
  ) {
    const newOrder: Order = {
      id: `order-${Date.now()}-${product.id}`,

      product: {
        ...product,
        status: "Reserved",
      },

      buyerName,
      buyerEmail,
      shippingAddress,
      phone,

      status: "Reserved",

      notificationRead: false,
    };

    setOrders((currentOrders) => [
      ...currentOrders,
      newOrder,
    ]);

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id
          ? {
              ...currentProduct,
              status: "Reserved",
            }
          : currentProduct,
      ),
    );

    setMyPosts((currentPosts) =>
      currentPosts.map((currentProduct) =>
        currentProduct.id === product.id
          ? {
              ...currentProduct,
              status: "Reserved",
            }
          : currentProduct,
      ),
    );

    setFavorites((currentFavorites) =>
      currentFavorites.map((currentProduct) =>
        currentProduct.id === product.id
          ? {
              ...currentProduct,
              status: "Reserved",
            }
          : currentProduct,
      ),
    );

    setCart((currentCart) =>
      currentCart.filter(
        (cartProduct) =>
          cartProduct.id !== product.id,
      ),
    );
  }

  function markOrderNotificationAsRead(
    orderId: string,
  ) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              notificationRead: true,
            }
          : order,
      ),
    );
  }

  function addToCart(
    product: InfoProduct,
  ) {
    setCart((currentCart) => {
      const alreadyInCart =
        currentCart.some(
          (cartProduct) =>
            cartProduct.id === product.id,
        );

      if (alreadyInCart) {
        return currentCart;
      }

      return [
        ...currentCart,
        product,
      ];
    });
  }

  function removeFromCart(
    id: string,
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (product) =>
          product.id !== id,
      ),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleFavorite(
    product: InfoProduct,
  ) {
    setFavorites((currentFavorites) => {
      const alreadyFavorite =
        currentFavorites.some(
          (favorite) =>
            favorite.id === product.id,
        );

      if (alreadyFavorite) {
        return currentFavorites.filter(
          (favorite) =>
            favorite.id !== product.id,
        );
      }

      return [
        ...currentFavorites,
        product,
      ];
    });
  }

  return (
    <ProductCatalogContext.Provider
      value={{
        products,
        myPosts,
        orders,
        cart,
        favorites,

        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStatus,

        addOrder,
        markOrderNotificationAsRead,

        addToCart,
        removeFromCart,
        clearCart,
        toggleFavorite,
      }}
    >
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  const context =
    useContext(ProductCatalogContext);

  if (!context) {
    throw new Error(
      "useProductCatalog must be used inside ProductCatalogProvider",
    );
  }

  return context;
}