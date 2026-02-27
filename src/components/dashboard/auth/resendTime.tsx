"use client";

import { Button } from "@/components/ui/button";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const RESEND_TIMEOUT = Number(process.env.NEXT_PUBLIC_RESEND_TIMEOUT ?? 60);

export interface CodeResendTimeHandle {
  resetTimer: () => void;
}

interface Props {
  onResendHandler: () => void;
}

export const CodeResendTime = forwardRef<CodeResendTimeHandle, Props>(
  ({ onResendHandler }, ref) => {
    const [resendTimer, setResendTimer] = useState<number>(RESEND_TIMEOUT);
    const intervalRef = useRef<number | null>(null);

    const startTimer = () => {
      setResendTimer(RESEND_TIMEOUT);
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = window.setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    };

    // Cleanup
    useEffect(() => {
      startTimer();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, []);

    // Expose reset function to parent
    useImperativeHandle(ref, () => ({
      resetTimer: startTimer,
    }));

    return (
      <Button
        // className="text-blue-600 text-xs disabled:text-gray-400"
        onClick={onResendHandler}
        disabled={resendTimer > 0}
        size="lg"
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
      </Button>
    );
  },
);

CodeResendTime.displayName = "CodeResendTime";
