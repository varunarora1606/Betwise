"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import React, { ReactNode, useState } from "react";

import {
  useamountincdecStore,
  useTradingCardStore,
} from "../store/atoms/TradingCradState";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

interface SheetTriggerProps {
  buttonprop: string;
  children?: ReactNode;
  SheetTriggerclassName: string;
}

const Sheettrigger = ({
  buttonprop,
  children,
  SheetTriggerclassName,
}: SheetTriggerProps) => {
  const { noOfTraders, title, description } = useTradingCardStore();
  const [val,setVal] = useState(50)
  const [quantity,setQuantity] = useState(1)
  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          "bg-black text-white   rounded-lg h-10",
          SheetTriggerclassName
        )}
      >
        {buttonprop}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {title}
            <Badge
              variant={"outline"}
              className="text-sm bg-emerald-100 text-emerald-800  shadow-[0_0_10px_rgba(0,255,255,0.5)] rounded-full"
            >
              <Users className="size-4" />
              {noOfTraders} Traders
            </Badge>
          </SheetTitle>

          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {/* /////////////// HERE WE WILL ADD TABS FOR TRIGGERING YES AND NO CHART///////////////////////////////// */}

        <div className="tabs_here w-full mt-9">
          <Tabs defaultValue="Yes" className="w-full ">
            <TabsList className="w-full h-10 ">
              <TabsTrigger className="w-full h-8" value="Yes">
                YES
              </TabsTrigger>
              <TabsTrigger className="w-full h-8" value="No">
                No
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Yes">
              <div className="text-sm flex gap-2 w-full justify-center mt-3">
                <span className="py-2 px-4 cursor-pointer bg-[#1F2937] rounded-tl-2xl rounded-tr-2xl">Market</span>
                <span className="p-2 cursor-pointer">Limit</span>
              </div>
              <Card className="bg-[#1F2937] border-0 pt-6 w-full">
                <CardContent>
                  <div className="w-full">
                    <CardDescription className="flex justify-between align-middle items-center ">
                      <span>Price</span>
                      <span className="">{val}</span>
                    </CardDescription>
                    <div className="money_change p-3 flex justify-between align-middle items-center w-full">
                      <div className="inc text-white cursor-pointer hover:bg-black p-1 rounded-full" onClick={() => setVal(val-1)}>
                        <Minus className=" size-5" />
                      </div>
                      <div className="w-full flex justify-center mx-2">
                        <input type="range" className="w-full" value={val} onChange={(e) => setVal(parseInt(e.target.value))} max={99} min={1}/>
                      </div>
                      <div className="dec text-white cursor-pointer hover:bg-black p-1 rounded-full" onClick={() => setVal(val+1)}>
                        <Plus className="size-5" />
                      </div>
                    </div>
                    <CardDescription className="flex justify-between align-middle items-center ">
                      <span>Quantity</span>
                      <span className="">{quantity}</span>
                    </CardDescription>
                    <div className="money_change p-3 flex justify-between align-middle items-center w-full">
                      <div className="inc text-white cursor-pointer hover:bg-black p-1 rounded-full" onClick={() => setQuantity(quantity-1)}>
                        <Minus className=" size-5" />
                      </div>
                      <div className="w-full flex justify-center mx-2 text-black">
                        <input type="text" className="w-full outline-none" value={quantity} onChange={(e) => {
                          if (e.target.value == "") {
                            setQuantity(0)
                            return
                          }
                          setQuantity(parseInt(e.target.value)
                        )}}/>
                      </div>
                      <div className="dec text-white cursor-pointer hover:bg-black p-1 rounded-full" onClick={() => setQuantity(quantity+1)}>
                        <Plus className="size-5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="No">This is No triggered</TabsContent>
          </Tabs>
        </div>
      </SheetContent>
      {children}
    </Sheet>
  );
};

export default Sheettrigger;

// things I need in the sheet here is
{
  /* 
    
   1: I need the title
   2: I need the description
   3: I need two buttons/or Tabs that trigger the chart or the yes no details like quantity price win etc.
   4: then i need a card telling me these details
         4.1: a price tag and a button changing the price.
         4.2: I need the quantity tab, which is telling me how much quantity of stock i need to put my money on
         4.3: It will tell the amoount of money i am putting and the no.of stocks i am putting in
  

    */
}
