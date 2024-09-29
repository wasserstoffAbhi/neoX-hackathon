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
      className={`border border-black transition-all duration-2000 opacity-100 absolute flex items-center justify-center bottom-0 w-16 h-16 bg-yellow-500 rounded-full cursor-pointer shadow-md transform ${
        isMovingUp ? "transition-all duration-2000 moveUp opacity-0" : ""
      }`}
      style={{
        perspective: "1000px",
      }}
      onClick={handleCoinClick}
    >
      <p className="text-black">₹</p>
    </div>
  );
}
