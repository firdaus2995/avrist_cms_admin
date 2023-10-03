import React, { useState } from 'react';

import PasswordHide from "../../../assets/password-hide.png";
import ErrorSmallIcon from "../../../assets/error-small.svg";
import { t } from 'i18next';

interface IInputPassword {
  labelTitle: string;
  labelStyle?: string;
  labelWidth?: number;
  containerStyle?: string;
  direction?: string;
  value?: string;
  placeholder?: string | null;
  roundStyle?: string;
  themeColor?: string;
  isError?: boolean;
  errorMessage?: string;
  actionLink?: string;
  actionLinkClicked?: any;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputPassword: React.FC<IInputPassword> = ({
  labelTitle,
  labelStyle = '',
  labelWidth = 225,
  containerStyle = '',
  direction,
  value,
  placeholder,
  roundStyle = '3xl',
  themeColor,
  isError,
  errorMessage,
  actionLink,
  actionLinkClicked,
  disabled,
  onChange,
}) => {
  const [type, setType] = useState("password");

  return (
    <div className='w-full flex flex-col gap-2'>
      <div className={`form-control w-full ${containerStyle} ${direction === 'row' ? 'flex-row' : ''}`}>
        <label 
          style={{
            width: direction === 'row' ? labelWidth : '',
            minWidth: direction === 'row' ? labelWidth : '',
          }}
          className="label"
        >
          <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
        </label>
        <div 
          className={`
            flex flex-row items-center justify-center input input-bordered w-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 
            rounded-${roundStyle} 
            ${themeColor && `border-${themeColor}`} 
            focus-within:outline-${themeColor ?? '[#D2D4D7]'} 
            ${disabled && 'bg-[#E9EEF4] '} 
            ${isError && 'border-reddist'}
          `}
        >
          <input
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder ?? ''}
            onChange={e => {
              if (onChange) {
                onChange(e);
              }
            }}
            className={`rounded-3xl w-full h-full outline-0 ${disabled ? 'text-[#637488]' : ''}`}
          />
          <img src={PasswordHide} className="w-[24px] h-[24px] cursor-pointer" onClick={() => {
            if (!disabled) {
              if (type === "password") {
                setType("text")
              } else {
                setType("password");
              };
            }
          }}/>
        </div>
      </div>
      {
        (isError || actionLink) && ( //eslint-disable-line
          <div 
            style={{
              marginLeft: direction === 'row' ? labelWidth : '',
            }}
            className='flex flex-row items-center justify-between'
          >
            {
              isError ? (
                <div 
                  className={`flex flex-row`}
                >
                  <img src={ErrorSmallIcon} className='mr-3' />
                  <p className='text-reddist text-sm'>
                    {
                      errorMessage ?? t('components.atoms.required')
                    }
                  </p>
                </div>
              ) : (
                <div />
              )
            }
            {
              actionLink ? (
                <p 
                  className='text-[14px] text-purple cursor-pointer'
                  onClick={() => {
                    actionLinkClicked();
                  }}
                >
                  {actionLink}
                </p>
              ) : (
                <div />
              )
            }
          </div>
        )
      }
    </div>
  );
};
