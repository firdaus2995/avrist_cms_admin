import { 
  HTMLInputTypeAttribute,
} from 'react';
import PropTypes from 'prop-types';

interface IInputText {
  labelTitle: string;
  labelStyle?: string;
  labelRequired?: boolean;
  inputStyle?: string;
  type?: HTMLInputTypeAttribute;
  containerStyle?: string;
  value?: string;
  placeholder?: string | null;
  disabled?: boolean;
  suffix?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputText: React.FC<IInputText> = ({
  labelTitle,
  labelStyle = '',
  labelRequired,
  type,
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onChange,
  suffix,
  inputStyle,
}) => {
  return (
    <div className={`form-control w-full ${containerStyle} `}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}<span className={'text-required-text text-lg'}>{labelRequired ? '*' : ''}</span></span>
      </label>
      <div className={`input input-bordered w-full rounded-3xl focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#D2D4D7] ${disabled ? 'bg-[#E9EEF4] ' : ''}`}>
        <input
          type={type ?? 'text'}
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? ''}
          onChange={e => {
            if (onChange) {
              onChange(e);
            };
          }}
          className={`w-full h-full rounded-3xl outline-0 ${inputStyle} ${disabled ? 'text-[#637488]' : ''}`}
        />
        <div className='relative right-8'>{suffix ?? ''}</div>
      </div>
    </div>
  );
};

InputText.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  labelRequired: PropTypes.bool,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  suffix: PropTypes.any,
  inputStyle: PropTypes.string,
};
