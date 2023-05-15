import { useState } from 'react';
import PropTypes from 'prop-types';

interface IInputText {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (formValue: { updateType: string; value: string }) => void;
  updateType: string;
}

export const InputText: React.FC<IInputText> = ({
  labelTitle,
  labelStyle = '',
  type,
  containerStyle = '',
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) => {
  const [value, setValue] = useState((defaultValue != null) || '');

  const updateInputValue = (val: string) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <input
        type={(type != null) || 'text'}
        value={value}
        placeholder={(placeholder != null) || ''}
        onChange={e => { updateInputValue(e.target.value); }}
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
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.func.isRequired,
  updateType: PropTypes.string.isRequired,
};
