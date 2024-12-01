'use client'
import { getAllAvatars, validateChatId } from '@/src/backendServices/userServices';
import AvatarPopup from '@/src/components/AvatarPopup';
import { setUser } from '@/src/redux/features/userDetailsSlice';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { GiTwoCoins } from 'react-icons/gi';
import { MdOutlineLock } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const Page = ({ params }: { params: { chatId: string } }) => {
    const { user } = useSelector((state: any) => state?.user);
    const [avatars, setAvatars] = useState<any>(null);
    const [ownedAvatars, setOwnedAvatars] = useState<any>(null);
    const [unlockedAvatars, setUnlockedAvatars] = useState<any>(null);
    const balance = 10000;
    const owned: any = {
        "1": "sdlfjal",
        "4": "sdfjl",
        "6": "dfs"
    }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const data = await validateChatId(params?.chatId);
            setLoading(false);
            if (data && data?.data) {
                dispatch(setUser(data?.data));
                getAvatars();
            }
            else {
                setError(true);
            }

        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const getAvatars = async () => {
        try {
            let res = await getAllAvatars(params?.chatId);
            console.log(res, 'response');
            if (res?.data?.avatars) {
                setAvatars(res?.data?.avatars);
            }
            if (res?.data?.userAvatarsOwned) {
                setOwnedAvatars(res?.data?.userAvatarsOwned);
            }
            if (res?.data?.userAvatarsUnlocked) {
                setUnlockedAvatars(res?.data?.userAvatarsUnlocked);
            }
        } catch (error) {
            setError(true);
        }
    }
    console.log(avatars, 'avatars');

    return (

        <>
            {error ? (
                <div className="flex justify-center h-screen items-center">
                    <p>Please Login through Telegram</p>
                </div>
            ) : loading ? (
                <div className="flex justify-center h-screen items-center">
                    <p>Loading...</p>
                </div>
            ) : (
                <div className='min-h-screen flex flex-col gap-5 py-5 p-2'>
                    <div className=''>
                        <div className='text-right text-xl flex items-center justify-end gap-1'><div className='items-center flex gap-1'>Available <GiTwoCoins color='#F3C70D' /></div>: {" "}{balance}</div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {
                            avatars && Object.keys(avatars)?.map((key: any, index: number) => <div key={index} className={`relative bg-green-50 justify-center border rounded-md px-2 items-center  grid grid-cols-5 gap-1`}>
                                <div className='font-medium '>{avatars[key]}</div>
                                <AvatarPopup el={key} avatars={avatars} ownedAvatars={ownedAvatars} unlockedAvatars={unlockedAvatars} />
                                <div className='flex flex-col justify-center items-center'>
                                    <p>{ownedAvatars?.find((elem: any) => elem?.id === `${key}`) ? "Sell" : "Buy"}</p>
                                    <div className='flex items-center gap-1'>
                                        <GiTwoCoins color='#F3C70D' />
                                        <p>{ownedAvatars?.find((elem: any) => elem?.id === `${key}`)?.price || unlockedAvatars?.find((elem: any) => elem?.id === `${key}`)?.price || "hidden"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>Set as Avatar</p>
                                </div>
                                <div>
                                    <p>Trade</p>
                                    {/* <p>Coming Soon...</p> */}
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            )}
        </>

    )
}

export default Page