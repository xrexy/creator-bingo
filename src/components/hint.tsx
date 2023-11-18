import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "./ui/tooltip";
import { PlusIcon } from "lucide-react";

export type HintProps = {
  content: string | React.ReactNode;

  children?: React.ReactNode;
  delayDuration?: number;
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
};

export function Hint({
  children = (
    <QuestionMarkCircleIcon
      height={16}
      width={16}
      className="text-sky-400"
    />
  ),
  content,
  sideOffset,
  delayDuration = 0,
  side,
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className={
            typeof content === "string"
              ? "max-w-[240px] text-left text-xs break-words"
              : undefined
          }
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Hint;

