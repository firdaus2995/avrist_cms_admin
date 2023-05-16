import { HTMLInputTypeAttribute } from 'react';
import PropTypes from 'prop-types';

interface IInputText {
  labelTitle: string;
  labelStyle?: string;
  type?: HTMLInputTypeAttribute;
  containerStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText: React.FC<IInputText> = ({
  labelTitle,
  labelStyle = '',
  type,
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
      <input
        type={type ?? 'text'}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onChange={e => {
          onChange(e);
        }}
        className="input input-bordered w-full "
      />
    </div>
  );
};

InputText.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
