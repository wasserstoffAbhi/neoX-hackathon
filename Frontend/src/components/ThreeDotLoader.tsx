'use client';

const ThreeDotLoader: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="flex">
        <div className="w-2 h-2 m-1 bg-gray-400 rounded-full animate-scaleUpDown delay-300"></div>
        <div className="w-2 h-2 m-1 bg-gray-400 rounded-full animate-scaleUpDown delay-600"></div>
        <div className="w-2 h-2 m-1 bg-gray-400 rounded-full animate-scaleUpDown delay-900"></div>
      </div>
    </div>
  );
};

export default ThreeDotLoader;
