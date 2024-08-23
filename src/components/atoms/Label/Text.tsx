import React from 'react';

interface ILabelText {
  labelTitle: string;
  labelWidth?: number | string;
  labelStyle?: string;
  labelRequired?: boolean;
  value: string;
  valueWidth?: number | string;
  valueStyle?: string;
  rawValueHTML?: boolean;
}

export const LabelText: React.FC<ILabelText> = ({
  labelTitle,
  labelWidth = 225,
  labelStyle,
  labelRequired,
  value,
  valueWidth = '100%',
  valueStyle,
  rawValueHTML,
}) => {
  return (
    <div className={`flex flex-row`}>
      <label
        className={`font-bold text-sm	${labelStyle}`}
        style={{
          width: labelWidth,
          minWidth: labelWidth,
        }}
      >
        {labelTitle}<span className={'text-reddist text-sm'}>{labelRequired ? '*' : ''}</span>
      </label>
      <div
        className={`text-sm	${valueStyle}`}
        style={{
          width: valueWidth,
        }}
      >
        {
          rawValueHTML ? (
            <div dangerouslySetInnerHTML={{ __html: value}} />
          ) : (
            value
          )
        }
      </div>
    </div>
  );
};
