import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button, ButtonProps, ButtonSize, ButtonVariant } from "@/components/ui/button";

type FormSubmitProps = {
  children: React.ReactNode;
} & Partial<{
  id: string;
  disabled: boolean;
  className: string;
  title?: string;
  variant: ButtonVariant;
  size: ButtonSize;
  formAction: ButtonProps['formAction'];
  onClick: ButtonProps['onClick'];
}>;

export const FormSubmit = ({
  children,
  disabled,
  className,
  id,
  title,
  formAction,
  size = "sm",
  variant = "default",
  onClick,
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      onClick={onClick}
      formAction={formAction}
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

