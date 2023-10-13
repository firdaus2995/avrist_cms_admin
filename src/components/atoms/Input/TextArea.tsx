import PropTypes from 'prop-types';
import ErrorSmIcon from '../../../assets/error-small.svg';

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
  isError?: boolean;
  errorText?: string;
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
  isError,
  errorText,
}) => {
  return (
    <div
      className={`form-control w-full ${containerStyle} ${
        direction === 'row' ? 'flex-row items-start' : ''
      }`}>
      <label
        style={{
          width: direction === 'row' ? labelWidth : '',
        }}
        className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>
          {labelTitle}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
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
        className={`textarea ${
          isError ? 'border-error' : 'textarea-bordered'
        } w-full text-base py-3 rounded-xl ${textAreaStyle}`}
      />
      {errorText ? (
        <div className="flex flex-row gap-2 h-full flex items-center">
          <img src={ErrorSmIcon} />
          <p className="text-error text-normal">{errorText}</p>
        </div>
      ) : null}
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
  isError: PropTypes.bool,
  errorText: PropTypes.string,
};
