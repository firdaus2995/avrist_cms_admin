import { useState } from 'react';
import PropTypes from 'prop-types';

interface IRadio {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (formValue: { updateType: string; value: boolean }) => void;
  checked: boolean;
}

export const Radio: React.FC<IRadio> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  defaultValue,
  updateFormValue,
  checked,
}) => {
  const [value, setValue] = useState(defaultValue);

  const updateToogleValue = () => {
    setValue(value);
    updateFormValue({ value });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label cursor-pointer">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
        <input
          type="Radio"
          className="radio checked:bg-[#81219A]"
          checked={checked}
          onChange={e => { updateToogleValue(); }}
        />
      </label>
    </div>
  );
};

Radio.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  updateFormValue: PropTypes.any,
  checked: PropTypes.bool,
};
