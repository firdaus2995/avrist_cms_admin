import React from 'react';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import CkEditor from '@/components/atoms/Ckeditor';

export const LoopingBannerForm: React.FC<any> = ({ formData, onChange, onRemove, isRemovable }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    const updatedFormData: FormData = { ...formData, [name]: value };
    onChange(updatedFormData);
  };

  const handleRemove = (): void => {
    if (isRemovable) {
      onRemove();
    }
  };

  return (
    <div>
      <div className="rounded-xl shadow-md p-5 mb-10">
        <InputText
          labelTitle="Text Field"
          labelStyle="font-bold text-base w-48"
          direction="row"
          themeColor="lavender"
          roundStyle="xl"
          value={formData.field1}
          onChange={handleInputChange}
        />
        <div className="flex flex-row">
          <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
            Text Area
          </Typography>
          <TextArea
            labelTitle=""
            placeholder={'Enter description'}
            value={formData.field2}
            containerStyle="rounded-3xl"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-row mt-5">
          <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
            Text Editor
          </Typography>
          <CkEditor />
        </div>
        <div className="flex flex-row mt-5">
          <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
            Image Banner
          </Typography>
          <div className="w-1/3 rounded-lg h-24 bg-red-50"></div>
        </div>
      </div>
      {isRemovable && false && (
        <button type="button" onClick={handleRemove}>
          Remove
        </button>
      )}
    </div>
  );
};
