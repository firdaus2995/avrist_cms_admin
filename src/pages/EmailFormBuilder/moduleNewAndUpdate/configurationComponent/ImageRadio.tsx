import React from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';
import FormList from '../../../../components/molecules/FormList';

interface IRadio {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const ImageRadio: React.FC<IRadio> = ({ data, configList, valueChange }) => {

  return (
    <React.Fragment>
      <InputText
        labelTitle="Image Radio Button Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your radio button name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <FormList.FileUploaderV3
        key={data?.name}
        id={data?.name}
        fieldTypeLabel="Image Option"
        labelRequired={true}
        isDocument={false}
        multiple={true}
        onChange={(e: any) => {
          valueChange('items', e);
        }}
        border={false}
      />
      <Config
        data={data}
        configList={configList}
        valueChange={valueChange}
      />
    </React.Fragment>
  );
};

export default ImageRadio;
