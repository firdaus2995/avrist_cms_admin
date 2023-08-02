import React from "react";

import Config from "./Config";
import { InputText } from "@/components/atoms/Input/InputText";

interface IImage {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
};

const Image: React.FC<IImage> = ({
  data,
  configList,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Image Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your image name"
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

export default Image;
