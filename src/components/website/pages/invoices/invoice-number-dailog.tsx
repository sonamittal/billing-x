"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    mode: "manual" | "auto";
    prefix: string;
    nextNumber: string;
    invoiceNumber: string;
  }) => void;
}

const InvoiceNumberDialog = ({ open, onOpenChange, onSave }: Props) => {
  const [invoiceMode, setInvoiceMode] = useState<"manual" | "auto">("manual");
  const [prefix, setPrefix] = useState("INV");
  const [nextNumber, setNextNumber] = useState("1001");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-125">
        <DialogHeader>
          <DialogTitle>Configure Invoice Number Preferences</DialogTitle>
          <DialogDescription className="mt-2">
            You have selected manual invoice numbering. Do you want us to
            auto-generate it for you?
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={invoiceMode}
          onValueChange={(value) => setInvoiceMode(value as "manual" | "auto")}
          className="gap-5 mt-3"
        >
          {/* Auto*/}
          <div className="flex items-center gap-2">
            <RadioGroupItem value="auto" id="auto" />
            <Label htmlFor="auto">
              Continue auto-generating invoice numbers
            </Label>
          </div>
          {invoiceMode === "auto" && (
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input
                  id="prefix"
                  placeholder="INV"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextNumber">Next Number</Label>
                <Input
                  id="nextNumber"
                  type="number"
                  placeholder="00001"
                  value={nextNumber}
                  onChange={(e) => setNextNumber(e.target.value)}
                />
              </div>
            </div>
          )}
          {/* Manual */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual">Enter invoice numbers manually</Label>
          </div>
        </RadioGroup>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3">
          <Button
            onClick={() => {
              const formattedNumber =
                invoiceMode === "auto"
                  ? `${prefix}-${nextNumber.padStart(5, "0")}`
                  : "";
              onSave({
                mode: invoiceMode,
                prefix,
                nextNumber,
                invoiceNumber: formattedNumber,
              });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceNumberDialog;
