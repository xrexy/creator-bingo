"use client";

import { initOauthLogin } from "@/app/_actions/initOauthLogin";
import { Creator } from "@/app/client.types";
import { FormSubmit } from "@/components/form/form-submit";

export type RefreshTokenFormProps = {
  creator: Creator;
  userId: string;
};

export function RefreshTokenForm({}: RefreshTokenFormProps) {
  return (
    <form action={() => initOauthLogin("GOOGLE")}>
      <FormSubmit size="sm">Regenerate</FormSubmit>
    </form>
  );
}

export default RefreshTokenForm;

