import { useState } from 'react';
import PropTypes from 'prop-types';
interface ITextArea {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (formValue: { updateType: string; value: string }) => void;
  updateType: string;
}

export const TextArea: React.FC<ITextArea> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) => {
  const [value, setValue] = useState(defaultValue ?? '');

  const updateInputValue = (val: string) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <textarea
        rows={6}
        value={value}
        placeholder={placeholder ?? ''}
        onChange={e => {
          updateInputValue(e.target.value);
        }}
        className="input input-bordered w-full h-24 py-3"
      />
    </div>
  );
};

TextArea.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.func.isRequired,
  updateType: PropTypes.string.isRequired,
};
