import PropTypes from 'prop-types';
import ErrorSmallIcon from '../../../assets/error-small.svg';
import { t } from 'i18next';

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
  placeholder?: string | null;
  disabled?: boolean;
  inputWidth?: number;
  inputHeight?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  isError?: boolean;
  helperText?: string;
  maxLength?: number;
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
  helperText,
  maxLength,
}) => {
  return (
    <div>
      <div
        className={`form-control w-full ${containerStyle} ${
          direction === 'row' ? 'flex-row items-start' : ''
        }`}>
        <label
          style={{
            width: direction === 'row' ? labelWidth : '',
            minWidth: direction === 'row' ? labelWidth : '',
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
          maxLength={maxLength}
          className={`textarea ${
            isError ? 'border-error' : 'textarea-bordered'
          } w-full text-base py-3 rounded-xl ${textAreaStyle}`}
        />
        {
          isError && (direction === 'column' || !direction) && (
            <div className='flex flex-row px-1 py-2'>
              <img src={ErrorSmallIcon} className='mr-3' />
              <p className='text-reddist text-sm'>{helperText ?? t('components.atoms.required')}</p>
            </div>
          )
        }
      </div>
      {
        isError && direction === 'row' && (
          <div className='flex flex-row px-1 py-2' style={{
            marginLeft: labelWidth
          }}>
            <img src={ErrorSmallIcon} className='mr-3' />
            <p className='text-reddist text-sm'>{helperText ?? t('components.atoms.required')}</p>
          </div>
        )
      }
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
  helperText: PropTypes.string,
  maxLength: PropTypes.number,
};
