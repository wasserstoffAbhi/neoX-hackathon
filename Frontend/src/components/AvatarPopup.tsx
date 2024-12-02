'use client'
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Image from 'next/image';
import { MdOutlineLock } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import { buyAvatarCall, sellAvatarCall } from '../backendServices/userServices';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const AvatarPopup = ({ el, ownedAvatars, unlockedAvatars, avatars, chatId, getAvatars }: { el: any, ownedAvatars: any; unlockedAvatars: any; avatars: any; chatId: string; getAvatars: () => void }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const { user } = useSelector((state: any) => state?.user);
    const [loadingState, setLoadingState] = useState(false);
    const showLoading = () => {
        setOpen(true);
    };

    const sellAvatar = async (key: string) => {
        try {
            let res = await sellAvatarCall(key, chatId);
        } catch (error) {
            console.log(error);
        }
    }

    const buyAvatar = async (key: string, price: number) => {
        if (loadingState) return;
        toast.dismiss();
        try {
            if (user?.token >= price) {
                try {
                    setLoadingState(true);
                    let res = await buyAvatarCall(chatId, key);
                    if (res?.data) {
                        toast.success("Avatar buyed successfully");
                    }
                    else {
                        toast.error(res?.message || "Error in buying the avatar")
                    }
                    setLoadingState(false);
                    getAvatars();
                    console.log(res, 'response in buy avatar');
                } catch (error) {
                    setLoadingState(false);
                    toast.error("Error in buying the avatar");
                }
            }
            else {
                toast.error("Not enough tokens to buy");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleBuySell = async (key: string) => {
        await ownedAvatars?.find((elem: any) => elem?.id === `${key}`) ? await sellAvatar(key) : await buyAvatar(key, unlockedAvatars?.find((elem: any) => elem?.id === `${key}`)?.price);
    }

    return (
        <>
            <div onClick={showLoading} className={`${false ? "" : ""} rouned-md flex relative justify-center items-center aspect-square`}>
                {
                    false && <div className='absolute flex justify-center items-center z-10 w-full h-full top-0 left-0'>

                        <MdOutlineLock color='#fff' />
                    </div>
                }
                <Image src={ownedAvatars?.find((elem: any) => elem?.id === `${el}`)?.url || unlockedAvatars?.find((elem: any) => elem?.id === `${el}`)?.url || "/botimg.png"} alt='avatar' width={50} height={50} />
            </div>
            <Modal
                centered
                title={<p>{avatars[el]}</p>}
                open={open}
                footer={<div className='flex items-center gap-2 justify-end text-black'>
                    <div className='flex rounded-md justify-center items-center px-2 gap-3 py-1'>
                        {
                            ownedAvatars?.find((elem: any) => elem?.id === `${el}`) || unlockedAvatars?.find((elem: any) => elem?.id === `${el}`) && <p onClick={() => {
                                handleBuySell(el);
                            }} className={`cursor-pointer px-2 py-1 rounded-md hover:scale-[1.03] transition-all duration-200 ${ownedAvatars?.find((elem: any) => elem?.id === `${el}`) ? "border border-green-500 hover:bg-green-500 text-black hover:text-white" : "border border-red-500 hover:bg-red-500 text-black hover:text-white"}`}>{ownedAvatars?.find((elem: any) => elem?.id === `${el}`) ? "Sell" : "Buy"}</p>
                        }
                        <div className='flex items-center gap-1 bg-green-100 px-2 py-1.5 rounded-md'>
                            <GiTwoCoins />
                            <p>{ownedAvatars?.find((elem: any) => elem?.id === `${el}`)?.price || unlockedAvatars?.find((elem: any) => elem?.id === `${el}`)?.price || ""}</p>
                        </div>
                    </div>
                </div>}
                // styles={{ content: { backgroundColor: "#fff", color: "#fff" } }}
                onCancel={() => setOpen(false)}
                className=''
            >
                <div className={`aspect-square relative w-full bg-green-50 rounded-md ${!ownedAvatars?.find((elem: any) => elem?.id === `${el}`) && !unlockedAvatars?.find((elem: any) => elem?.id === `${el}`) && "opacity-50 blur-[4px]"}`}>
                    <Image src={ownedAvatars?.find((elem: any) => elem?.id === `${el}`)?.url || unlockedAvatars?.find((elem: any) => elem?.id === `${el}`)?.url || "/botimg.png"} fill alt="" objectFit='contain' className='aspect-square' />
                </div>
            </Modal>
        </>
    );
};

export default AvatarPopup;