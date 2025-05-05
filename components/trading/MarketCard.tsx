import { TrendingUpIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Question } from "./Trading";

interface MarketCardProps {
  question: Question;
  onClick: (question: Question) => void;
  className: string;
}

const MarketCard = ({ question, onClick, className }: MarketCardProps) => (
  <div
    className={`p-4 rounded-xl flex flex-col justify-between ${className}`}
    onClick={() => onClick(question)}
  >
    <div>
      <div className="flex justify-between items-center align-middle ">
        {" "}
        <Badge
          variant={"outline"}
          className="text-sm bg-emerald-100 text-emerald-800  shadow-[0_0_10px_rgba(0,255,255,0.5)] rounded-full"
        >
          {/* <Users className="size-4" /> */}
          volume: {question.volume / 10}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-red-400 flex justify-center align-middle items-center gap-2">
              <TrendingUpIcon className="size-5" />
              <div className="w-full flex justify-center align-middle items-center ">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                Live{" "}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-orange-300 text-black">
              Ending In 3:47 min
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex justify-between items-start my-3 gap-1.5">
        <h3 className="font-medium text-purple-50">{question.title}</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            question.trend === "hot"
              ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/20"
              : question.trend === "trending"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20"
              : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20"
          }`}
        >
          {question.trend?.toUpperCase()}
        </span>
      </div>
    </div>
    <div>
      <div className="h-4 w-full flex overflow-hidden rounded-full mb-3">
        <div
          style={{ width: `${question.yesClosing}%`, maxWidth: "100%" }}
          className="h-full bg-green-400"
        ></div>
        <div
          style={{ width: `${100 - question.yesClosing}%`, maxWidth: "100%" }}
          className="h-full w-[50%] bg-red-400"
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-green-400">Yes: ₹{question.yesClosing / 10}</span>
        <span className="text-red-400">
          No: ₹{10 - question.yesClosing / 10}
        </span>
      </div>
    </div>
  </div>
);

export default MarketCard;
