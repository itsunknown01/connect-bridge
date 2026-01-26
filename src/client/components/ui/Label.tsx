import * as React from "react";
import { cn } from "../../lib/utils";

const labelVariants = {
  base: "text-sm font-medium leading-none",
  disabled: "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
};

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: keyof typeof labelVariants;
}

const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef(({ className, variant = "base", ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants[variant])} {...props} />
));

Label.displayName = "Label";

export { Label };