import React, { useState, useEffect } from 'react';

import Config from './Config';
import { InputText } from '@/components/atoms/Input/InputText';
import FormList from '@/components/molecules/FormList';

interface ITNC {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
}

const TNC: React.FC<ITNC> = ({ data, configList, valueChange }) => {
  const [inputTextValue, setInputTextValue] = useState(data?.name);

  useEffect(() => {
    valueChange('componentId', data?.name.toLowerCase().replace(/[^a-z]/g, '-'));
  }, [data?.name]);

  return (
    <React.Fragment>
      <InputText
        labelTitle="TnC Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your term and condition name"
        roundStyle="lg"
        value={inputTextValue}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          setInputTextValue(event.target.value);
          valueChange('name', event.target.value);
        }}
      />
      <FormList.FileUploaderV3
        key={data?.name}
        id={data?.name}
        fieldTypeLabel="Upload TnC Document"
        isDocument={true}
        multiple={false}
        border={false}
        parentData={data}
        error={data?.mandatory?.items}
        items={data?.items}
        helperText="This field is required"
        onChange={(e: any) => {
          valueChange('items', e);
        }}
      />
      <Config data={data} configList={configList} valueChange={valueChange} />
    </React.Fragment>
  );
};

export default TNC;
