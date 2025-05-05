import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { Question } from "./Trading";
import { API_URL_FULL } from "@/lib/config";

interface TradingFormProps {
  selectedQuestion: Question;
  transactionType: "buy" | "sell";
  setTransactionType: React.Dispatch<React.SetStateAction<"buy" | "sell">>;
  setReloadOrderbook: React.Dispatch<React.SetStateAction<boolean>>;
}

const TradingForm = ({
  selectedQuestion,
  transactionType,
  setTransactionType,
  setReloadOrderbook
}: TradingFormProps) => {
  const { getToken } = useAuth();
  const [stockType, setStockType] = useState<"market" | "limit">("market");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(selectedQuestion.yesClosing);

  const handleTrade = async (stockSide: "yes" | "no") => {
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a quantity", {
        description: "Quantity must be greater than 0",
        icon: <X className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    if (stockType === "limit" && (!price || price <= 0 || price >= 100)) {
      toast.error("Please enter a valid limit price", {
        description: "Limit price must be greater than 0",
        icon: <X className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    const token = await getToken({ template: "my-jwt" });

    if (token) {
      try {
        let response;
        if (transactionType == "buy") {
          response = await axios.post(
            `${API_URL_FULL}/order/buy`,
            {
              symbol: selectedQuestion.symbol,
              quantity: quantity,
              price: price,
              stockSide: stockSide,
              stockType: stockType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
        } else {
          response = await axios.post(
            `${API_URL_FULL}/order/sell`,
            {
              symbol: selectedQuestion.symbol,
              quantity: quantity,
              price: price,
              stockSide: stockSide,
              stockType: stockType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
        }
        console.log(response);
        setReloadOrderbook(prev => !prev)

        let successMsg: string;
        if (stockType == "market") {
          let totalPrice = 0;
          response.data.data.trades.forEach(
            (element: { quantity: number; price: number }) => {
              totalPrice += element.price;
            }
          );
          successMsg = `${
            transactionType === "buy" ? "Bought" : "Sold"
          } ${stockSide} for ₹${totalPrice}`;
        } else {
          successMsg = `${response.data.data.completed} ${
            transactionType === "buy" ? "Bought" : "Sold"
          }, ${response.data.data.pending} added to orderbook`
        }

        toast.success(`${stockSide.toUpperCase()} order placed successfully`, {
          description: successMsg,
          icon: <Check className="h-5 w-5 text-green-500" />,
        });
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.error ||
            "An unexpected error occurred, try again";
          toast.error("Order failed", {
            description: errorMessage,
            icon: <X className="h-5 w-5 text-red-500" />,
          });
        } else {
          toast.error("An unexpected error occurred", {
            description: "Please try again later.",
            icon: <X className="h-5 w-5 text-red-500" />,
          });
        }
      }
    } else {
      toast.error("Unauthorized access", {
        description: "Unauthorized access: Please login",
        icon: <X className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <div className="w-2/3">
      <div className="p-6 bg-gradient-to-br from-[#13131A] to-[#1C1C24] border-purple-500/20 rounded-xl">
        <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
          Place Your Trade
        </h2>

        <div className="space-y-5">
          {/* Simplified Order Configuration */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Order Type
              </label>
              <Select
                value={stockType}
                onValueChange={(value: "market" | "limit") =>
                  setStockType(value)
                }
              >
                <SelectTrigger
                  className={`h-11 ${
                    stockType === "market"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-amber-500 bg-amber-500/10"
                  }`}
                >
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Position
              </label>
              <Select
                value={transactionType}
                onValueChange={(value: "buy" | "sell") =>
                  setTransactionType(value)
                }
              >
                <SelectTrigger
                  className={`h-11 ${
                    transactionType === "buy"
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                  }`}
                >
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-purple-500/20">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-200">
                  Quantity : {quantity}
                </label>
                <Input
                  type="text"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setQuantity(0);
                      return;
                    }
                    setQuantity(parseInt(e.target.value));
                  }}
                  className="bg-[#1C1C24] border-purple-500/20 focus:border-purple-500"
                />
              </div>

              {stockType === "limit" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-200">
                    Price(₹) : {Math.floor(price / 10)}.{price % 10}
                  </label>
                  <Input
                    type="range"
                    min={1}
                    max={99}
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="bg-[#1C1C24] outline-none cursor-pointer accent-purple-600 border-0 focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              className={`h-14 text-lg rounded-lg shadow-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600`}
              onClick={() => {
                handleTrade("yes");
              }}
            >
              {/* <ArrowUp className="mr-2 h-5 w-5" /> */}
              Yes ₹{selectedQuestion.yesClosing / 10}
            </Button>

            <Button
              type="button"
              className={`h-14 text-lg rounded-lg shadow-lg bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600`}
              onClick={() => {
                handleTrade("no");
              }}
            >
              {/* <ArrowDown className="mr-2 h-5 w-5" /> */}
              No ₹{(100 - selectedQuestion.yesClosing) / 10}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingForm;
