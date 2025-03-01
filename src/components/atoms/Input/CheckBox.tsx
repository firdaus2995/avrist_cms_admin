import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

interface ICheckBox {
  labelTitle: any;
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
  name?: string;
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
  name,
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
          name={name}
          type="checkbox"
          className={`checkbox checkbox-primary mr-3 ${inputStyle}`}
          checked={defaultValue}
          disabled={disabled}
          onChange={_e => {
            updateToogleValue();
          }}
        />
        <span className={'label-text text-sm-content ' + labelStyle}>{labelTitle}</span>
      </label>
    </div>
  );
};

CheckBox.propTypes = {
  labelTitle: PropTypes.any.isRequired,
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
  name: PropTypes.string,
};
