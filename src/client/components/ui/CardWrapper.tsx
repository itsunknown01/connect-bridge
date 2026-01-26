import React from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";

export interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const CardWrapper = ({ children, className }: CardWrapperProps) => {
  return (
    <Card className={cn("w-full max-w-2xl border-none shadow-2xl", className)}>
      {children}
    </Card>
  );
};

export default CardWrapper;
