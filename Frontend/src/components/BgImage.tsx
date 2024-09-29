import Image from "next/image";

const BgImage = () => {
  return (
    <div className="relative flex-col h-screen bg-black">
      {/* Background Image */}
      <div className="absolute h-[90%] top-0 right-0 left-0 z-0">
        <Image
          src="/bg.png"
          alt="bg"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Bot Image */}
      <div className="relative h-[75%] z-10 flex items-end justify-center">
        <img
          src="/botimg.png"
          alt="bot"
          className="w-[100%] h-auto object-contain"
        />
      </div>

      {/* Cloud Image */}
      <div className="absolute bottom-20 w-full z-20">
        <img src="/cloud.png" alt="cloud" className="w-full object-contain" />
      </div>
    </div>
  );
};

export default BgImage;