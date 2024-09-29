"use client";
import { useContext, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import toast from "react-hot-toast";
import { SocketContext } from "./Wrapper";

const MessageInput = ({
  sendMessage,
  setType,
  handleNewChat,
}: {
  sendMessage: (message: string) => void;
  setType: any;
  handleNewChat: any;
}) => {
  const [message, setMessage] = useState("");
  const { activeChat, loadingResponse, setActiveChat } =
    useContext(SocketContext);

  return (
    <>
      <div className="flex flex-col items-center justify-between w-full">
        <form
          className="w-full"
          onSubmit={(e) => {
            if (loadingResponse) return;
            e.preventDefault();
            sendMessage(message);
            setMessage("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !loadingResponse) {
              e.preventDefault();
              sendMessage(message);
              setMessage("");
            }
          }}
        >
          <div className="flex w-full h-full gap-3 px-2">
            <div className="flex justify-center items-center">
              <button
                onClick={handleNewChat}
                disabled={activeChat?.length === 0 || loadingResponse}
                className="size-[22px] "
              >
                <Image
                  className=""
                  src={"/add.svg"}
                  width={22}
                  height={22}
                  alt="add"
                />
              </button>
            </div>
            <TextareaAutosize
              disabled={loadingResponse}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="bg-[#FAFCF8] border border-[#DFE2E8] rounded-md resize-none min-h-10 pt-1.5 max-h-12 focus:outline-none w-full px-2"
              placeholder={"Ask a question..."}
            />
            <div className="flex justify-center items-center">
              <button
                disabled={message.trim().length === 0 || loadingResponse}
                className="size-[22px] "
              >
                {/* <ArrowUp className="bg-background" size={17} /> */}
                <Image
                  className=""
                  src={"/send.svg"}
                  width={22}
                  height={22}
                  alt="send"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default MessageInput;
