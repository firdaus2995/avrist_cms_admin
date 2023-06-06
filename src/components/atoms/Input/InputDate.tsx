import React from 'react';
import PropTypes from 'prop-types';
import DateIcon from "../../../assets/date.png";

interface IInputDate {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputDate: React.FC<IInputDate> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onChange,
}) => {
  return (
    <div className={`form-control w-full ${containerStyle} `}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <div className={`relative rounded-3xl flex flex-row items-center justify-center input input-bordered w-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#D2D4D7] ${disabled ? 'bg-[#E9EEF4] ' : ''}`}>
        <input
          type='date'
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? ''}
          onChange={e => {
            onChange(e);
          }}
          className={`input-date rounded-3xl w-full h-full outline-0 ${disabled ? 'text-[#637488]' : ''}`}
        />
        <img src={DateIcon} className="w-[18px] h-[18px] cursor-pointer" />
      </div>
    </div>
  );
};

InputDate.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
