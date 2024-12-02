import React, { useRef, useState } from 'react'
import Confetti from './Coffeti/Coffetti';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '../redux/features/userDetailsSlice';



const GiftCard = ({handleChangeGiftClick, animation, giftType = "Legendary Avatar", totalCoinsRef}: {handleChangeGiftClick: () => void, animation: any, giftType: string, totalCoinsRef: any}) => {
  const {rise, flipx} = animation;
  const dispatch = useDispatch<any>();
  const {user} = useSelector((state: any) => state.user);
  const coinRef = useRef<HTMLImageElement>(null);
  const handleGetCoins = (coinCount: number) => {
  
    const coinElement = coinRef.current;
    const totalCoinsElement = totalCoinsRef.current;
  
    if (!coinElement || !totalCoinsElement) return;
  
    const { top, left, width, height } = coinElement.getBoundingClientRect();
    const target = totalCoinsElement.getBoundingClientRect();
  
    for (let i = 0; i < coinCount; i++) {
      const clonedCoin = coinElement.cloneNode(true) as HTMLImageElement;
      document.body.appendChild(clonedCoin);
  
      // Position cloned coin with a random spread effect
      clonedCoin.style.position = "absolute";
      clonedCoin.style.top = `${top + (Math.random() - 0.5) * 100}px`; // Randomly spread vertically
      clonedCoin.style.left = `${left + (Math.random() - 0.5) * 100}px`; // Randomly spread horizontally
      clonedCoin.style.width = `${width}px`;
      clonedCoin.style.height = `${height}px`;
      clonedCoin.style.transition = `all 0.8s ease ${i * 0.1}s`;
  
      // Start the animation: move coins towards the target
      requestAnimationFrame(() => {
        clonedCoin.style.transform = `⁠translate(${target.left - left}px, ${target.top - top}px) scale(0.5)`;
        clonedCoin.style.opacity = "0";
      });
  
      clonedCoin.addEventListener("transitionend", () => {
        clonedCoin.remove();
        if (i === coinCount - 1) {
          dispatch(updateToken(user?.token + i));
        }
      });
    }
  };
  const [clickFlip, setClickFlip] = useState(false);
  const token = 100000;
  return (
    <div className={`w-[100px] h-[100px] shadow-lg absolute ${clickFlip ? "click-flip" : ""} flex flex-col items-center justify-center bg-red-500 rounded-md flip-card ${rise} ${flipx}`} onClick={() => {
      if (!clickFlip){
        setClickFlip(!clickFlip);
      }
      // setTimeout(() => {
      //   handleChangeGiftClick();
      // }, 3000);
    }}>
      {clickFlip ? <Confetti open={true}/> : null}
      <div className="flip-card-inner">
        <div className="flip-card-front relative flex flex-col items-center justify-center p-2" >
          <div className='absolute top-0 left-0 w-full h-full rounded-[10px] opacity-30'>
            <img src={"./bg.png"} alt="" className='absolute top-0 left-0 object-cover'/>
            <img src={"./botimg.png"} alt="" className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          </div>
          <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-mono font-bold'>You have won {giftType}</p>
        </div>
        <div className="flip-card-back bg-[#465235] flex flex-col items-center justify-center">
          {giftType === "Legendary Avatar" ? <p>Avatar</p> : giftType === "tokens" ? <div onClick={() => () => {
            handleGetCoins(50);
            console.log("clicked");
          }} className='flex flex-col justify-center items-center gap-4'>
            <img src={"https://assets.coingecko.com/coins/images/26417/standard/Logo-Round_%281%29.png"} alt="token" className="w-20 h-20"/>
            <span>{`Won ${token === undefined ? 0 : token} tokens`}</span>
          </div> :  <div className='flex flex-col justify-center items-center gap-4' ref={coinRef}>
            <img src={"./coin.png"} alt="token" className="w-20 h-20"/>
            <span>{`Won ${token === undefined ? 0 : token} Coins`}</span>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default GiftCard;