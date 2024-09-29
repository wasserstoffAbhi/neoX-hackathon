import React, { useContext, useEffect, useState } from "react";
import Chat from "./Chat";
import Image from "next/image";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {
  fillWallet,
  getNeoXResponse,
  getTransactionInfo,
  getTransactionResponse,
  getWalletResponse,
} from "../backendServices/userServices";
import { Message, SocketContext } from "./Wrapper";

const ChatWindow = ({
  setPage,
  chatId,
}: {
  setPage: (val: string) => void;
  chatId: string;
}) => {
  const regex64 = /0x[a-fA-F0-9]{64}/;
  const regex32 = /0x[a-fA-F0-9]{32}/;
  const {
    socketObj,
    setSocketObj,
    activeChat,
    setActiveChat,
    loadingResponse,
    setLoadingResponse,
  } = useContext(SocketContext);
  const [type, setType] = useState<string | null>(null);
  const [isTransction, setIsTransaction] = useState(false);
  const [data, setData] = useState(null);
  // const [dataFetched,set]
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
    setType(null);
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

  return (
    <div>
      <div className="h-12 flex justify-between border-b border-[#DFE2E8] sticky top-0 items-center bg-[#EDF2E4] px-3">
        <div className="">
          <Image
            onClick={() => setPage("landing")}
            src={"/arrow-left.svg"}
            width={22}
            height={22}
            alt="left-arrow"
          />
        </div>
        <p className="w-full text-center font-semibold text-[#232323]">
          ChatBot
        </p>
      </div>
      {true ? (
        <div className="flex w-full h-[calc(100vh-50px)] bg-[#EDF2E4]">
          <div className="h-full w-full">
            {/* <Navbar messages={messages} /> */}
            <div className="h-full">
              <Chat
                handleNewChat={handleNewChat}
                sendMessage={sendMessage}
                type={type}
                setType={setType}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          {/* <Loader /> */}
          Loading...
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
