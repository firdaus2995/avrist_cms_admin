import { useState, useEffect } from 'react';
import { getImageOld } from '../../../utils/imageUtils';

interface ImageRadioFieldProps {
  name: string;
  required: boolean;
  items: any;
  nameId: string;
}

function ImageRadioField({ name, required, items, nameId }: ImageRadioFieldProps): JSX.Element {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = await Promise.all(
          items.map(async (element: any) => {
            return await getImageOld(element.value);
          }),
        );
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchImages();
  }, [items]);

  return (
    <div className="my-2">
      <label className={`label font-bold`}>
        <span className={`label-text text-base-content`}>
          {name}
          {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
        </span>
      </label>
      <div className="w-full flex flex-col gap-4">
        {isLoading ? (
          <div className="text-primary">Loading images...</div>
        ) : (
          items.map((_element: any, index: any) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default ImageRadioField;
