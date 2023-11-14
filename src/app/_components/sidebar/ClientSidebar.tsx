"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";

export function ClientSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className="block w-6 text-gray-400" />
        ) : (
          <Bars3Icon className="block w-6 text-gray-400" />
        )}
      </button>

      <div
        className={clsx("overflow-y-auto lg:static lg:block", {
          "fixed inset-x-0 bottom-0 top-14 mt-px bg-black": isOpen,
          hidden: !isOpen,
        })}
      >
        <h1 className="h-[150vh]">hi</h1>
      </div>
    </>
  );
}

