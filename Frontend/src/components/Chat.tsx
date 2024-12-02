"use client";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Message, SocketContext } from "./Wrapper";
import { useRouter } from "next/navigation";
import { fillWallet, getNeoXResponse, getTransactionInfo, getTransactionResponse, getWalletResponse } from "../backendServices/userServices";
const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const regex64 = /0x[a-fA-F0-9]{64}/;
const regex32 = /0x[a-fA-F0-9]{32}/;

const Chat = ({
  // sendMessage,
  type,
  // setType,
  chatId,
  // handleNewChat,
}: {
  // sendMessage: (message: string) => void;
  type: string | null;
  // setType: (val: string | null) => void;
  chatId: string;
  // handleNewChat: any;
}) => {
  // const { activeChat, setActiveChat } = useContext(SocketContext);
  const [isTransction, setIsTransaction] = useState(false);
  const [data, setData] = useState(null);
  const {
    socketObj,
    setSocketObj,
    activeChat,
    setActiveChat,
    loadingResponse,
    setLoadingResponse,
  } = useContext(SocketContext);
  const setMessage = (answer: string, newActiveChat: any) => {
    setLoadingResponse(true);
    newActiveChat.push({
      value: answer,
      createdAt: new Date(),
    });
    setLoadingResponse(false);
    setActiveChat(newActiveChat);
  };

  const sendMessage = async (message: string) => {
    if (loadingResponse) return;
    let newActiveChat: Message[] = [...activeChat];
    // if (activeChat?.length === 1) {
    if (type === "Wallet") {
      // if (!regex32.test(message))
      //   return toast.error(
      //     "Invalid wallet address, Type only 32 digit wallet address."
      //   );
      setLoadingResponse(true);
      newActiveChat.push({
        value: message,
        createdAt: new Date(),
      });
      setActiveChat(newActiveChat);
      if (!regex32.test(message) && data == null) {
        // say that Enter Address to Sync the Wallet
        setMessage(
          "Please try again with only wallet address in chat",
          newActiveChat
        );
      } else {
        if (data == null) {
          // call fill wallet
          try {
            const res = await fillWallet(message, chatId);
            if (res?.data) {
              setData(res?.data);
              setIsTransaction(true);
              setMessage(res?.data, newActiveChat);
            } else
              setMessage(
                "Error generating response Please try again after some time.",
                newActiveChat
              );
            // api call on getTransactionInfo
            // if data is not null then show the data in the answer
            // else shosw the message
          } catch (error) {
            // console.log(error, "error");
            setMessage(
              "Error generating response Please try again after some time.",
              newActiveChat
            );
          }
        } else {
          // call the wallet queryWallet method
          let prevMessages: any = [];
          let lastMessages = newActiveChat?.map((message, index: number) => {
            if (index % 2 === 1) {
              prevMessages.push(["user", `${message.value}`]);
            } else {
              prevMessages.push(["ans", `${message?.value}`]);
            }
            return message;
          });
          const data = await getWalletResponse(message, chatId, prevMessages);
          // console.log(data, "data");
          if (data?.data) {
            setMessage(JSON.stringify(data?.data, null, 2), newActiveChat);
          } else {
            setMessage(
              "Error generating response Please try again after some time.",
              newActiveChat
            );
          }
        }
      }
    } else if (type === "Transactions") {
      setLoadingResponse(true);
      newActiveChat.push({
        value: message,
        createdAt: new Date(),
      });
      setActiveChat(newActiveChat);
      if (!regex64.test(message)) {
        if (!isTransction) {
          // push to answer Please try again
          setMessage(
            "Please try again with only tx hash in chat",
            newActiveChat
          );
        } else {
          let prevMessages: any = [];
          let lastMessages = newActiveChat?.map((message, index: number) => {
            if (index % 2 === 1) {
              prevMessages.push(["user", `${message.value}`]);
            } else {
              prevMessages.push(["ans", `${message?.value}`]);
            }
            return message;
          });
          const data = await getTransactionResponse(
            message,
            chatId,
            prevMessages
          );
          if (data?.data) {
            setMessage(data?.data, newActiveChat);
          } else {
            setMessage(
              "Error generating response Please try again after some time.",
              newActiveChat
            );
          }
          // do the api message call to get the result and send the data
        }
      } else {
        if (isTransction) {
          setIsTransaction(false);
        }
        try {
          const res = await getTransactionInfo(message, chatId);
          if (res?.data) {
            setData(res?.data);
            setIsTransaction(true);
            setMessage(res?.data?.explanation, newActiveChat);
          } else setMessage(res?.message, newActiveChat);
          // api call on getTransactionInfo
          // if data is not null then show the data in the answer
          // else shosw the message
        } catch (error) {
          setMessage(
            "Error generating response Please try again after some time.",
            newActiveChat
          );
        }
      }
    } else {
      setLoadingResponse(true);
      newActiveChat.push({
        value: message,
        createdAt: new Date(),
      });
      setActiveChat(newActiveChat);
      let prevMessages: any = [];
      let lastMessages = newActiveChat?.map((message, index: number) => {
        if (index % 2 === 1) {
          prevMessages.push(["user", `${message.value}`]);
        } else {
          prevMessages.push(["ans", `${message?.value}`]);
        }
        return message;
      });
      let data = await getNeoXResponse(message, prevMessages);
      if (data?.data) {
        setMessage(data?.data, newActiveChat);
      } else {
        setMessage(
          "Error generating response Please try again after some time.",
          newActiveChat
        );
      }
    }
    setLoadingResponse(false);
    // }
  };

  const handleNewChat = () => {
    setActiveChat([]);
    setIsTransaction(false);
    setData(null);
  };

  // const establishSocketConnection = () => {
  //   try {
  //     if (socketObj) {
  //       socketObj.disconnect();
  //     }
  //     console.log(SOCKET_URI,'uri')
  //     const socketio = io(`${SOCKET_URI}`, {
  //       timeout: 120000,
  //       reconnection: true,
  //       reconnectionAttempts: 5,
  //       reconnectionDelay: 5000,
  //       autoConnect: true,
  //     });

  //     console.log(socketio)

  //     socketio.on("disconnect", async () => {
  //       console.log('disconnect');
  //     });
  //     socketio.on("error", (data) => {
  //       console.log(data, 'error in connection');
  //     });

  //     // setSocketObj(socketio);
  //     socketio.on("connected", (data) => {
  //       console.log('socketio connected successfully');
  //       setSocketObj(socketio);
  //     });

  //     socketio.on("chatDetails", (data) => {
  //       // console.log(data);
  //     });
  //   } catch (error) {
  //     console.log(error, 'error in catch');
  //   }
  // };

  // useEffect(() => {
  //   establishSocketConnection();
  // }, []);
  const messageEnd = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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

  console.log(activeChat, 'activeChat', type, 'type');

  const handleClick = (val: string) => {
    // setType(val);
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
        {type ? (
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
              {["wallet", "transactions", "neo-x"]?.map((el, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/${chatId}/chat/${el}`)}
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
      {type && (
        <div className="bottom-5 flex gap-1 flex-col pt-3 bg-[#EDF2E4] sticky w-full z-40">
          <MessageInput handleNewChat={handleNewChat} sendMessage={sendMessage} setType={() => { }} />
        </div>
      )}
    </div>
  );
};

export default Chat;
