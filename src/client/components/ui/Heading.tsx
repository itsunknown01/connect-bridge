import { cn } from "../../lib/utils";

interface HeadingProps {
  className?: string;
  title?: string;
  description?: string;
}

const Heading = ({ title, description, className }: HeadingProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center gap-y-4",
        className
      )}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className=" text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Heading;
