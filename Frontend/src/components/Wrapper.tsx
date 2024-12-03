"use client";
import React, { createContext, useState } from "react";
import { Toaster } from "react-hot-toast";

export interface Message {
  value: any;
  detail?: any;
  createdAt: any;
}

export const SocketContext = createContext<any | null | undefined>(null);

export const Wrapper = ({ children }: { children: any }) => {
  const [socketObj, setSocketObj] = useState(null);
  const [activeChat, setActiveChat] = useState<Message[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  return (
    <>
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <SocketContext.Provider
        value={{
          socketObj,
          setSocketObj,
          activeChat,
          setActiveChat,
          loadingResponse,
          setLoadingResponse,
        }}
      >
        {children}
      </SocketContext.Provider>
    </>
  );
};
