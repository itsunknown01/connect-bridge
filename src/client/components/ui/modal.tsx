import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./dialog";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  footer,
  className,
}: ModalProps) => {
  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={className ? className : "sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle className="text-[#12372A] dark:text-[#ADBC9F]">
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
