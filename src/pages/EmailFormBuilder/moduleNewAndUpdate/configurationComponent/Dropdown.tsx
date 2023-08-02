import React from "react";

import Config from "./Config";
import { InputText } from "@/components/atoms/Input/InputText";

interface IDropdown {
  data: any;
  configList: any;
  valueChange: (type: string, value: any) => void;
};

const Dropdown: React.FC<IDropdown> = ({
  data,
  configList,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Dropdown Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your dropdown name"
        roundStyle="lg"
        value={data?.name}
        isError={data?.mandatory?.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <InputText
        labelTitle="Dropdown Value"
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

export default Dropdown;
