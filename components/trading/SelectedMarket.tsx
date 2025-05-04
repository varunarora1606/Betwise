import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarketCard from "./MarketCard";
import { getMaxQuantity, sortOrders } from "@/lib/orderUtils";
import { toast } from "sonner";
import { LoaderCircle, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { OrderBook, Question } from "./Trading";

interface SelectedMarketProps {
  question: Question;
  onBack: () => void;
  transactionType: "buy" | "sell";
}

interface PriceDetail {
  total: number;
  orders: string[];
}

const SelectedMarket = ({ question, onBack, transactionType }: SelectedMarketProps) => {
  const { getToken } = useAuth();
  const [orderBook, setOrderBook] = useState<OrderBook>({
    yes: [],
    no: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulating fetching the orderbook data
    const loadOrderbook = async () => {
      setIsLoading(true);
      const token = await getToken({ template: "my-jwt" });

      if (!token) {
        toast.error("Unauthorized access", {
          description: "Unauthorized access: Please login",
          icon: <X className="h-5 w-5 text-red-500" />,
        });
        return;
      }

      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate network delay and generate mock data
        const response = await axios.get(
          "http://api.betwise.varekle.tech/api/v1/order/orderbook",
          {
            params: {
              symbol: question.symbol,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const data = response.data.data;
        console.log(response);
        const newOrderBook: OrderBook = {
          yes: [],
          no: [],
        };
        Object.entries(
          data.orderBook.yes as Record<string, PriceDetail>
        ).forEach(([price, priceDetail]) => {
          newOrderBook.no.push({
            price: 100 - Number(price),
            quantity: priceDetail.total,
            betId: priceDetail.orders,
          });
        });
        Object.entries(
          data.orderBook.no as Record<string, PriceDetail>
        ).forEach(([price, priceDetail]) => {
          newOrderBook.yes.push({
            price: 100 - Number(price),
            quantity: priceDetail.total,
            betId: priceDetail.orders,
          });
        });
        console.log(newOrderBook);

        // Sort the orders
        const sortedOrders = sortOrders(newOrderBook);
        setOrderBook(sortedOrders);

        // Mock orderbook data based on the selected question
        // const mockOrders: Order[] = [
        //   {
        //     id: "ord-1",
        //     type: "buy",
        //     side: "yes",
        //     price: -0.5,
        //     quantity: 100,
        //     timestamp: new Date(Date.now() - 300000).toISOString(),
        //   },
        //   {
        //     id: "ord-2",
        //     type: "sell",
        //     side: "yes",
        //     price: +1.2,
        //     quantity: 50,
        //     timestamp: new Date(Date.now() - 120000).toISOString(),
        //   },
        //   {
        //     id: "ord-3",
        //     type: "buy",
        //     side: "no",
        //     price: 100 - -2,
        //     quantity: 75,
        //     timestamp: new Date(Date.now() - 180000).toISOString(),
        //   },
        //   {
        //     id: "ord-4",
        //     type: "sell",
        //     side: "no",
        //     price: 100 - +0.8,
        //     quantity: 120,
        //     timestamp: new Date(Date.now() - 60000).toISOString(),
        //   },
        //   {
        //     id: "ord-5",
        //     type: "buy",
        //     side: "yes",
        //     price: -1.3,
        //     quantity: 85,
        //     timestamp: new Date(Date.now() - 240000).toISOString(),
        //   },
        //   {
        //     id: "ord-6",
        //     type: "sell",
        //     side: "yes",
        //     price: +0.7,
        //     quantity: 65,
        //     timestamp: new Date(Date.now() - 150000).toISOString(),
        //   },
        // ];

        // setOrderbook(sortedOrders);
      } catch (error) {
        console.error("Error loading orderbook:", error);
        toast.error("Failed to load orderbook data");
      } finally {
        setIsLoading(false);
      }
    };

    if (question) {
      loadOrderbook();
    }
  }, [question, getToken]);

  useEffect(() => {
    if (transactionType == "buy") {
      
    }
  
    return () => {
      
    }
  }, [transactionType])
  

  // Filter orders by side
  // const filteredOrders = orderbook.filter((order) => order.side === stockSide);
  // const buyOrders = filteredOrders.filter((order) => order.type === "buy");
  // const sellOrders = filteredOrders.filter((order) => order.type === "sell");

  // Calculate max quantities for visualization scaling
  const maxBuyQuantity = getMaxQuantity(orderBook.yes);
  const maxSellQuantity = getMaxQuantity(orderBook.yes);

  // Determine the number of rows to display (max of either side, with a minimum of 5)
  const numOrdersToShow = 6;

  return (
    <div className="md:w-2/5 w-full">
      <Card className="p-6 bg-[#13131A] border-purple-500/20 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-purple-300">
            Selected Market
          </h2>
          <Button
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
            onClick={onBack}
          >
            Back to Markets
          </Button>
        </div>
        <MarketCard
          question={question}
          onClick={() => {}}
          className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500"
        />
        {/* <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500">
        <h3 className="font-medium text-purple-50 mb-3">{question.title}</h3>
        <div className="flex justify-between text-sm">
          <span className="text-green-400">
            Price: ₹{question.currentPrice}
          </span>
          <span className="text-purple-400">Volume: {question.volume}</span>
        </div>
      </div> */}

        {/* Probo-style Side-by-Side Orderbook */}
        <div className="mt-8 border border-purple-500/20 rounded-lg overflow-hidden bg-[#13131A]">
          <div className="p-3 bg-purple-900/20 border-b border-purple-500/20">
            <h3 className="text-md font-medium text-purple-100">Orderbook {transactionType == "buy" ? "(Bid)" : "(Ask)"}</h3>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-center py-6">
                <LoaderCircle className="h-8 w-8 animate-spin text-purple-400" />
                <span className="ml-3 text-sm text-purple-200">
                  Loading orderbook...
                </span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full bg-purple-900/20" />
                <Skeleton className="h-8 w-full bg-purple-900/20" />
                <Skeleton className="h-8 w-full bg-purple-900/20" />
              </div>
            </div>
          ) : orderBook.yes.length === 0 && orderBook.no.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-300">
              No orders in the orderbook yet
            </div>
          ) : (
            <div className="p-4 w-full relative">
              {/* Column Headers */}
              <div className="grid grid-cols-2 mb-2 text-xs font-semibold text-gray-300">
                {/* Buy side headers */}
                {/* <div className="text-center">TOTAL</div> */}
                <div className="flex w-full justify-between">
                  <div className="w-14 text-center">PRICE</div>
                  <div className="text-right w-full px-2">
                    QTY <span className="text-green-500">YES</span>
                  </div>
                </div>

                {/* Sell side headers */}
                <div className="flex w-full justify-between">
                  <div className="text-left w-full px-2">
                    QTY <span className="text-red-500">NO</span>
                  </div>
                  <div className="w-14 text-center">PRICE</div>
                </div>
                {/* <div className="text-center">TOTAL</div> */}
              </div>

              {/* <span className="w-1 h-full absolute right-[50%] translate-x-0.5 top-0 bg-[#13131A]">
                  <span className="bg-purple-500/20 w-full h-full"></span>
                </span> */}

              {/* Order rows */}
              <div className="w-full">
                {Array.from({ length: numOrdersToShow }).map((_, index) => {
                  const yesOrder =
                    index < orderBook.yes.length ? orderBook.yes[index] : null;
                  const noOrder =
                    index < orderBook.no.length ? orderBook.no[index] : null;

                  return (
                    <div
                      key={`row-${index}`}
                      className="grid grid-cols-2 text-xs mb-0.5"
                    >
                      {/* Buy side */}

                      {/* <div className="text-center text-gray-400">
                          {yesOrder
                            ? formatPrice(yesOrder.price * yesOrder.quantity)
                            : "-"}
                        </div> */}
                      <div className="flex justify-between">
                        <div className="w-14 text-center font-medium text-gray-300/80 py-1">
                          {yesOrder ? `${yesOrder.price / 10}` : "-"}
                        </div>
                        <div className="relative text-center w-full flex justify-end px-2 py-1">
                          {yesOrder ? (
                            <>
                              <span className="relative z-10 text-gray-300/80">
                                {yesOrder.quantity}
                              </span>
                              <div
                                className="absolute right-0 top-0 h-full bg-green-500/20 z-0"
                                style={{
                                  width: `${
                                    (yesOrder.quantity /
                                      (maxSellQuantity + maxBuyQuantity)) *
                                    100
                                  }%`,
                                  maxWidth: "100%",
                                }}
                              />
                            </>
                          ) : (
                            <span className="text-gray-300/80">-</span>
                          )}
                        </div>
                      </div>

                      {/* Sell side */}
                      <div className="flex justify-between">
                        <div className="relative text-center w-full flex justify-start px-2 py-1">
                          {noOrder ? (
                            <>
                              <span className="relative z-10 text-gray-300/80">
                                {noOrder.quantity}
                              </span>
                              <div
                                className="absolute left-0 top-0 h-full bg-red-500/20 z-0"
                                style={{
                                  width: `${
                                    (noOrder.quantity /
                                      (maxSellQuantity + maxBuyQuantity)) *
                                    100
                                  }%`,
                                  maxWidth: "100%",
                                }}
                              />
                            </>
                          ) : (
                            <span className="text-gray-300/80">-</span>
                          )}
                        </div>
                        <div className="w-14 text-center font-medium text-gray-300/80 py-1">
                          {noOrder ? `${noOrder.price / 10}` : "-"}
                        </div>
                      </div>
                      {/* <div className="text-center text-gray-400">
                          {noOrder
                            ? formatPrice(noOrder.price * noOrder.quantity)
                            : "-"}
                        </div> */}
                    </div>
                  );
                })}
              </div>

              {/* Spread indicator (centered at bottom) */}
              {/* <div className="border-t border-purple-500/30 py-3 mt-3 text-center">
                  <div className="text-xs">
                    <span className="text-gray-400">SPREAD:</span>
                    {calculateSpread(buyOrders, sellOrders) ? (
                      <span className="ml-1 text-purple-300">
                        ₹{calculateSpread(buyOrders, sellOrders)}
                      </span>
                    ) : (
                      <span className="ml-1 text-gray-500">N/A</span>
                    )}
                  </div>
                </div> */}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SelectedMarket;
