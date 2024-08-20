import { HTMLInputTypeAttribute } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from "../../../assets/search.png";

interface IInputSearch {
  type?: HTMLInputTypeAttribute;
  containerStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    <div className={`flex flex-row items-center ${width ? `w-[${width}px]` : 'w-[375px]'} border-[1px] border-[#BBBBBB] focus-within:border-[1px] focus-within:border-bright-purple rounded-xl	px-5 py-3 ${containerStyle}`}>
      <input
        type={type ?? 'text'}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={(event: any) => {
          if (event?.keyCode === 13) {
            if (onBlur) onBlur(event);
          };
        }}
        className="w-full text-sm font-normal" 
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  width: PropTypes.number,
};
