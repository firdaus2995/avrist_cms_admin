import React from "react";

import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";

interface ITextField {
  name: string;
  placeholder: string;
  multiple: boolean;
  required: boolean;
  errors: any;
  valueChange: (type: string, value: any) => void;
};

const TextField: React.FC<ITextField> = ({
  name,
  placeholder,
  multiple,
  required,
  errors,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Text Field Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your text field name"
        roundStyle="lg"
        value={name}
        isError={errors.name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <InputText
        labelTitle="Placeholder Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your placeholder"
        roundStyle="lg"
        value={placeholder}
        onChange={(event: any) => {
          valueChange('placeholder', event.target.value);
        }}
      />
      <CheckBox
        defaultValue={multiple}
        labelTitle="Multiple Value Input"
        labelContainerStyle="justify-start p-1"
        inputStyle="w-[20px] h-[20px]"
        updateFormValue={(event: any) => {
          valueChange('multiple', event.value);
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

export default TextField;
