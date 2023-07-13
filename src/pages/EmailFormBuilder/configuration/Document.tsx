import React from "react";

import { CheckBox } from "@/components/atoms/Input/CheckBox";
import { InputText } from "@/components/atoms/Input/InputText";

interface IDocument {
  name: string;
  multiple: boolean;
  required: boolean;
  valueChange: (type: string, value: any) => void;
};

const Document: React.FC<IDocument> = ({
  name,
  multiple,
  required,
  valueChange,
}) => {
  return (
    <React.Fragment>
      <InputText
        labelTitle="Document Name"
        labelStyle="font-bold	"
        inputHeight={40}
        inputStyle="text-sm"
        placeholder="Enter your document name"
        roundStyle="lg"
        value={name}
        onChange={(event: any) => {
          valueChange('name', event.target.value);
        }}
      />
      <CheckBox
        defaultValue={multiple}
        labelTitle="Multiple Document"
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

export default Document;
