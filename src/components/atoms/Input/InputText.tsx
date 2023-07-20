import { HTMLInputTypeAttribute } from 'react';
import PropTypes from 'prop-types';
import ErrorSmallIcon from "../../../assets/error-small.svg";

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
  suffix?: React.ReactNode;
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
  placeholder,
  disabled,
  onChange,
  inputStyle,
  direction,
  roundStyle = '3xl',
  themeColor,
  inputWidth,
  inputHeight,
  name,
  isError,
  suffix,
}) => {
  return (
    <div
      className={`form-control w-full ${containerStyle} ${direction === 'row' ? 'flex-row' : ''}`}>
      <label
        style={{
          width: direction === 'row' ? labelWidth : '',
        }}
        className={`label`}>
        <span className={`label-text text-base-content ${labelStyle}`}>
          {labelTitle} {labelTitleExtension && <span className={labelTitleExtensionStyle}>{labelTitleExtension}</span>}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </span>
      </label>
      <div style={{
        width: inputWidth ?? '100%',
        height: inputHeight ?? '',
      }} className={`input input-bordered ${`rounded-${roundStyle}`} ${themeColor ? `border-${themeColor}` : ''} focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-${themeColor ?? '[#D2D4D7]'} ${disabled ? 'bg-[#E9EEF4] ' : ''} ${isError && 'border-reddist'}`}>
        <input
          name={name}
          type={type ?? 'text'}
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? ''}
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
      {
        isError && (
          <div className='flex flex-row px-1 py-2'>
            <img src={ErrorSmallIcon} className='mr-3' />
            <p className='text-reddist text-sm'>This field is required</p>
          </div>
        )
      }
    </div>
  );
};

InputText.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelTitleExtension: PropTypes.string,
  labelStyle: PropTypes.string,
  labelTitleExtensionStyle: PropTypes.string,
  labelRequired: PropTypes.bool,
  labelWidth: PropTypes.number,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  direction: PropTypes.string,
  inputStyle: PropTypes.string,
  roundStyle: PropTypes.string,
  themeColor: PropTypes.string,
  inputWidth: PropTypes.number,
  inputHeight: PropTypes.number,
  name: PropTypes.string,
  isError: PropTypes.bool,
  suffix: PropTypes.node,
};
