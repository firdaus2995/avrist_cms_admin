import React from "react";

import Config from "./Config";
import { InputText } from "@/components/atoms/Input/InputText";

interface IRadio {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
};

const Radio: React.FC<IRadio> = ({
  data,
  configList,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Radio Button Name"
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
      <InputText
        labelTitle="Radio Button Value"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder='Use ";" to separate each value'
        roundStyle="lg"
        value={data?.items.join(";")}
        isError={data?.mandatory?.items}
        onChange={(event: any) => {
          let arrayItem: any = event?.target?.value.split(";");
          if (arrayItem.length === 1 && arrayItem[0] === "") {
            arrayItem = [];
          };
          console.log(arrayItem)
          valueChange('items', arrayItem);
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

export default Radio;
