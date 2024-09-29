"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import ChatWindow from "../../components/ChatWindow";
import LandingPage from "../../components/LandingPage";
import { validateChatId } from "@/src/backendServices/userServices";
import GameComponent from "@/src/components/GameComponent";

export default function Home({ params }: { params: { chatId: string } }) {
  const [click, setClick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const handleClickk = () => {};
  const [play, setPlay] = useState(false);
  const [page, setPage] = useState("landing");
  const [isMute, setIsMute] = useState(false);
  const [score, setScore] = useState<number>(0);

  const getData = async () => {
    const data = await validateChatId(params?.chatId);
    setLoading(false);
    if (data?.points != null && data?.points >= 0) {
      setScore(data?.points);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        <div className="">
          <AudioPlayer play={play} mute={isMute} />
          {page === "landing" ? (
            <LandingPage setPage={setPage} setPlay={setPlay} />
          ) : page === "chat" ? (
            <ChatWindow setPage={setPage} chatId={params?.chatId} />
          ) : (
            <GameComponent
              play={play}
              setPlay={setPlay}
              setMute={setIsMute}
              mute={isMute}
              setPage={setPage}
              score={score}
              setScore={setScore}
              chatId={params?.chatId}
            />
          )}
        </div>
      )}
    </>
  );
}
