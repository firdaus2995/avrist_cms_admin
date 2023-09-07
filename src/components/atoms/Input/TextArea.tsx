import PropTypes from 'prop-types';
interface ITextArea {
  rows?: number;
  direction?: string;
  labelTitle: string;
  labelStyle?: string;
  labelWidth?: number;
  labelRequired?: boolean;
  containerStyle?: string;
  textAreaStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  inputWidth?: number;
  inputHeight?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
}

export const TextArea: React.FC<ITextArea> = ({
  rows,
  direction,
  labelTitle,
  labelStyle = '',
  labelWidth = 225,
  labelRequired,
  containerStyle = '',
  textAreaStyle,
  value,
  placeholder,
  disabled,
  inputWidth,
  inputHeight,
  onChange,
  name,
}) => {
  return (
    <div className={`form-control w-full ${containerStyle} ${direction === 'row' ? 'flex-row items-start' : ''}`}>
      <label 
        style={{
          width: direction === 'row' ? labelWidth : '',
        }} 
        className="label"
      >
        <span className={`label-text text-base-content ${labelStyle}`}>
          {labelTitle}<span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </span>
      </label>
      <textarea
        name={name}
        style={{
          width: inputWidth ?? '',
          height: inputHeight ?? '',  
        }}
        rows={rows ?? 4}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onChange={e => {
          onChange(e);
        }}
        className={`textarea textarea-bordered w-full text-base py-3 rounded-xl ${textAreaStyle}`}
      />
    </div>
  );
};

TextArea.propTypes = {
  rows: PropTypes.number,
  direction: PropTypes.string,
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  labelWidth: PropTypes.number,
  labelRequired: PropTypes.bool,
  textAreaStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  inputWidth: PropTypes.number,
  inputHeight: PropTypes.number,
};
