import Typography from '@/components/atoms/Typography';
import FileUploaderBase from '@/components/molecules/FileUploaderBase';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function FileUploaderV2({
  labelTitle,
  containerStyle = '',
  direction,
  // fieldTypeLabel,
  isDocument,
  multiple,
  onChange,
  error,
  helperText,
  id,
  labelRequired = false,
  labelText,
  border = true,
  disabled = false,
  maxSize,
  value,
  showMaxSize,
  editMode,
  inputWidth,
  inputHeight,
  disabledAltText = false,
  isOptional = false,
  labelWidth = 225,
  optionalComponent = () => {},
}: any) {
  return (
    <div>
      <div className="flex flex-row">
        <div
          style={{
            width: labelWidth,
            minWidth: labelWidth,
          }}>
          {labelTitle ? (
            <Typography type="body" size="s" weight="bold">
              {labelTitle}
              <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
            </Typography>
          ) : null}
          {isOptional ? (
            <Typography type="body" size="s" weight="bold">
              <p>{`{ Optional }`}</p>
            </Typography>
          ) : null}
        </div>

        <div
          className={`
            form-control
            w-full
            ${containerStyle}
            ${direction === 'row' ? 'flex-row' : ''}
            `}
          style={{ flex: '1' }}>
          <div style={{ width: inputWidth ?? '100%', height: inputHeight ?? '' }}>
            <FileUploaderBase
              id={id}
              isDocument={isDocument}
              multiple={multiple}
              label={labelText}
              onFilesChange={(_e: any) => {
                // const values = convertToArr(e, 'response');
                // if (isDocument) {
                //   onChange(values);
                // }
              }}
              onAltTextChange={(_e: any) => {
                // console.log(e);
              }}
              onCombineDataChange={(e: any) => {
                const values = JSON.stringify(e);
                // if (!isDocument && !disabledAltText) {
                onChange(values);
                // }
              }}
              disabled={disabled}
              maxSize={maxSize}
              value={value}
              showMaxSize={showMaxSize}
              editMode={editMode}
              disabledAltText={disabledAltText}
            />
            {error && (
              <div className="flex flex-row px-1 py-2">
                <img src={ErrorSmallIcon} className="mr-3" />
                <p className="text-reddist text-sm">{helperText}</p>
              </div>
            )}
            {optionalComponent ? optionalComponent() : null}
          </div>
        </div>
      </div>
      {border && <div className="border my-10" />}
    </div>
  );
}
