"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function LibrarySearchHeader({ query }: { query: string }) {
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
    <div className="w-full sm:w-100 mx-auto px-4 pb-4">
      <InputGroup className="bg-background">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput onChange={onSearchBoxChange} defaultValue={query} />
        <InputGroupButton></InputGroupButton>
      </InputGroup>
    </div>
  );
}
