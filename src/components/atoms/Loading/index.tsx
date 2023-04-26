import { LoadingCircle } from './loadingCircle';
import React from 'react';
const Loading: React.FC<{ placedOnContainer?: boolean }> = ({ placedOnContainer = false }) => {
  return (
    <div
      className={`w-full ${
        placedOnContainer ? 'h-full' : 'h-screen'
      } flex justify-center items-center flex-col gap-4`}>
      <div className="flex justify-center text-center items-center ">
        <p className="font-lato text-gray-700 font-bold">Apriz lazy load here</p>
      </div>
      <LoadingCircle />
    </div>
  );
};
export default Loading;
