import React from 'react';

import Radio from '@/components/molecules/Radio';
import TextAlignLeft from '../../../../../assets/text-align-left.svg';
import TextAlignCenter from '../../../../../assets/text-align-center.svg';
import TextAlignRight from '../../../../../assets/text-align-right.svg';
import TextAlignLeftWhite from '../../../../../assets/text-align-left-white.svg';
import TextAlignCenterWhite from '../../../../../assets/text-align-center-white.svg';
import TextAlignRightWhite from '../../../../../assets/text-align-right-white.svg';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { InputText } from '@/components/atoms/Input/InputText';

interface IConfig {
  data: any;
  configList: any;
  valueChange: any;
}

const Config: React.FC<IConfig> = ({ data, configList, valueChange }) => {
  console.log(configList);
  return configList?.map((element: any, index: number) => {
    switch (element.type) {
      case 'text_field':
        return (
          <InputText
            key={index}
            labelTitle={element.label}
            labelStyle="font-bold"
            inputHeight={40}
            inputStyle="text-sm"
            placeholder="Enter your placeholder"
            roundStyle="lg"
            value={data[element.code]}
            onChange={(event: any) => {
              valueChange(element.code, event.target.value);
            }}
          />
        );
      case 'component_id':
        return (
          <InputText
            key={index}
            readOnly
            labelTitle={element.label}
            labelStyle="font-bold"
            inputHeight={40}
            inputStyle="text-sm"
            placeholder="Enter your name"
            roundStyle="lg"
            value={data[element.code]}
            onChange={(event: any) => {
              valueChange(element.code, event.target.value);
            }}
          />
        );
      case 'number':
        return (
          <InputText
            key={index}
            labelTitle={element.label}
            labelStyle="font-bold"
            type="number"
            inputHeight={40}
            inputStyle="text-sm"
            placeholder="Enter the number"
            roundStyle="lg"
            value={data[element.code]}
            onChange={(event: any) => {
              valueChange(element.code, event.target.value);
            }}
          />
        );
      case 'checkbox':
        if (element.value.length > 0) {
          return (
            <div className="flex flex-col gap-2 mt-2">
              <p className="font-bold text-sm">{element.label}</p>
              {element.value.map((item: any, idx: number) => {
                const code = element.label.toLowerCase();
                const variableName = code.includes('date')
                  ? 'date_validation'
                  : code.includes('currency')
                  ? 'currency'
                  : code.includes('hidden')
                  ? 'hidden'
                  : element.code;

                return (
                  <CheckBox
                    key={idx}
                    defaultValue={data[variableName] === item.code}
                    labelTitle={item.label}
                    labelContainerStyle="justify-start p-1"
                    inputStyle="w-[20px] h-[20px]"
                    updateFormValue={() => {
                      valueChange(variableName, item.code);
                    }}
                  />
                );
              })}
            </div>
          );
        } else {
          return (
            <CheckBox
              key={index}
              defaultValue={data[element.code]}
              labelTitle={element.label}
              labelContainerStyle="justify-start p-1"
              inputStyle="w-[20px] h-[20px]"
              updateFormValue={(event: any) => {
                valueChange(element.code, event.value);
              }}
            />
          );
        }

      case 'number_field_multiple':
        return (
          <div className="flex flex-row gap-3">
            {element.value.map((childElement: any, childIndex: number) => (
              <InputText
                key={childIndex}
                type="number"
                labelTitle={childElement.label}
                labelTitleExtension={!childElement.isMandatory ? '(Optional)' : ''}
                labelStyle="font-bold	"
                labelTitleExtensionStyle={!childElement.isMandatory ? '!text-xs !font-normal' : ''}
                inputHeight={40}
                inputStyle="text-sm"
                roundStyle="lg"
                value={data[childElement.code]}
                onChange={(event: any) => {
                  valueChange(childElement.code, event.target.value);
                }}
              />
            ))}
          </div>
        );
      case 'radio_button': {
        const modifiedItems: any[] = element.value.map((element: any) => {
          return {
            value: element.code.toUpperCase(),
            label: element.label,
          };
        });

        return (
          <Radio
            labelTitle="Position"
            labelStyle="font-bold	"
            items={modifiedItems}
            defaultSelected={data[element.code]}
            onSelect={(
              event: React.ChangeEvent<HTMLInputElement>,
              value: string | number | boolean,
            ) => {
              if (event) {
                valueChange(element.code, value);
              }
            }}
          />
        );
      }
      case 'custom_label_position':
        return (
          <div className="flex flex-row p-2 rounded-lg bg-[#EDEDED]">
            <div
              className={`h-[30px] flex flex-1 justify-center items-center ${
                data[element.code] === 'LEFT' ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'
              } cursor-pointer rounded-tl-lg rounded-bl-lg`}
              onClick={() => {
                valueChange(element.code, 'LEFT');
              }}>
              <img src={data[element.code] === 'LEFT' ? TextAlignLeftWhite : TextAlignLeft} />
            </div>
            <div
              className={`h-[30px] flex flex-1 justify-center items-center ${
                data[element.code] === 'MIDDLE' ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'
              } cursor-pointer border-l-[1px] border-r-[1px] border-[#BCBAB9]`}
              onClick={() => {
                valueChange(element.code, 'MIDDLE');
              }}>
              <img src={data[element.code] === 'MIDDLE' ? TextAlignCenterWhite : TextAlignCenter} />
            </div>
            <div
              className={`h-[30px] flex flex-1 justify-center items-center ${
                data[element.code] === 'RIGHT' ? 'bg-[#3E84F7]' : 'bg-[#D6D4D3]'
              } cursor-pointer rounded-tr-lg rounded-br-lg`}
              onClick={() => {
                valueChange(element.code, 'RIGHT');
              }}>
              <img src={data[element.code] === 'RIGHT' ? TextAlignRightWhite : TextAlignRight} />
            </div>
          </div>
        );
      default:
        return <div>NOT DETECTED</div>;
    }
  });
};

export default Config;
