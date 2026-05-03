import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  total: 0,
  addToCart: (product: any) => set((state: any) => {
    // Buscar si el producto ya está en el carrito
    const existingItem = state.cart.find((item: any) => item.id === product.id);
    
    let newCart;
    if (existingItem) {
      // Si existe, le sumamos 1 a la cantidad
      newCart = state.cart.map((item: any) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      // Si no existe, lo agregamos con cantidad 1
      newCart = [...state.cart, { ...product, quantity: 1 }];
    }

    const newTotal = newCart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    return { cart: newCart, total: newTotal };
  }),
  clearCart: () => set({ cart: [], total: 0 })
}));