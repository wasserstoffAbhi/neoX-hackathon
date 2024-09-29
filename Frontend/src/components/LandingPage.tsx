import Image from "next/image";

const LandingPage = ({
  setPage,
  setPlay,
}: {
  setPage: (val: string) => void;
  setPlay: (val: boolean) => void;
}) => {
  return (
    <div className="relative flex-col h-screen bg-[#EDF2E4]">
      {/* Bot Image */}
      <div className="relative h-[75%] pt-5 z-10 flex items-start justify-center">
        <img
          src="/botimg.png"
          alt="bot"
          className="w-[100%] h-auto object-contain"
        />
      </div>
      <div className="absolute bottom-0 h-[50%] w-full z-20">
        <div className="flex flex-col h-full items-center justify-center">
          <div className="h-10 flex w-full relative">
            <div className="waveleft w-[50%]">
              <div></div>
            </div>
            <div className="waveright w-[50%]">
              <div></div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start h-full w-full bg-[#D6E1C1] px-5 py-10 gap-0">
            {/* "Join Now" Heading */}
            <div className="flex flex-col gap-5 mb-9">
              <div className="text-lg font-semibold text-[#769145]">
                Join Now
              </div>

              {/* Main Heading */}
              <div className="text-4xl font-semibold text-[#3E4C24] text-start text-wrap">
                BotGame & Chat Platform
              </div>

              {/* Description */}
              <div className="text-base font-medium text-[#060703] text-start">
                Earn token rewards by playing a fun tap game on the Neox
                blockchain, while an AI chatbot answers your wallet,
                transaction, and NeoX documentation queries in real-time.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center w-full gap-2">
              {/* Play Now Button */}
              <button
                onClick={() => {
                  setPage("game");
                  // setPlay(true);
                }}
                className="bg-[#222914] text-white py-3 px-14 rounded-lg text-xl font-semibold hover:bg-[#1E301E] transition-all text-nowrap"
              >
                Play Now
              </button>

              {/* Chat Button */}
              <button
                onClick={() => setPage("chat")}
                className="border-2 border-[#222914] text-[#222914] py-3 px-14 rounded-lg text-xl font-semibold hover:bg-[#F0F2ED] transition-all"
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
