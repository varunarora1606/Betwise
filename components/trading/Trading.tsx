"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import MarketCard from "@/components/trading/MarketCard";
import TradingForm from "@/components/trading/TradingForm";
import SelectedMarket from "@/components/trading/SelectedMarket";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface Question {
  symbol: string;
  title: string;
  yesClosing: number;
  volume: string;
  endTime: number;
  trend?: "hot" | "trending" | "new";
}

interface MarketDetails {
  Question: string;
  YesClosing: number;
  Volume: string;
  EndTime: number;
  Trend?: "hot" | "trending" | "new";
}

export interface SideBook {
  price: number;
  quantity: number;
  betId: string[]; //betId And make it array
}

export interface OrderBook {
  yes: SideBook[];
  no: SideBook[];
}

// export interface Order {
//   id: string;    //betId And make it array
//   side: "yes" | "no";
//   price: number;
//   quantity: number;
// }

const Trading = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/order/markets", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data);
        const data: Map<string, MarketDetails> = res.data.data.markets;
        console.log(data);
        const newQuestions: Question[] = Object.entries(data).map(
          ([symbol, marketDetails]: [string, MarketDetails]) => ({
            symbol,
            title: marketDetails.Question,
            yesClosing: marketDetails.YesClosing,
            volume: marketDetails.Volume,
            endTime: marketDetails.EndTime,
          })
        );

        console.log(newQuestions);
        setQuestions(newQuestions);
      });

    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Opinion Trading
          </h1>
          <Button
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
          >
            <Link href="/portfolio">View Portfolio</Link>
          </Button>
        </div>

        {!selectedQuestion ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question, idx) => {
              question.trend =
                idx % 3 == 0 ? "trending" : idx % 3 == 1 ? "new" : "hot";
              return (
                <MarketCard
                  key={question.symbol}
                  question={question}
                  onClick={setSelectedQuestion}
                  className="cursor-pointer transition-all bg-gradient-to-br from-[#1C1C24] to-[#1C1C24]/80 hover:from-purple-900/20 hover:to-purple-800/20 border border-purple-500/10"
                />
              );
            })}
          </div>
        ) : (
          <div className="flex gap-6 w-full flex-col md:flex-row">
            <SelectedMarket
              question={selectedQuestion}
              transactionType={transactionType}
              onBack={() => setSelectedQuestion(null)}
            />
            <TradingForm
              selectedQuestion={selectedQuestion}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Trading;