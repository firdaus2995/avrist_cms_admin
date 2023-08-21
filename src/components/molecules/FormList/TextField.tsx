import Typography from '@/components/atoms/Typography';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function TextField({
  labelTitle,
  type,
  containerStyle = '',
  value,
  placeholder,
  disabled,
  onChange,
  inputStyle,
  direction,
  roundStyle = 'xl',
  themeColor,
  inputWidth,
  inputHeight,
  name,
  error,
  suffix,
  helperText,
  fieldTypeLabel,
  border = true,
  labelRequired = false,
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
        <Typography type="body" size="m" weight="bold" className="w-56 mt-1 ml-1">
          {labelTitle}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </Typography>
        <div
          className={`
            form-control
            w-full
            ${containerStyle}
            ${direction === 'row' ? 'flex-row' : ''}
            `}
          style={{ flex: '1' }}>
          <div
            style={{ width: inputWidth ?? '100%', height: inputHeight ?? '' }}
            className={`
            input
            input-bordered 
            rounded-${roundStyle} ${themeColor ? `border-${themeColor}` : ''} 
            focus-within:outline 
            focus-within:outline-2 
            focus-within:outline-offset-2 
            focus-within:outline-${themeColor ?? '[#D2D4D7]'} 
            ${disabled ? 'bg-[#E9EEF4] ' : ''} 
            ${error ? 'border-reddist' : ''}
          `}>
            <input
              name={name}
              type={type ?? 'text'}
              value={value}
              disabled={disabled}
              placeholder={placeholder ?? ''}
              onChange={onChange}
              className={`w-full h-full rounded-xl px-1 outline-0 ${inputStyle} ${
                disabled ? 'text-[#637488]' : ''
              }`}
            />
            <div className="relative right-8">{suffix ?? ''}</div>
          </div>
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
