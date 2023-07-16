import React from "react";

import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";

interface ICheckbox {
  name: string;
  items: string[];
  other: boolean;
  required: boolean;
  errors: any;
  valueChange: (type: string, value: any) => void;
};

const Checkbox: React.FC<ICheckbox> = ({
  name,
  items,
  other,
  required,
  errors,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="CheckBox Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your checkbox name"
        roundStyle="lg"
        value={name}
        isError={errors.name}
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
        value={items.join(";")}
        isError={errors.name}
        onChange={(event: any) => {
          let arrayItem: any = event?.target?.value.split(";");
          if (arrayItem.length === 1 && arrayItem[0] === "") {
            arrayItem = [];
          };
          valueChange('items', arrayItem);
        }}
      />
      <CheckBox
        defaultValue={other}
        labelTitle="Other Value"
        labelContainerStyle="justify-start p-1"
        inputStyle="w-[20px] h-[20px]"
        updateFormValue={(event: any) => {
          valueChange('other', event.value);
        }}
      />
      <CheckBox
        defaultValue={required}
        labelTitle="Required Field"
        labelContainerStyle="justify-start p-1"
        inputStyle="w-[20px] h-[20px]"
        updateFormValue={(event: any) => {
          valueChange('required', event.value);
        }}
      />
    </React.Fragment>
  )
}

export default Checkbox;
