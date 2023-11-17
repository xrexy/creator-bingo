// https://github.com/AntonioErdeljac/next13-trello/blob/master/components/form/form-errors.tsx

"use client";

import { XCircle } from "lucide-react";

interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormErrors = ({ id, errors }: FormErrorsProps) => {
  if (!errors) {
    return null;
  }

  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
    >
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className="flex items-center p-2 font-medium border rounded-sm border-rose-500 bg-rose-500/10"
        >
          <XCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      ))}
    </div>
  );
};
