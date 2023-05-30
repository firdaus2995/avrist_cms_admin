import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '../Typography';
import WarningFill from '../../../assets/warning-fill.svg';

interface IAuthInputProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  styleClass?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordMode?: boolean;
}

const AuthInput: React.FC<IAuthInputProps> = ({
  label,
  placeholder,
  error,
  styleClass,
  onChange,
  value,
  passwordMode,
}) => {
  const hasError = !!error;
  const classNames = `flex justify-between ${styleClass}`;
  return (
    <div className={classNames}>
      <Typography type="body" size="normal" weight="medium" styleClass="mt-2 mr-5 basis-1/4">
        {label}
      </Typography>
      <div className="flex flex-col flex-grow flex-2">
        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-1">
          <input
            className={`pl-2 outline-none border-none w-full`}
            type={passwordMode ? 'password' : 'text'}
            id={label}
            placeholder={placeholder}
            value={value}
            onChange={e => {
              onChange(e);
            }}
          />
        </div>
        {hasError && (
          <div className="flex flex-row">
            <img src={WarningFill} className="mr-2" />
            <Typography type="body" size="xs" weight="regular" styleClass="text-error">
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
