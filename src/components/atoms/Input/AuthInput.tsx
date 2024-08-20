import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../Typography';
import WarningFill from '../../../assets/warning-fill.svg';

// BELUM DIRAPIHKAN
interface IAuthInputProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  styleClass?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordMode?: boolean;
  labelWidth?: string;
  isStatic?: boolean;
}

interface IPasswordInputProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}

export function PasswordInput({ id, onChange, placeholder, value }: IPasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible(prevState => !prevState);
  }

  return (
    <div className="relative container mx-auto">
      <input
        id={id}
        onChange={onChange}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        className="
        w-full
        focus:ring-primary
        focus:border-primary
        focus:ring-1
        px-4
        py-2
        text-sm
        border-2
        border-gray-300
        rounded-2xl
        outline-none"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
        onClick={togglePasswordVisibility}>
        {isPasswordVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

const AuthInput: React.FC<IAuthInputProps> = ({
  label,
  placeholder,
  error,
  styleClass,
  onChange,
  value,
  passwordMode,
  labelWidth,
  isStatic,
}) => {
  const hasError = !!error;
  const classNames = `flex justify-between ${styleClass}`;

  return (
    <div className={classNames}>
      <Typography
        type="body"
        size="normal"
        weight="medium"
        className={`mt-2 mr-5 ${labelWidth ?? 'basis-1/4'}`}>
        {label}
      </Typography>
      <div className={`flex flex-col ${isStatic ? 'w-[65%]' : 'flex-grow'} flex-2`}>
        {passwordMode ? (
          <PasswordInput
            id={label}
            placeholder={placeholder}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e);
            }}
          />
        ) : (
          <input
            className={`
            w-full
            focus:ring-primary
            focus:border-primary
            focus:ring-1
            px-4
            py-2
            text-sm
            border-2
            border-gray-300
            rounded-2xl
            outline-none`}
            type={'text'}
            id={label}
            placeholder={placeholder}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e);
            }}
          />
        )}
        {hasError && (
          <div className="flex flex-row mt-1">
            <img src={WarningFill} className="mr-2" />
            <Typography type="body" size="xs" weight="regular" className="text-error">
              {error}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

AuthInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
  styleClass: PropTypes.string,
  passwordMode: PropTypes.bool,
};

export default AuthInput;
