"use client";

import { ArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function ProjectsHeaderWithSearch() {
  const query = useSearchParams().get("query") ?? "";

  const [isSearchTab, setIsSearchTab] = useState<boolean>(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function onSearchBoxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        router.replace(`?q=${value}`);
      });
    }, 400);
  }

  return (
    <div className="fixed top-0 w-full">
      {isSearchTab ? (
        <>
          <div className="absolute top-3 left-3 right-7 flex gap-2 items-center mx-auto md:max-w-180">
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-primary-foreground hover:bg-transparent hover:text-primary-light"
              onClick={() => setIsSearchTab(false)}
            >
              <ArrowLeft />
            </Button>

            <InputGroup className="bg-background">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                onChange={onSearchBoxChange}
                defaultValue={query}
              />
              <InputGroupButton></InputGroupButton>
            </InputGroup>
          </div>
        </>
      ) : (
        <>
          <h6 className="absolute top-5 left-5 text-primary-foreground">
            Projects
          </h6>

          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-3 top-3 text-primary-foreground hover:bg-transparent hover:text-primary-light"
            onClick={() => setIsSearchTab(true)}
          >
            <Search />
          </Button>
        </>
      )}
    </div>
  );
}
