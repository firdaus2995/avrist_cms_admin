import { LoadingCircle } from './loadingCircle';
import React from 'react';
import { t } from 'i18next';
const Loading: React.FC<{ placedOnContainer?: boolean }> = ({ placedOnContainer = false }) => {
  return (
    <div
      className={`w-full ${
        placedOnContainer ? 'h-full' : 'h-screen'
      } flex justify-center items-center flex-col gap-4`}>
      <div className="flex justify-center text-center items-center ">
        <p className="font-lato text-gray-700 font-bold">{t('components.atoms.loading')}</p>
      </div>
      <LoadingCircle />
    </div>
  );
};
export default Loading;
