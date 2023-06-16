import React, { 
  useState,
} from 'react';
import PropTypes from 'prop-types';
import PasswordHide from "../../../assets/password-hide.png";

interface IInputPassword {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  value?: string;
  placeholder?: string | null;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputPassword: React.FC<IInputPassword> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onChange,
}) => {
  const [type, setType] = useState("password");

  return (
    <div className={`form-control w-full ${containerStyle} `}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <div className={`rounded-3xl flex flex-row items-center justify-center input input-bordered w-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#D2D4D7] ${disabled ? 'bg-[#E9EEF4] ' : ''}`}>
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
  );
};

InputPassword.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
