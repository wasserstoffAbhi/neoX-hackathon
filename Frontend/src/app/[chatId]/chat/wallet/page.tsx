'use client'
import Chat from '@/src/components/Chat';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = ({ params }: { params: { chatId: string } }) => {
    const router = useRouter();
    return (
        <div>
            <div className="h-12 flex justify-between border-b border-[#DFE2E8] sticky top-0 items-center bg-[#EDF2E4] px-3">
                <div className="">
                    <Image
                        onClick={() => router.push(`/${params?.chatId}/chat`)}
                        src={"/arrow-left.svg"}
                        width={22}
                        height={22}
                        alt="left-arrow"
                    />
                </div>
                <p className="w-full text-center font-semibold text-[#232323]">
                    ChatBot
                </p>
            </div>
            {true ? (
                <div className="flex w-full h-[calc(100vh-50px)] bg-[#EDF2E4]">
                    <div className="h-full w-full">
                        {/* <Navbar messages={messages} /> */}
                        <div className="h-full">
                            <Chat
                                type={"Wallet"}
                                chatId={params?.chatId}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    {/* <Loader /> */}
                    Loading...
                </div>
            )}
        </div>
    )
}

export default Page