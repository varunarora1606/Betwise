import { OrderBook, SideBook } from "@/components/trading/Trading";

/**
 * Formats price with 2 decimal places
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Sorts the orderbook entries appropriately
 */
export const sortOrders = (orderBook: OrderBook): OrderBook => {
  return {
    yes: [...orderBook.yes].sort((a, b) => a.price - b.price),
    no: [...orderBook.no].sort((a, b) => a.price - b.price),
  };
};

/**
 * Gets the maximum quantity in an order set for visualization scaling
 */
export const getMaxQuantity = (sideBooks: SideBook[]): number => {
  if (sideBooks.length === 0) return 1;
  return Math.max(...sideBooks.map(sideBook => sideBook.quantity));
};