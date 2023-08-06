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
  fieldTypeLabel = '',
}: any) {
  return (
    <div>
      <Typography
        type="body"
        size="m"
        weight="bold"
        className={`w-48 ml-1 mr-9 mt-2 ${fieldTypeLabel ? 'visible' : 'hidden'}`}>
        {fieldTypeLabel}
      </Typography>
      <div className="flex flex-row">
        <Typography type="body" size="m" weight="bold" className="w-48 mt-1 ml-1 mr-9">
          {labelTitle}
        </Typography>
        <div
          className={`form-control w-full ${containerStyle} ${
            direction === 'row' ? 'flex-row' : ''
          }`}>
          <textarea
            name={name}
            style={{
              width: inputWidth ?? '100%',
              height: inputHeight ?? '',
            }}
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
      <div className="border my-10" />
    </div>
  );
}
