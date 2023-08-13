import Typography from '@/components/atoms/Typography';
import FileUploaderBase from '@/components/molecules/FileUploaderBase';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function FileUploaderV2({
  labelTitle,
  containerStyle = '',
  direction,
  fieldTypeLabel,
  isDocument,
  multiple,
  onChange,
  error,
  helperText,
  id,
  labelRequired = false,
  border = true,
  disabled = false,
}: any) {
  function convertToArr(arr: any[], key: string | number | undefined) {
    if (!Array.isArray(arr) || arr.length === 0 || key === undefined) {
      return [];
    }

    const values = arr.map(obj => obj[key]);

    if (values.length === 1) {
      return values[0];
    } else {
      const jsonString = JSON.stringify(
        values.map(item => (typeof item === 'string' ? item.replace(/"/g, '\\"') : item)),
      );
      return jsonString;
    }
  }

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
          <span className={'text-reddist text-lg'}>{labelRequired ? ' *' : ''}</span>
        </Typography>
        <div
          className={`
            form-control
            w-full
            ${containerStyle}
            ${direction === 'row' ? 'flex-row' : ''}
            `}
          style={{ flex: '1' }}>
          <div>
            <FileUploaderBase
              id={id}
              isDocument={isDocument}
              multiple={multiple}
              // onFilesChange={onChange}
              onFilesChange={(e: any) => {
                const values = convertToArr(e, 'response');
                onChange(values);
              }}
              disabled={disabled}
            />
            {error && (
              <div className="flex flex-row px-1 py-2">
                <img src={ErrorSmallIcon} className="mr-3" />
                <p className="text-reddist text-sm">{helperText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {border && <div className="border my-10" />}
    </div>
  );
}
