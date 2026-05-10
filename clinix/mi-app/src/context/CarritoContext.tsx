// ══════════════════════════════════════════════════════
//  context/CarritoContext.tsx
// ══════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Producto } from '../services/api';

interface ItemCarrito extends Producto {
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregar: (producto: Producto) => void;
  quitar: (product_id: number) => void;
  cambiarCantidad: (product_id: number, cantidad: number) => void;
  vaciar: () => void;
  total: number;
  totalItems: number;
  isOpen: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const agregar = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.product_id === producto.product_id);
      if (existe) {
        return prev.map((i) =>
          i.product_id === producto.product_id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }, []);

  const quitar = useCallback((product_id: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  const cambiarCantidad = useCallback((product_id: number, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.product_id !== product_id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product_id === product_id ? { ...i, cantidad } : i))
      );
    }
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, i) => {
    const p = (i as any).price ?? (i as any).unit_price ?? (i as any).unitPrice ?? 0;
    return acc + (Number(p) || 0) * i.cantidad;
  }, 0);
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  const abrirCarrito = useCallback(() => setIsOpen(true), []);
  const cerrarCarrito = useCallback(() => setIsOpen(false), []);

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, totalItems, isOpen, abrirCarrito, cerrarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito(): CarritoContextType {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
}
