import React from "react";

import Radio from "../../../../components/molecules/Radio";
import AlignIcon from "../../../../assets/dummy/align.svg";
import { InputText } from "@/components/atoms/Input/InputText";

interface ILabel {
  name: string;
  position: string;
  alignment: string;
  errors: any;
  valueChange: (type: string, value: any) => void;
};

const TextField: React.FC<ILabel> = ({
  name,
  position,
  alignment,
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
      <Radio 
        labelTitle="Position"
        labelStyle="font-bold	"
        items={[
          {
            value: "TITLE",
            label: 'Title'
          },
          {
            value: "SUBTITLE",
            label: 'Subtitle',
          },
        ]}
        defaultSelected={position}
        onSelect={(event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
          if (event) {
            valueChange('position', value);
          }
        }}
      />
      {
        alignment && (
          <img src={AlignIcon} />
        )
      }
    </React.Fragment>
  )
}

export default TextField;
