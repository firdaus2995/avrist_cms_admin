import React from "react";

import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";

interface ISubmitterEmail {
  name: string;
  placeholder: string;
  required: boolean;
  valueChange: (type: string, value: any) => void;
};

const SubmitterEmail: React.FC<ISubmitterEmail> = ({
  name,
  placeholder,
  required,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Submitter Email Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your submitter email name"
        roundStyle="lg"
        value={name}
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

export default SubmitterEmail;
