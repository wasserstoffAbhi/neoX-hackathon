'use client'
import React from 'react';
import { Button, Modal } from 'antd';
import Image from 'next/image';
import { MdOutlineLock } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';

const AvatarPopup = ({ el, ownedAvatars, unlockedAvatars, avatars }: { el: any, ownedAvatars: any; unlockedAvatars: any; avatars: any }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const showLoading = () => {
        setOpen(true);
    };

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
                title={<p>Avatar Name</p>}
                open={open}
                footer={<div className='flex items-center gap-2 justify-end text-black'>
                    <div className='flex bg-green-100 rounded-md justify-center items-center px-2 gap-1 py-1'>
                        {/* <p>{owned?.[el.id] ? "Sell" : "Buy"}</p> */}
                        <div className='flex items-center gap-1'>
                            <GiTwoCoins />
                            <p>2000</p>
                        </div>
                    </div>
                    {/* {
                        owned?.[el.id] && <div className='text-green-100 bg-[#7a8565] px-2 py-1 rounded-md'>Set as avatar</div>
                    } */}
                </div>}
                // styles={{ content: { backgroundColor: "#fff", color: "#fff" } }}
                onCancel={() => setOpen(false)}
                className=''
            >
                {/* <div className={`aspect-square relative w-full bg-green-50 rounded-md ${isLocked && "opacity-50 blur-[4px]"}`}>
                    <Image src={el?.url || ""} fill alt="" objectFit='contain' className='aspect-square' />
                </div> */}
            </Modal>
        </>
    );
};

export default AvatarPopup;