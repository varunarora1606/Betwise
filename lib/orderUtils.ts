import { OrderBook, SideBook } from "@/app/trading/page";

/**
 * Formats price with 2 decimal places
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Calculates the spread between the highest buy and lowest sell orders
 */
// export const calculateSpread = (
//   buyOrders: Order[],
//   sellOrders: Order[]
// ): string | null => {
//   if (sellOrders.length > 0 && buyOrders.length > 0) {
//     const highestBuy = Math.max(...buyOrders.map(o => o.price));
//     const lowestSell = Math.min(...sellOrders.map(o => o.price));
//     return formatPrice(lowestSell - highestBuy);
//   }
//   return null;
// };

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