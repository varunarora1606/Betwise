"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown, WalletCards, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddMoneyDialog from "./AddMoneyDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PortfolioItem, PendingOrder } from "@/types/portfolio";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { API_URL_FULL } from "@/lib/config";

const initialPendingOrders: PendingOrder[] = [
  {
    id: "p1",
    title: "India vs Pakistan Match",
    type: "buy",
    quantity: 5,
    price: 75.25,
    timestamp: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "p2",
    title: "Bitcoin $100K",
    type: "sell",
    quantity: 3,
    price: 150.5,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: "processing",
  },
];

interface PortfolioApiItem {
  symbol: string;
  title: string;
  value: number;
  quantity: number;
}

const Portfolio = () => {
  const { getToken } = useAuth();

  const [wallet, setWallet] = useState<number>(0);
  const [lockedWallet, setLockedWallet] = useState<number>(0);

  // const [pendingOrders, setPendingOrders] =
  //   useState<PendingOrder[]>(initialPendingOrders);
  const pendingOrders = initialPendingOrders;
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

  // Calculate locked Wallet from pending buy orders
  //   const lockedWallet = pendingOrders
  //     .filter((order) => order.type === "buy")
  //     .reduce((sum, order) => sum + order.price * order.quantity, 0);

  // Calculate locked stocks from pending sell orders
  const getLockedQuantity = (itemId: string): number => {
    return pendingOrders
      .filter(
        (order) =>
          order.title ===
            portfolioItems.find((item) => item.id === itemId)?.title &&
          order.type === "sell"
      )
      .reduce((sum, order) => sum + order.quantity, 0);
  };

  const handleAddMoney = (amount: number) => {
    setWallet((prev) => prev + amount);
  };

  const cancelOrder = (orderId: string) => {
    console.log(orderId);
    toast.error("Feature comming soon");
  };

  useEffect(() => {
    (async () => {
      const token = await getToken({ template: "my-jwt" });

      if (!token) {
        toast.error("Unauthorized access", {
          description: "Unauthorized access: Please login",
          icon: <X className="h-5 w-5 text-red-500" />,
        });
        return;
      }

      try {
        const response = await axios.get(`${API_URL_FULL}/order/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log(response);
        const data = response.data.data;
        setWallet(data.inrBalance.quantity / 10);
        setLockedWallet(data.inrBalance.locked / 10);
        const newPortfolioItems: PortfolioItem[] = [];
        data.portfolioItems.forEach((element: PortfolioApiItem) => {
          newPortfolioItems.push({
            id: element.symbol,
            title: element.title,
            value: element.value,
            quantity: element.quantity,
          });
        });
        setPortfolioItems(newPortfolioItems);
        setTotalPortfolioValue(
          newPortfolioItems.reduce((sum, item) => sum + item.value, 0)
        );
      } catch (error) {
        console.log(error);
        toast.error("Error occured", {
          description: "Error occured: Please try again",
          icon: <X className="h-5 w-5 text-red-500" />,
        });
      }
    })();

    // return () => {};
  }, [getToken]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <div className="flex gap-4">
            <AddMoneyDialog onAddMoney={handleAddMoney} />
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
            >
              <Link href="/trading" className="flex items-center">
                Go to Trading
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#13131A] border-purple-500/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-purple-300">
                Portfolio Summary
              </CardTitle>
              <CardDescription className="text-purple-100/70">
                Your current positions and investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500">
                <div className="text-3xl font-bold mb-2 text-white">
                  ₹{totalPortfolioValue / 10}
                </div>
                <div className="text-sm text-purple-200">
                  Total Portfolio Value
                </div>
              </div>

              {portfolioItems.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-purple-200 mb-4">
                    Your Positions
                  </h3>
                  <div className="space-y-4">
                    {portfolioItems.map((item) => {
                      const lockedQty = getLockedQuantity(item.id);
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium text-white">
                              {/* TODO: Correct this thing */}
                              {item.title == ""? "Bitcoin $100k" : item.title} 
                            </h4>
                            <div className="text-sm text-purple-300">
                              Qty: {item.quantity}
                              {lockedQty > 0 && (
                                <span className="ml-1 text-amber-300">
                                  ({lockedQty} locked in sell orders)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-white">
                              ₹{item.value / 10}
                            </div>
                            {/* Change indicator */}
                            {/* <div
                            className={`flex items-center text-sm ${
                              item.change >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.change >= 0 ? (
                              <ArrowUp size={14} className="mr-1" />
                            ) : (
                              <ArrowDown size={14} className="mr-1" />
                            )}
                            {Math.abs(item.change)}%
                          </div> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#13131A] border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-300">Wallet</CardTitle>
              <CardDescription className="text-purple-100/70">
                Your current balance and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-purple-400 flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-200 mb-1">
                    Available Balance
                  </div>
                  <div className="text-3xl font-bold text-white">
                    ₹{wallet}
                    {lockedWallet > 0 && (
                      <div className="text-xs text-amber-300 mt-1">
                        ₹{lockedWallet.toLocaleString()} locked in pending
                        orders
                      </div>
                    )}
                  </div>
                </div>
                <WalletCards className="text-purple-300" size={36} />
              </div>

              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500">
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Orders Section */}
        <Card className="bg-[#13131A] border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center">
              <Clock className="mr-2 text-purple-400" size={20} />
              Pending Orders
            </CardTitle>
            <CardDescription className="text-purple-100/70">
              Orders that have been placed but not yet executed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8 text-purple-200/60">
                No pending orders at the moment
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-purple-300">
                      Order Type
                    </TableHead>
                    <TableHead className="text-purple-300">Market</TableHead>
                    <TableHead className="text-purple-300">Quantity</TableHead>
                    <TableHead className="text-purple-300">Price</TableHead>
                    <TableHead className="text-purple-300">Status</TableHead>
                    <TableHead className="text-purple-300">Time</TableHead>
                    <TableHead className="text-purple-300">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((order) => (
                    <TableRow key={order.id} className="border-purple-500/20">
                      <TableCell
                        className={`font-medium ${
                          order.type === "buy"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {order.type === "buy" ? (
                          <div className="flex items-center">
                            <ArrowUp size={14} className="mr-1" /> Buy
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ArrowDown size={14} className="mr-1" /> Sell
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-white">{order.title}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>₹{order.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "pending"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-purple-200/70">
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;
