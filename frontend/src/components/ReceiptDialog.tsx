import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Receipt {
  orderId: string;
  timestamp: string;
  customerInfo: {
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: string;
  status: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
}

export const ReceiptDialog = ({ open, onOpenChange, receipt }: ReceiptDialogProps) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle2 className="h-16 w-16 text-success" />
            <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Order #{receipt.orderId.slice(0, 8)}
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <p className="text-sm text-muted-foreground">{receipt.customerInfo.name}</p>
            <p className="text-sm text-muted-foreground">{receipt.customerInfo.email}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Order Items</h4>
            <div className="space-y-2">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${receipt.total}</span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            A confirmation email has been sent to {receipt.customerInfo.email}
          </p>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
