import React, { useEffect, useRef, useState } from 'react'
import Confetti from './Coffeti/Coffetti';
import { useDispatch, useSelector } from 'react-redux';
import { updatePoints, updateToken } from '../redux/features/userDetailsSlice';
import { updateScore } from '../backendServices/userServices';



const GiftCard = ({ref, setScore, handleChangeGiftClick, animation, giftType, totalCoinsRef, giftData}: {ref: any, setScore: any, handleChangeGiftClick: () => void, animation: any, giftType: string, totalCoinsRef: any, giftData: any}) => {
  const {rise, flipx} = animation;
  const dispatch = useDispatch<any>();
  const {user} = useSelector((state: any) => state.user);
  const coinRef = useRef<HTMLImageElement>(null);
  const tokenRef = useRef<HTMLImageElement>(null);

  

  const handleGetCoins = async (coinCount: number) => {
  
    const coinElement = coinRef.current;
    const totalCoinsElement = totalCoinsRef.current;
  
    if (!coinElement || !totalCoinsElement) return;
  
    let { top, left, width, height } = coinElement.getBoundingClientRect();
    width = 50;
    height = 50;
    const target = totalCoinsElement.getBoundingClientRect();
    const {top: totalTop, left: totalLeft} = totalCoinsElement.getBoundingClientRect();
    for (let i = 0; i < coinCount; i++) {
      const clonedCoin = coinElement.cloneNode(true) as HTMLImageElement;
      document.body.appendChild(clonedCoin);
  
      // Position cloned coin with a random spread effect
      clonedCoin.style.position = "absolute";
      clonedCoin.style.zIndex = "9999999";
      clonedCoin.style.top = `${top + (Math.random() - 0.5) * 100}px`; // Randomly spread vertically
      clonedCoin.style.left = `${left + (Math.random() - 0.5) * 100}px`; // Randomly spread horizontally
      clonedCoin.style.width = `${width}px`;
      clonedCoin.style.height = `${height}px`;
      clonedCoin.style.transition = `all 1s ease ${i * 0.1}s`;
      clonedCoin.style.animation = "1s riseToSide";
      requestAnimationFrame(() => {
        clonedCoin.style.transform = `⁠translate(${totalLeft - left}px, ${totalTop - top}px) scale(0.5)`;
        clonedCoin.style.opacity = "0";
      });
      clonedCoin.addEventListener("transitionend", () => {
        clonedCoin.remove();
        if (i === coinCount - 1) {
          setScore((prev: any) => {
            ref.current = prev + coinCount;
            return prev + coinCount;
          });
        }
      });
      
    }
  };

  const handleGetTokens = async (coinCount: number) => {
  
    const coinElement = tokenRef.current;
    const totalCoinsElement = totalCoinsRef.current;
  
    if (!coinElement || !totalCoinsElement) return;
  
    let { top, left, width, height } = coinElement.getBoundingClientRect();
    width = 30;
    height = 30;
    const target = totalCoinsElement.getBoundingClientRect();
    const {top: totalTop, left: totalLeft} = totalCoinsElement.getBoundingClientRect();
    for (let i = 0; i < coinCount; i++) {
      const clonedCoin = coinElement.cloneNode(true) as HTMLImageElement;
      document.body.appendChild(clonedCoin);
  
      // Position cloned coin with a random spread effect
      clonedCoin.style.position = "absolute";
      clonedCoin.style.zIndex = "9999999";
      clonedCoin.style.top = `${top + (Math.random() - 0.5) * 100}px`; // Randomly spread vertically
      clonedCoin.style.left = `${left + (Math.random() - 0.5) * 100}px`; // Randomly spread horizontally
      clonedCoin.style.width = `${width}px`;
      clonedCoin.style.height = `${height}px`;
      clonedCoin.style.transition = `all 1s ease ${i * 0.1}s`;
      clonedCoin.style.animation = "1s riseToSide";
      requestAnimationFrame(() => {
        clonedCoin.style.transform = `⁠translate(${totalLeft - left}px, ${totalTop - top}px) scale(0.5)`;
        clonedCoin.style.opacity = "0";
      });
      clonedCoin.addEventListener("transitionend", () => {
        clonedCoin.remove();
        if (i === coinCount - 1) {
          dispatch(updateToken(coinCount));
        }
      });
    }
  };

  const [clickFlip, setClickFlip] = useState(false);
  return (
    <div className='absolute top-0 left-0 w-screen h-screen overflow-hidden z-[-10]'>
      <div className={`w-[100px] h-[100px] shadow-lg absolute ${clickFlip ? "click-flip" : ""} flex flex-col items-center justify-center bg-red-500 rounded-md flip-card ${rise} ${flipx}`}>
      {clickFlip ? <Confetti open={true}/> : null}
      <div className="flip-card-inner" onClick={() => {
        setClickFlip(!clickFlip);
      }}>
        <div className="flip-card-front relative flex flex-col items-center justify-center p-2" >
          <div className='absolute top-0 left-0 w-full h-full rounded-[10px] opacity-30'>
            <img src={"./bg.png"} alt="" className='absolute top-0 left-0 object-cover'/>
            <img src={"./botimg.png"} alt="" className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
          </div>
          <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-mono font-bold'>You have won {giftType}</p>
        </div>
        <div className="flip-card-back bg-[#465235] flex flex-col items-center justify-center">
          {giftType === "Avatar" ? 
          <div className='relative flex flex-col justify-center items-center gap-4'>
            <img src={giftData?.url} alt="avatar" className='w-20 h-20 rounded-md shadow-md float'/>
            <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => {
              handleChangeGiftClick();
              handleGetTokens(giftData);
            }}>Collect & Close</button>
          </div>
           :
            giftType === "Tokens" ? 
          <div className='relative flex flex-col justify-center items-center gap-4'>
            <img ref={tokenRef} src={"https://assets.coingecko.com/coins/images/26417/standard/Logo-Round_%281%29.png"} alt="token" className="w-20 h-20"/>
            <span>{`Won ${giftData === undefined ? 0 : giftData} tokens`}</span>
            <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => {
              handleChangeGiftClick();
              handleGetTokens(giftData);
            }}>Collect & Close</button>
          </div> 
          :  
          <div onClick={() => {
            
          }} className='relative flex flex-col justify-center items-center gap-4'>
            <img ref={coinRef} src={"./neox-coin.png"} alt="token" className="w-20 h-20"/>
            <span>{`Won ${giftData === undefined ? 0 : giftData} Coins`}</span>
            <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => {
              handleChangeGiftClick();
              handleGetCoins(giftData);
            }}>Collect & Close</button>
          </div>} 
        </div>
      </div>
    </div>
    </div>
  );
}

export default GiftCard;