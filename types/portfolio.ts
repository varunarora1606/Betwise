export interface PortfolioItem {
  id: string;
  title: string;
  value: number;
  quantity: number;
  change?: number; // Percentage change
}
  
export interface UserWallet {
  balance: number;
  currency: string;
}

export interface PendingOrder {
  id: string;
  title: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  timestamp: string;
  status: "pending" | "processing";
}

