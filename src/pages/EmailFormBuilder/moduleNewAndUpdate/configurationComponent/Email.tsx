import React from "react";

import Config from "./Config";
import { InputText } from "@/components/atoms/Input/InputText";

interface IEmail {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
};

const Email: React.FC<IEmail> = ({
  data,
  configList,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Email Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your email name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <Config
        data={data}
        configList={configList}
        valueChange={valueChange}
      />
    </React.Fragment>
  )
}

export default Email;
