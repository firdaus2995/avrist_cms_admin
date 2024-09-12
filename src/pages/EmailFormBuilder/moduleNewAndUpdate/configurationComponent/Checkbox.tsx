import React, { useEffect } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';

interface ICheckbox {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const Checkbox: React.FC<ICheckbox> = ({ data, configList, valueChange }) => {
  useEffect(() => {
    valueChange(
      'componentId',
      data?.name
        .toLowerCase()
        .replace(/[^a-z]/g, '-')
        .replace(/-+/g, '-'),
    );
  }, [data?.name]);

  return (
    <React.Fragment>
      <InputText
        labelTitle="CheckBox Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your checkbox name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <InputText
        labelTitle="CheckBox Value"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder='Use ";" to separate each value'
        roundStyle="lg"
        value={data?.items?.join(';')}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          let arrayItem: any = event?.target?.value.split(';');
          if (arrayItem.length === 1 && arrayItem[0] === '') {
            arrayItem = [];
          }
          valueChange('items', arrayItem);
        }}
      />
      <Config data={data} configList={configList} valueChange={valueChange} />
    </React.Fragment>
  );
};

export default Checkbox;
