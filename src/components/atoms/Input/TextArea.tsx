import PropTypes from 'prop-types';
interface ITextArea {
  rows?: number;
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  textAreaStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<ITextArea> = ({
  rows,
  labelTitle,
  labelStyle = '',
  containerStyle = '',
  textAreaStyle,
  value,
  placeholder,
  disabled,
  onChange,
}) => {
  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
      </label>
      <textarea
        rows={rows ?? 4}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onChange={e => {
          onChange(e);
        }}
        className={`textarea textarea-bordered w-full py-3 rounded-xl ${textAreaStyle}`}
      />
    </div>
  );
};

TextArea.propTypes = {
  rows: PropTypes.number,
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  textAreaStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
