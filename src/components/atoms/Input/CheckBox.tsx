import { useState } from 'react';
import PropTypes from 'prop-types';

interface ICheckBox {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: boolean;
  placeholder?: string;
  disabled?: boolean;
  updateType: string;

  updateFormValue: (formValue: { updateType: string; value: boolean }) => void;
}

export const CheckBox: React.FC<ICheckBox> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  defaultValue,
  updateType,
  disabled,
  updateFormValue,
}) => {
  const [value, setValue] = useState(defaultValue);

  const updateToogleValue = () => {
    setValue(!(value ?? false));
    updateFormValue({ updateType, value: !(value ?? false) });
  };

  return (
    <div className={`form-control  ${containerStyle}`}>
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-primary mr-3"
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
  disabled: PropTypes.bool,
};
