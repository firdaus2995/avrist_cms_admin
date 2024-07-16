import React, { useEffect } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';

interface INumber {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const Number: React.FC<INumber> = ({ data, configList, valueChange }) => {
  useEffect(() => {
    valueChange('componentId', data?.name.toLowerCase().replace(/[^a-z]/g, '-'));
  }, [data?.name]);
  return (
    <React.Fragment>
      <InputText
        labelTitle="Number Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your number name"
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

export default Number;
