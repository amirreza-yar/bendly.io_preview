"use client";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // console.log("sw registered!");
          // console.log(reg);
        })
        .catch((error) => {
          // console.log("sw reg failed!");
          // console.log(error);
        });
    }
  }, []);

  const [tabVal, setTabVal] = useState("page-1");

  return redirect("/dashboard");

  return (
    <div className="fixed bottom-0 top-0 left-0 right-0 h-screen w-screen">
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
      <div className="fixed top-0 w-full">
        <h6 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-primary-foreground">
          Bendly
        </h6>

        <Logo className="absolute text-primary-foreground top-4 left-4 size-5" />
      </div>

      <div className="fixed w-full top-14 bottom-0">
        <Tabs className="h-full" value={tabVal} onValueChange={setTabVal}>
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
              <TabsContent
                key="page-1"
                value="page-1"
                className="h-full w-full"
              >
                <div className="h-full flex flex-col justify-center">
                  <div className="grow w-full relative flex items-center justify-center">
                    <Image
                      src="/images/welcome-1.svg"
                      alt="welcome-1"
                      height={0}
                      width={0}
                      className="w-full h-auto max-w-100 py-12 px-14"
                    />
                  </div>
                  <div className="text-white px-10 pb-10 mx-auto">
                    <h1 className="text-4xl font-black">
                      Draw It
                      <br />
                      Web Build It.
                    </h1>
                    <p className="text-base pt-2">
                      Create precise flashing designs in minutes
                    </p>
                    <div className="pt-9 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" className="mb-1 -mr-1">
                          Skip
                        </Button>
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="h-3 w-3 rounded-full bg-white" />
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                      <Button
                        onClick={() => setTabVal("page-2")}
                        size="icon-lg"
                        className="w-12 h-12"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="page-2"
                key="page-2"
                className="h-full w-full"
              >
                <div className="h-full flex flex-col justify-center">
                  <div className="grow w-full relative flex items-center justify-center">
                    <Image
                      src="/images/welcome-1.svg"
                      alt="welcome-1"
                      height={0}
                      width={0}
                      className="w-full h-auto max-w-100 py-12 px-14"
                    />
                  </div>
                  <div className="text-white px-10 pb-10 mx-auto">
                    <h1 className="text-4xl font-black">
                      Draw It 2
                      <br />
                      Web Build It.
                    </h1>
                    <p className="text-base pt-2">
                      Create precise flashing designs in minutes
                    </p>
                    <div className="pt-9 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" className="mb-1 -mr-1">
                          Skip
                        </Button>
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                      <Button size="icon-lg" className="w-12 h-12">
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
