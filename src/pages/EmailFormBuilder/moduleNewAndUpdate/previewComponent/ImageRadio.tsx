import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import DeleteComponentIcon from '../../../../assets/efb/preview-delete.svg';
import { getImage } from '../../../../services/Images/imageUtils';

interface IRadio {
  name: string;
  items: string[];
  other?: boolean;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const ImageRadio: React.FC<IRadio> = ({ name, items, other, isActive, onClick, onDelete }) => {
  const nameId: any = uuidv4();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const urls = await Promise.all(items.map(async (element: any) => await getImage(element)));
      setImageUrls(urls);
    };

    void loadImages();
  }, [items]);

  return (
    <div
      className={`flex flex-col py-4 px-4 bg-light-purple-2 rounded-xl gap-2 border-[1px] ${
        isActive ? 'border-lavender' : 'border-light-purple-2'
      }`}
      onClick={onClick}>
      <p className="font-bold text-sm">{name}</p>
      <div className="flex flex-row gap-2">
        <div className="w-full flex flex-col gap-4">
          {items?.map((_element: any, index: number) => (
            <label key={index} className="label cursor-pointer justify-start flex gap-2 p-0">
              <input
                type="radio"
                name={nameId}
                className="radio radio-primary h-[22px] w-[22px] bg-white"
              />
              <div
                className="w-32 h-32 bg-[#5E217C] bg-cover"
                style={{ backgroundImage: `url(${imageUrls[index]})` }}></div>
            </label>
          ))}
          {other && (
            <label className="label cursor-pointer justify-start flex h-[34px] gap-2 p-0">
              <input
                type="radio"
                name={nameId}
                className="radio radio-primary h-[22px] w-[22px] bg-white"
              />
              <span className="w-full label-text text-other-grey border-b-[1px] border-other-grey">
                Other
              </span>
            </label>
          )}
        </div>
        <img
          src={DeleteComponentIcon}
          className="cursor-pointer self-start"
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
            onDelete();
          }}
        />
      </div>
    </div>
  );
};

export default ImageRadio;
