"use client";

import { MutableRefObject, useContext } from "react";
import ThreeDotLoader from "./ThreeDotLoader";
import Image from "next/image";
import moment from "moment";
import Markdown from "markdown-to-jsx";
import { SocketContext } from "./Wrapper";
import { cn } from "../libs/utils";

const MessageBox = ({
  message,
  dividerRef,
  isLast,
  index,
}: {
  message: any;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
  index: number;
}) => {
  const { loadingResponse } = useContext(SocketContext);

  return (
    <div className="flex flex-col gap-4 dark:bg-dark-800 pt-2">
      {index % 2 === 1 && (
        <div className="flex flex-col w-full flex-grow space-y-9 lg:space-y-0 lg:flex-row lg:justify-between lg:space-x-9">
          <div
            ref={dividerRef}
            className="flex flex-grow flex-col space-y-6 w-full"
          >
            {message?.value && (
              <div className="flex gap-1 flex-col w-[80%] ml-auto">
                <div className="rounded-2xl text-wrap rounded-br-md bg-[#465235] text-white dark:bg-dark-600 p-3 flex flex-col gap-2">
                  {/* <p
                    style={{ wordBreak: "break-word", hyphens: "auto" }}
                    className="text-wrap w-full"
                  >
                    {message?.value ?? ""}
                  </p> */}
                  <Markdown
                    className={cn(
                      "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                      "max-w-none break-words  text-black dark:text-[#B8B8B8] text-sm md:text-base font-medium"
                    )}
                  >
                    {message?.value ?? ""}
                  </Markdown>
                </div>
                <p className="text-sm text-[#6F7380] text-right">
                  {moment(message?.createdAt).format("LT")}
                </p>
              </div>
            )}
            <div className="ml-10">
              {isLast && loadingResponse && <ThreeDotLoader />}
            </div>
          </div>
        </div>
      )}
      {index % 2 === 0 && (
        <div className="flex flex-col gap-1 w-[80%] mr-auto">
          <div className={`flex flex-row w-full gap-2 items-end space-x-1`}>
            <div className="w-[25px] h-[25px]">
              <Image alt="user" src={"/User.svg"} width={25} height={25} />
            </div>
            {/* <p
              style={{ wordBreak: "break-word", hyphens: "auto" }}
              className={`w-full resize-none text-wrap bg-[#FAFCF8] font-poppins font-normal text-md dark:bg-dark-600 text-black dark:text-dark-100 text-start p-2 outline-none rounded-2xl rounded-bl-md ${
                false && "border-2 border-[#24A0ED]"
              }`}
            >
              {message?.value}
            </p> */}
            <Markdown
              className={cn(
                "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                "max-w-none break-words w-full  bg-[#FAFCF8] font-poppins font-normal text-md dark:bg-dark-600 text-black dark:text-dark-100 text-start p-2 outline-none rounded-2xl rounded-bl-md"
              )}
            >
              {message?.value ?? ""}
            </Markdown>
          </div>
          <p className="text-sm text-[#6F7380] ml-10">
            {moment(message?.createdAt).format("LT")}
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
