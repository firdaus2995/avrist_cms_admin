import React, { useEffect } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';

interface IPhoneNumber {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const PhoneNumber: React.FC<IPhoneNumber> = ({ data, configList, valueChange }) => {
  useEffect(() => {
    valueChange('componentId', data?.name.toLowerCase().replace(/[^a-z]/g, '-'));
  }, [data?.name]);
  return (
    <React.Fragment>
      <InputText
        labelTitle="PhoneNumber Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your phone number name"
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

export default PhoneNumber;
