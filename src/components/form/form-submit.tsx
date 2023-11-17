import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/button";

type FormSubmitProps = {
  children: React.ReactNode;
} & Partial<{
  id: string;
  disabled: boolean;
  className: string;
  title?: string;
  variant: ButtonVariant;
  size: ButtonSize;
}>;

export const FormSubmit = ({
  children,
  disabled,
  className,
  id,
  title,
  size = "sm",
  variant = "default",
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      id={id}
      title={title}
      disabled={pending || disabled}
      type="submit"
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {children}
    </Button>
  );
};

