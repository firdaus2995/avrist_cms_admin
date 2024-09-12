import React, { useEffect } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';

interface ITextArea {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const TextArea: React.FC<ITextArea> = ({ data, configList, valueChange }) => {
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
        labelTitle="Text Area Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your text area name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <Config data={data} configList={configList} valueChange={valueChange} />
    </React.Fragment>
  );
};

export default TextArea;
