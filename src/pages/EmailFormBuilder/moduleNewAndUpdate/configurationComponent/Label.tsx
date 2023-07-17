import React from "react";

import Radio from "../../../../components/molecules/Radio";
import TextAlignLeft from "../../../../assets/text-align-left.svg";
import TextAlignCenter from "../../../../assets/text-align-center.svg";
import TextAlignRight from "../../../../assets/text-align-right.svg";
import TextAlignLeftWhite from "../../../../assets/text-align-left-white.svg";
import TextAlignCenterWhite from "../../../../assets/text-align-center-white.svg";
import TextAlignRightWhite from "../../../../assets/text-align-right-white.svg";
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
      <div className="flex flex-row p-2 rounded-lg bg-[#EDEDED]">
        <div 
          className={`h-[30px] flex flex-1 justify-center items-center ${alignment === "LEFT" ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'} cursor-pointer rounded-tl-lg rounded-bl-lg`}
          onClick={() => {
            valueChange('alignment', 'LEFT');
          }}
        >
          <img src={alignment === "LEFT" ? TextAlignLeftWhite : TextAlignLeft} />
        </div>
        <div 
          className={`h-[30px] flex flex-1 justify-center items-center ${alignment === "CENTER" ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'} cursor-pointer border-l-[1px] border-r-[1px] border-[#BCBAB9]`}
          onClick={() => {
            valueChange('alignment', 'CENTER');
          }}
        >
          <img src={alignment === "CENTER" ? TextAlignCenterWhite : TextAlignCenter} />
        </div>
        <div 
          className={`h-[30px] flex flex-1 justify-center items-center ${alignment === "RIGHT" ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'} cursor-pointer rounded-tr-lg rounded-br-lg`}
          onClick={() => {
            valueChange('alignment', 'RIGHT');
          }}
        >
          <img src={alignment === "RIGHT" ? TextAlignRightWhite : TextAlignRight} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default TextField;
