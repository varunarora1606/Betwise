import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

interface AddMoneyDialogProps {
  onAddMoney: (amount: number) => void;
}

const AddMoneyDialog = ({ onAddMoney }: AddMoneyDialogProps) => {
  const { getToken } = useAuth();
  const [amount, setAmount] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const token = await getToken({ template: "my-jwt" });

    if (token) {
      try {
        await axios.post(
          "http://localhost:8000/api/v1/order/on-ramp-inr",
          {
            quantity: amount * 10,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        onAddMoney(amount);
        setAmount(0);
        setIsOpen(false);
        toast.success(`₹${amount.toLocaleString()} added to your wallet!`);
      } catch (error) {
        toast.error("Payment failed", {
          description:
            "There was an error processing your payment. Please try again.",
          icon: <X className="h-5 w-5 text-red-500" />,
        });
      }
    } else {
      toast.error("Unauthorized access", {
        description: "Unauthorized access: Please login",
        icon: <X className="h-5 w-5 text-red-500" />,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500">
          <Wallet className="mr-2" size={18} />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#13131A] border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-purple-300">
            Add Money to Wallet
          </DialogTitle>
          <DialogDescription className="text-purple-100/70">
            Enter the amount you want to add to your trading wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-purple-200">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
                ₹
              </span>
              <Input
                type="text"
                placeholder="1000"
                value={amount}
                onChange={(e) => {
                  if (e.target.value == "") {
                    setAmount(undefined);
                    return;
                  }
                  setAmount(parseInt(e.target.value));
                }}
                className="pl-8 bg-purple-900/20 border-purple-500/30 text-white"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-purple-300 hover:text-purple-100 hover:bg-purple-900/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMoney}
            className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500"
          >
            Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;
