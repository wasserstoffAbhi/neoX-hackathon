'use client'
import ChatWindow from '@/src/components/ChatWindow'
import React from 'react'

const Page = ({ params }: { params: { chatId: string } }) => {
    return (
        <ChatWindow chatId={params?.chatId} />
    )
}

export default Page