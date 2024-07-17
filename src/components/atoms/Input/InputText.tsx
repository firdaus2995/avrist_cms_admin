import React, { HTMLInputTypeAttribute } from 'react';

import ErrorSmallIcon from '../../../assets/error-small.svg';
import { t } from 'i18next';

interface IInputText {
  labelTitle: string;
  labelTitleExtension?: string;
  labelStyle?: string;
  labelTitleExtensionStyle?: string;
  labelRequired?: boolean;
  labelWidth?: number;
  inputStyle?: string;
  type?: HTMLInputTypeAttribute;
  containerStyle?: string;
  value?: string | number;
  maxLength?: number;
  placeholder?: string | null;
  disabled?: boolean;
  direction?: string;
  roundStyle?: string;
  themeColor?: string;
  inputWidth?: number;
  inputHeight?: number;
  isError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  helperText?: any;
  suffix?: React.ReactNode;
  readOnly?: boolean;
}

export const InputText: React.FC<IInputText> = ({
  labelTitle,
  labelTitleExtension,
  labelStyle = '',
  labelTitleExtensionStyle = '',
  labelRequired,
  labelWidth = 225,
  type,
  containerStyle = '',
  value,
  maxLength,
  placeholder,
  disabled,
  onChange,
  inputStyle,
  direction,
  roundStyle = 'xl',
  themeColor,
  inputWidth,
  inputHeight,
  name,
  isError,
  helperText,
  suffix,
  readOnly,
}) => {
  return (
    <div className={`${direction === 'row' ? '' : 'w-full'}`}>
      <div
        className={`form-control w-full ${containerStyle} ${
          direction === 'row' ? 'flex-row' : ''
        }`}>
        <label
          style={{
            width: direction === 'row' ? labelWidth : '',
            minWidth: direction === 'row' ? labelWidth : '',
          }}
          className={`label`}>
          <span className={`label-text text-base-content ${labelStyle}`}>
            {labelTitle}{' '}
            {labelTitleExtension && (
              <span className={labelTitleExtensionStyle}>{labelTitleExtension}</span>
            )}
            <span className={'text-reddist text-base-content'}>{labelRequired ? '*' : ''}</span>
          </span>
        </label>
        <div
          style={{
            width: inputWidth ?? '100%',
            height: inputHeight ?? '',
          }}
          className={`input input-bordered rounded-${roundStyle} ${
            themeColor ? `border-${themeColor}` : ''
          } focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-${
            themeColor ?? '[#D2D4D7]'
          } ${disabled ? 'bg-[#E9EEF4] ' : ''} ${isError && 'border-reddist'}`}>
          <input
            name={name}
            type={type ?? 'text'}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder ?? ''}
            maxLength={maxLength ?? undefined}
            onChange={e => {
              if (onChange) {
                onChange(e);
              }
            }}
            className={`w-full h-full rounded-3xl px-1 outline-0 ${inputStyle} ${
              disabled ? 'text-[#637488]' : ''
            }`}
          />
          <div className="relative right-8">{suffix ?? ''}</div>
        </div>
        {isError && (direction === 'column' || !direction) && (
          <div className="flex flex-row px-1 py-2">
            <img src={ErrorSmallIcon} className="mr-3" />
            <p className="text-reddist text-sm">{helperText ?? t('components.atoms.required')}</p>
          </div>
        )}
      </div>
      {isError && direction === 'row' && (
        <div
          className="flex flex-row px-1 py-2"
          style={{
            marginLeft: labelWidth,
          }}>
          <img src={ErrorSmallIcon} className="mr-3" />
          <p className="text-reddist text-sm">{helperText ?? t('components.atoms.required')}</p>
        </div>
      )}
    </div>
  );
};
