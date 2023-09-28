import React from 'react';

interface ILabelText {
  labelTitle: string;
  labelWidth?: number | string;
  labelStyle?: string;
  labelRequired?: boolean;
  value: string;
  valueWidth?: number | string;
  valueStyle?: string;
}

export const LabelText: React.FC<ILabelText> = ({
  labelTitle,
  labelWidth = 225,
  labelStyle,
  labelRequired,
  value,
  valueWidth = '100%',
  valueStyle,
}) => {
  return (
    <div className={`flex flex-row`}>
      <label
        className={`font-bold text-base	${labelStyle}`}
        style={{
          width: labelWidth,
          minWidth: labelWidth,
        }}
      >
        {labelTitle}<span className={'text-reddist text-base'}>{labelRequired ? '*' : ''}</span>
      </label>
      <div
        className={`text-base	${valueStyle}`}
        style={{
          width: valueWidth,
        }}
      >
        {value}
      </div>
    </div>
  );
};
