import { HTMLInputTypeAttribute } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from "../../../assets/search.png";

interface IInputSearch {
  type?: HTMLInputTypeAttribute;
  containerStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: number;
}

export const InputSearch: React.FC<IInputSearch> = ({
  type,
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onBlur,
  onChange,
  width,
}) => {
  return (
    <div className={`flex flex-row items-center ${width ? `w-[${width}px]` : 'w-[375px]'} border-[1px] border-[#BBBBBB] focus-within:border-[1px] focus-within:border-purple-600 rounded-xl	px-5 py-3 ${containerStyle}`}>
      <input
        type={type ?? 'text'}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onBlur={onBlur}
        onChange={e => {
          onChange(e);
        }}
        className="w-full text-base font-normal" 
        style={{
          outline: 'none',
        }}
      />
      <img src={SearchIcon} className='w-[24px] h-[24px]'/>
    </div>
  );
};

InputSearch.propTypes = {
  type: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  width: PropTypes.number,
};
