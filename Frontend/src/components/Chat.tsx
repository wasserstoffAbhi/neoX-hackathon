"use client";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { SocketContext } from "./Wrapper";
const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const Chat = ({
  sendMessage,
  type,
  setType,
  handleNewChat,
}: {
  sendMessage: (message: string) => void;
  type: string | null;
  setType: (val: string | null) => void;
  handleNewChat: any;
}) => {
  const { activeChat, setActiveChat } = useContext(SocketContext);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
    scrollToBottom();

    if (activeChat?.length === 1) {
      document.title = `ChatBot`;
    }
  }, [activeChat]);

  const handleClick = (val: string) => {
    setType(val);
    setActiveChat([
      {
        value:
          val === "Wallet"
            ? `Enter the wallet address, you want to query out?`
            : val === "Transactions"
            ? `Enter the Transaction ID, you want to query out?`
            : "Ask anyting aboout NeoX",
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col justify-between px-2 gap-2">
      <div
        className="flex flex-col w-ull gap-2 overflow-y-auto overflow-x-hidden overflow-hidden-scrollable"
        ref={chatContainerRef}
      >
        {activeChat?.length > 0 ? (
          activeChat?.map((msg: any, i: number) => {
            const isLast = i === activeChat.length - 1;
            return (
              <div key={i} className="">
                <MessageBox index={i} message={msg} isLast={isLast} />
              </div>
            );
          })
        ) : (
          <div className="h-[100vh] flex flex-col gap-5 justify-center items-center">
            <div>
              <Image alt="bot" src={"/bot.svg"} width={130} height={104} />
            </div>
            <p
              className={`${montserrat.className} font-semibold text-[#23232380] opacity-50 text-center text-[24px]`}
            >
              Let's Chat
            </p>
            <div className="border border-[#DFE2E8] max-w-screen-md p-5 w-[90%] rounded-[16px] flex flex-col gap-5">
              {["Wallet", "Transactions", "NeoX"]?.map((el, i) => (
                <div
                  key={i}
                  onClick={() => handleClick(el)}
                  className="border border-[#DFE2E8] bg-[#FAFCF8] p-3 rounded-[12px]"
                >
                  <p className="text-[#6F7380] text-center">{el}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={messageEnd} className="h-0" />
      {activeChat?.length > 0 && (
        <div className="bottom-5 flex gap-1 flex-col pt-3 bg-[#EDF2E4] sticky w-full z-40">
          <MessageInput handleNewChat={handleNewChat} sendMessage={sendMessage} setType={setType} />
        </div>
      )}
    </div>
  );
};

export default Chat;
