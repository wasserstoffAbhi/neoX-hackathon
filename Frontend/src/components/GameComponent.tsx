"use client";
import Image from "next/image";
import { useState, FC, useEffect, useRef } from "react";
import BgImage from "./BgImage";
import Coin from "./Coin";
import { updateScore } from "../backendServices/userServices";

const GameComponent = ({
  setMute,
  mute,
  play,
  setPlay,
  setPage,
  score,
  setScore,
  chatId,
}: {
  setMute: (val: boolean) => void;
  mute: boolean;
  play: boolean;
  setPlay: (val: boolean) => void;
  setPage: (val: string) => void;
  score: number;
  setScore: any;
  chatId: string;
}) => {
  const [isStart, setIsStart] = useState(false);
  const [coins, setCoins] = useState<any>([]);
  const pointRef = useRef(score);

  const handleCoinReachTop = () => {
    setScore((prev: any) => {
      pointRef.current = prev + 1;
      return prev + 1;
    });
  };

  const addNewCoin = () => {
    setCoins((prevCoins: any) => [
      ...prevCoins,
      <Coin key={prevCoins.length} onCoinReachTop={handleCoinReachTop} />,
    ]);
  };

  let id: any;
  useEffect(() => {
    if (isStart) {
      id = setInterval(async () => {
        await updateScore(chatId, pointRef?.current);
      }, 2000);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [isStart]);

  return (
    <div className="relative">
      {!isStart && (
        <div
          onClick={() => {
            setPlay(!play);
            setIsStart(true);
          }}
          className="absolute opacity-50 z-[50] border border-red-500 flex justify-center items-center bg-white h-[100vh] w-full"
        >
          <p className="text-3xl">Tap to start</p>
        </div>
      )}
      <BgImage />
      <div className="absolute top-0 z-30 w-full h-[88vh] bottom-0 flex flex-col items-center">
        {coins}
      </div>

      <div className="flex w-full z-30 absolute top-0 flex-col bg-transparent h-screen p-4 bg-gray-900 text-white">
        {/* Top Section */}
        <div className="flex justify-center items-center">
          {/* Center: Score and Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center rounded-lg p-2">
              <div className="z-20">
                <Image
                  src="/User.svg"
                  alt="Avatar"
                  width={130}
                  height={130}
                  className="rounded-full"
                />
              </div>
              <p className="text-5xl bg-[#21231A] z-10 rounded-xl border-2 border-[#000000] p-2 pl-3 -translate-x-3 font-semibold">
                {score}
              </p>
            </div>
            <p className="mt-2 text-black font-semibold text-xl">
              Tap on coin to gain points
            </p>
          </div>
        </div>

        {/* Middle: Section */}
        <div className="flex mt-20 justify-between">
          <div className="flex flex-col items-center justify-center">
            {/* Left: Chat and Booster */}
            <div
              onClick={() => {
                setMute(!mute);
              }}
              className="w-16 h-16 flex items-center justify-center"
            >
              {/* Chat Icon */}
              <Image
                src={mute ? "/mute.svg" : "/unmute.svg"}
                alt="Chat Icon"
                width={74}
                height={74}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between mt-auto h-20 gap-4 items-start">
          {/* Buy Button */}
          <button
            onClick={() => {
              setPage("chat");
              setPlay(false);
            }}
            className="flex h-full text-[#BEBEBE] text-3xl flex-col gap-2 items-center justify-center bg-[#464B39] border-2 border-black px-6 rounded-xl"
          >
            Chat
          </button>

          {/* Tap Button */}
          <button
            onClick={addNewCoin}
            className="bg-white flex-grow w-full px-6 h-full rounded-xl shadow-lg border-black border-2 text-black text-4xl font-bold"
          >
            Tap
          </button>

          {/* Botpoint Button */}
          <button
            onClick={() => {
              setPlay(false);
              setIsStart(false);
            }}
            className="flex flex-col gap-2 h-full items-center justify-center bg-[#464B39] border-2 border-black px-6 rounded-xl"
          >
            <div className="w-8 h-8">
              <Image src="/return.svg" alt="coin Icon" width={30} height={30} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
