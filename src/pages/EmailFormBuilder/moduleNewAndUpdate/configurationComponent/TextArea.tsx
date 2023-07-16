import React from "react";

import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";

interface ITextArea {
  name: string;
  placeholder: string;
  minLength: number;
  maxLength: number;
  multiple: boolean;
  required: boolean;
  errors: any;
  valueChange: (type: string, value: any) => void;
};

const TextArea: React.FC<ITextArea> = ({
  name,
  placeholder,
  minLength,
  maxLength,
  multiple,
  required,
  errors,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Text Area Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your text area name"
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
      <div className="flex flex-row gap-3">
        <InputText
          type="number"
          labelTitle="Min. Length"
          labelStyle="font-bold	"
          inputHeight={40}
          inputStyle="text-sm"
          roundStyle="lg"
          value={minLength}
          onChange={(event: any) => {
            valueChange('minLength', event.target.value);
          }}
        />
        <InputText
          type="number"
          labelTitle="Max. Length"
          labelStyle="font-bold	"
          inputHeight={40}
          inputStyle="text-sm"
          roundStyle="lg"
          value={maxLength}
          onChange={(event: any) => {
            valueChange('maxLength', event.target.value);
          }}
        />
      </div>
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

export default TextArea;
