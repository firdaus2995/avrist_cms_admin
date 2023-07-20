import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

interface ICheckBox {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: boolean;
  placeholder?: string;
  disabled?: boolean;
  inputStyle?: string;
  updateType?: string;
  labelContainerStyle?: string;
  updateFormValue?: (formValue: { updateType: string; value: boolean }) => void;
}

export const CheckBox: React.FC<ICheckBox> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  defaultValue,
  updateType = "",
  disabled,
  inputStyle,
  updateFormValue,
  labelContainerStyle,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateToogleValue = () => {
    setValue(!(value ?? false));
    if (updateFormValue) {
      updateFormValue({ updateType, value: !(value ?? false) });
    };
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <label className={`label cursor-pointer ${labelContainerStyle}`}>
        <input
          type="checkbox"
          className={`checkbox checkbox-primary mr-3 ${inputStyle}`}
          checked={defaultValue}
          disabled={disabled}
          onChange={_e => {
            updateToogleValue();
          }}
        />
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
      </label>
    </div>
  );
};

CheckBox.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.any,
  updateType: PropTypes.any,
  inputStyle: PropTypes.string,
  labelContainerStyle: PropTypes.string,
  disabled: PropTypes.bool,
};
