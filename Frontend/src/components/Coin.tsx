import { useEffect, useRef, useState } from "react";

export default function Coin({ onCoinReachTop }: { onCoinReachTop?: any }) {
  const [isMovingUp, setIsMovingUp] = useState(false);
  const ref = useRef("1");

  const handleCoinClick = () => {
    setIsMovingUp(true);
    ref.current = "1";
    setTimeout(() => {
      if (ref?.current === "1") {
        onCoinReachTop();
      }
      ref.current = "2";
      setIsMovingUp(false);
    }, 2000);
  };

  useEffect(() => {
    handleCoinClick();
  }, []);

  return (
    <div
      className={`transition-all duration-2000 opacity-100 absolute flex items-center justify-center bottom-0 w-16 h-16 bg-yellow-500 rounded-full cursor-pointer transform ${
        isMovingUp ? "transition-all duration-2000 moveUp opacity-0" : ""
      }`}
      style={{
        perspective: "1000px",

      }}
      onClick={handleCoinClick}
    >

      <div className="absolute w-full h-full bg-yellow-500 z-10 rounded-full border-2 border-black">

      </div>
      <div className="absolute top-1 w-full h-full z-1 rounded-full border-2 border-black"></div>
      <p className="relative z-20 font-medium text-black">₹</p>
    </div>
  );
}
