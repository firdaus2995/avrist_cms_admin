import PropTypes from 'prop-types';
interface ITextArea {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<ITextArea> = ({
  labelTitle,
  labelStyle = '',
  containerStyle = '',
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
        rows={6}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? ''}
        onChange={e => {
          onChange(e);
        }}
        className="input input-bordered w-full h-24 py-3 rounded-xl"
      />
    </div>
  );
};

TextArea.propTypes = {
  labelTitle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
