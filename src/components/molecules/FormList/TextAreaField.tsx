import Typography from '@/components/atoms/Typography';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function TextAreaField({
  labelTitle,
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onChange,
  direction,
  roundStyle = 'xl',
  themeColor,
  inputWidth,
  inputHeight,
  name,
  error,
  // suffix,
  helperText,
  rows,
  textAreaStyle,
  // fieldTypeLabel = '',
  border = true,
  labelRequired = false,
  maxLength,
}: any) {
  return (
    <div>
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="bold" className="w-56 mt-1 ml-1">
          {labelTitle}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </Typography>
        <div
          className={`form-control w-full ${containerStyle} ${
            direction === 'row' ? 'flex-row' : ''
          }`}
          style={{ flex: '1' }}>
          <textarea
            name={name}
            style={{
              width: inputWidth ?? '100%',
              height: inputHeight ?? '',
            }}
            maxLength={maxLength}
            rows={rows ?? 4}
            value={value}
            disabled={disabled}
            placeholder={placeholder ?? ''}
            onChange={e => {
              onChange(e);
            }}
            className={`
            textarea
            textarea-bordered
            rounded-${roundStyle} ${themeColor ? `border-${themeColor}` : ''} 
            focus-within:outline
            focus-within:outline-2
            focus-within:outline-offset-2 
            focus-within:outline-${themeColor ?? '[#D2D4D7]'} 
            ${disabled ? 'bg-[#E9EEF4] ' : ''}
            ${error ? 'border-reddist' : ''}
            ${textAreaStyle}
          `}
          />
          {error && (
            <div className="flex flex-row px-1 py-2">
              <img src={ErrorSmallIcon} className="mr-3" />
              <p className="text-reddist text-sm">{helperText}</p>
            </div>
          )}
        </div>
      </div>
      {border && <div className="border my-10" />}
    </div>
  );
}
