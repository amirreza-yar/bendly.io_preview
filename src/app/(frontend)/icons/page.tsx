"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Download, icons, Search } from "lucide-react";
import { useState } from "react";

function downloadSVG(name: string) {
  //   const svg = document.querySelector(`#icon-${name} svg`);
  const svg = document.getElementById(`icon-${name}`);
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);

  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.svg`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function IconsPage() {
  const [query, setQuery] = useState<string>("");

  const iconsList = Object.entries(icons).filter(([name]) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col lg:p-8 md:p-6 sm:p-4 p-2 pt-4 gap-6">
      <div className="flex sm:flex-row flex-col items-center justify-between gap-4">
        <h3 className="truncate text-xl font-bold">Lucide Icons</h3>
        <InputGroup className="sm:max-w-80 w-full">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>
      <div className="grid xl:grid-cols-22 lg:grid-cols-18 md:grid-cols-14 sm:grid-cols-10 xs:grid-cols-8 grid-cols-6 lg:gap-6 md:gap-4 gap-2">
        {iconsList.map(([name, Icon]) => (
          <Dialog key={name}>
            <DialogTrigger asChild>
              <Button size="icon-lg" variant="secondary" className="bg-gray-50">
                <Icon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle />
              <div className="flex justify-between items-center">
                <div className="bg-gray-100 p-2 rounded-md">
                  <Icon id={`icon-${name}`} className="size-24" />
                </div>
                <div className="flex flex-col gap-2">
                  <h5 className="text-lg">{name}</h5>
                  <Button size="sm" onClick={() => downloadSVG(name)}>
                    <Download />
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
