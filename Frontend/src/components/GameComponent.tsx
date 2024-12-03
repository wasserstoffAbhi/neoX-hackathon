"use client";
import Image from "next/image";
import { useState, FC, useEffect, useRef } from "react";
import BgImage from "./BgImage";
import Coin from "./Coin";
import { claimSwamp, getGiftSwampCall, updateScore } from "../backendServices/userServices";
import { setUser } from "../redux/features/userDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import GiftBoxAnimation from "./GiftBox";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const dispatch = useDispatch();
  const prevRef = useRef(score);
  const [getGift, setGetGift] = useState(false);
  const [giftData, setGiftData] = useState<any>(null);
  const { user } = useSelector((state: any) => state?.user);
  const router = useRouter();

  const totalCoinsRef = useRef<HTMLDivElement>(null);
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

  const handleChangeGiftClick = () => {
    setGetGift(!getGift);
  }

  let id: NodeJS.Timeout;
  useEffect(() => {
    if (isStart) {
      id = setInterval(async () => {
        // console.log(prevRef.current, pointRef?.current)
        const coin = pointRef.current;
        if (prevRef.current < coin) {
          let res = await updateScore(chatId, coin);
          if (res?.swampActive) {
            setGetGift(true);
          } else {
            setGetGift(false);
          }
          if (res?.user) {
            if (res?.user?.points) {
              dispatch(setUser({ ...user, points: res?.user?.points }));
            }
            // console.log('here');
            prevRef.current = coin;
          }
          // console.log(res, 'response');
        }
      }, 3000);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [isStart]);


  const handleGiftClick = async () => {
    try {
      let res = await getGiftSwampCall(chatId);
      // console.log(res, 'res in swamp');
      if (res?.data) {
        alert(`${res?.message} ${JSON.stringify(res)}`);
        setGiftData(res);
      }
    } catch (err) {
      alert(err);
    }
  }


  return (
    <div className="relative">
      {!isStart && (
        <div
          onClick={() => {
            setPlay(!play);
            setIsStart(true);
          }}
          className="absolute opacity-50 z-[50] flex justify-center items-center bg-white h-[100vh] w-full"
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
        <div className="flex justify-center items-center relative z-[-10]">
          {/* Center: Score and Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center rounded-lg p-2">
              <div className="z-20">
                <Image
                  onClick={() => router.push(`/${chatId}/avatar`)}
                  src="/User.svg"
                  alt="Avatar"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
              <p className="text-5xl bg-[#21231A] z-10 rounded-xl border-2 border-[#000000] p-2 pl-3 -translate-x-3 font-semibold">
                {score}
              </p>
            </div>
            <p className="mt-2 text-black font-semibold text-center text-xl">
              Tap on coin <br /> to gain points
            </p>
          </div>
          {/* <div ref={totalCoinsRef} className="absolute right-0 top-[158p w-[130px] h-[60px] bg-white rounded-l-2xl text-black flex items-center justify-start pl-3">
            
          </div> */}
        </div>

        {/* Middle: Section */}
        <div className="flex mt-20 flex-col w-fit justify-between gap-4">
          <div className={`relative flex flex-col items-center justify-center ${getGift ? 'animate-shake opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>
            {/* Left: Chat and Booster */}
            <div className="absolute z-1 top-1 left-0 w-full h-full border-b-2 rounded-lg border-black bg-[#687051]">

            </div>
            <div
              onClick={() => {
                if (getGift) {
                  handleGiftClick();
                } else {
                  alert("No active gift available to claim");
                }
              }}
              className="relative w-16 h-16 border-2 border-black z-20 flex items-center justify-center rounded-md overflow-hidden"
            >
              {/* Chat Icon */}
              {/* <p className="w-full h-full absolute top-0 left-0 text-black z-10 flex justify-center items-center">2</p> */}
              <Image
                src={'https://www.shutterstock.com/image-vector/red-mystery-gift-box-yellow-600nw-2264467581.jpg'}
                alt="Chat Icon"
                fill
              />
            </div>
          </div>
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
        {getGift && giftData && <GiftBoxAnimation ref={pointRef} setScore={setScore} totalCoinsRef={totalCoinsRef} handleChangeGiftClick={handleChangeGiftClick} giftData={giftData} />}

        {/* Bottom Section */}
        <div className="flex justify-between mt-auto h-20 gap-4 items-start">
          {/* Buy Button */}
          {/* <button
            onClick={() => {
              router.push(`/${chatId}/chat`);
              setPlay(false);
            }}
            className="flex h-full text-[#BEBEBE] text-3xl flex-col gap-2 items-center justify-center bg-[#464B39] border-2 border-black px-6 rounded-xl"
          >
            Chat
          </button> */}
          <div className="flex flex-col justify-center items-center gap-1 bg-[#464B39] px-3 py-[10px] rounded-lg"><p className="font-mono text-sm pl-6">Balance: </p><div className="font-mono flex flex-row gap-2 text-xs justify-start items-center w-full">
            <img src={"/neo-gas.png"} alt="token" className="w-4 h-4" />
            <span>{Number(user?.token).toFixed(4) || 0} GAS</span>
          </div></div>

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
