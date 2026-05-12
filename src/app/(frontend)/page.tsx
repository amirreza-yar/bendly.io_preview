"use client";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/utilities/ui";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const images = [
      "/images/welcome-1.svg",
      "/images/welcome-2.svg",
      "/images/welcome-3.svg",
    ];

    Promise.all(
      images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();

          img.src = src;

          img.onload = resolve;
          img.onerror = reject;
        });
      }),
    ).then(() => {
      setIsReady(true);
    });
  }, []);

  const [tabVal, setTabVal] = useState("page-1");

  const router = useRouter();

  const onNextPage = () => {
    if (tabVal === "page-1") setTabVal("page-2");
    else if (tabVal === "page-2") setTabVal("page-3");
    else if (tabVal === "page-3") router.replace("/auth");
  };

  const onSkip = () => {
    router.replace("/auth");
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 h-screen w-screen">
        <div className="fixed top-0 w-full h-full bg-gradient-to-t from-[#132a55] to-[#295cbb]">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-screen h-screen inset-0 flex items-center justify-center"
        >
          <Spinner
            className={cn(
              "size-5 text-primary-foreground size-8",
              isReady ? "hidden" : "",
            )}
          />
        </motion.div>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-screen h-screen inset-0"
        >
          <div className={cn("fixed top-0 w-full", isReady ? "" : "hidden")}>
            <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
              Bendly
            </h6>

            <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />
          </div>

          <div
            className={cn(
              "fixed w-full top-14 bottom-0",
              isReady ? "" : "hidden",
            )}
          >
            <div
              className="flex flex-col h-full justify-center items-center max-h-220"
              // value={tabVal}
              // onValueChange={setTabVal}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={tabVal}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={{
                    initial: { x: 12, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    exit: { x: -12, opacity: 0 },
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="h-full"
                >
                  <div
                    key="page-1"
                    className={cn(
                      "h-full w-full",
                      tabVal === "page-1" ? "block" : "hidden",
                    )}
                  >
                    <div className="h-full flex flex-col justify-around items-around">
                      <div className="w-full flex items-center justify-center">
                        <Image
                          priority
                          src="/images/welcome-1.svg"
                          alt="welcome-1"
                          height={0}
                          width={0}
                          className="w-full max-w-100 max-h-full [@media(max-height:550px)]:max-h-65 py-6"
                        />
                      </div>
                      <div className="text-white mx-auto">
                        <h1 className="text-4xl xs:text-5xl font-black">
                          Draw It
                          <br />
                          Web Build It.
                        </h1>
                        <p className="text-base pt-2">
                          Create precise flashing designs in minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    key="page-2"
                    className={cn(
                      "h-full w-full",
                      tabVal === "page-2" ? "block" : "hidden",
                    )}
                  >
                    <div className="h-full flex flex-col justify-center">
                      <div className="text-white px-10 [@media(max-height:600px)]:pt-14 pt-18 mx-auto">
                        <h1 className="text-4xl xs:text-5xl font-black">
                          Shape It
                          <br />
                          In Your Way
                        </h1>
                        <p className="text-base pt-2">
                          Adjust angles, dimensions, and every detail
                        </p>
                      </div>
                      <div className="grow w-full relative flex items-center justify-center">
                        <Image
                          priority
                          src="/images/welcome-2.svg"
                          alt="welcome-1"
                          height={0}
                          width={0}
                          className="w-full max-w-120 px-10 max-h-full [@media(max-height:600px)]:max-h-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    key="page-3"
                    className={cn(
                      "h-full w-full",
                      tabVal === "page-3" ? "block" : "hidden",
                    )}
                  >
                    <div className="h-full flex flex-col justify-center">
                      <div className="text-white px-10 pt-18 mx-auto">
                        <h1 className="text-4xl xs:text-5xl font-black">
                          Ready to Draw
                          <br />
                          Your Flashing?
                        </h1>
                        <p className="text-base pt-2">
                          Sign in and draw your shape in a simple process
                        </p>
                      </div>
                      <div className="grow w-full relative flex items-center justify-center">
                        <Image
                          priority
                          src="/images/welcome-3.svg"
                          alt="welcome-1"
                          height={0}
                          width={0}
                          className="w-full max-w-75 max-h-full [@media(max-height:600px)]:max-h-50 lg:max-w-80 py-8 px-10"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center justify-between px-12 max-w-150 w-full pb-10"
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="mb-1 -mr-1 text-primary-foreground"
                      onClick={onSkip}
                    >
                      Skip
                    </Button>
                    <div
                      className={cn(
                        "transition-all h-3 w-3 rounded-full",
                        tabVal === "page-1" ? "bg-primary" : "bg-white",
                      )}
                    />
                    <div
                      className={cn(
                        "transition-all h-3 w-3 rounded-full",
                        tabVal === "page-2" ? "bg-primary" : "bg-white",
                      )}
                    />
                    <div
                      className={cn(
                        "transition-all h-3 w-3 rounded-full",
                        tabVal === "page-3" ? "bg-primary" : "bg-white",
                      )}
                    />
                  </div>
                  <Button
                    onClick={onNextPage}
                    size="lg"
                    className="h-12 transition-all"
                  >
                    <AnimatePresence mode="wait">
                      {tabVal === "page-3" && (
                        <motion.span
                          key="get-started" // important: key triggers exit+enter
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block"
                        >
                          Get Started
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <ChevronRight className="size-5" />
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
