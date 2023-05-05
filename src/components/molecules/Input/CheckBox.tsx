import { useState } from 'react';
import PropTypes from 'prop-types';

interface ICheckBox {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: boolean;
  placeholder?: string;
  updateFormValue: (formValue: { updateType: string; value: boolean }) => void;
  updateType: string;
}

export const CheckBox: React.FC<ICheckBox> = ({
  labelTitle,
  labelStyle = '',
  type,
  containerStyle = '',
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}) => {
  const [value, setValue] = useState(defaultValue);

  const updateToogleValue = () => {
    setValue(!(value ?? false));
    updateFormValue({ updateType, value: !(value ?? false) });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label cursor-pointer">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={value}
          onChange={e => { updateToogleValue(); }}
        />
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
};
