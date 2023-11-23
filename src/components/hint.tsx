import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { desc } from "drizzle-orm";

export type HintProps = {
  content: string | React.ReactNode;

  children?: React.ReactNode;
  delayDuration?: number;
  sideOffset?: number;
  description?: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function Hint({
  children: _children,
  content,
  sideOffset,
  delayDuration = 0,
  description,
  side,
}: HintProps) {
  const children = _children ?? (
    <>
      {description ? (
        <div className="flex items-center gap-x-2">
          <QuestionMarkCircleIcon
            height={16}
            width={16}
            className="text-sky-400"
          />
          {description}
        </div>
      ) : (
        <QuestionMarkCircleIcon
          height={16}
          width={16}
          className="text-sky-400"
        />
      )}
    </>
  );

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

