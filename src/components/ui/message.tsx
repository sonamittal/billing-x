"use client";
import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/index";
import { cva } from "class-variance-authority";

// CSS variant >>>>>>>>>>
const messageVariants = cva("flex gap-2 items-center p-3 rounded scroll-m-3", {
  variants: {
    variant: {
      default: "bg-positive text-positive-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MessageProps {
  message?: string;
  variant?: "default" | "destructive";
  className?: string;
}

const Message: React.FC<MessageProps> = ({ className, variant, message }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (!isInViewport) {
        messageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={messageRef}
      className={cn(messageVariants({ variant }), className)}
    >
      <AlertCircle className="h-4 w-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Message;
