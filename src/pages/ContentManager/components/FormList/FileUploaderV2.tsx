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
          className={`
            form-control
            w-full
            ${containerStyle}
            ${direction === 'row' ? 'flex-row' : ''}
        `}>
          <div>
            <FileUploaderBase
              id={id}
              isDocument={isDocument}
              multiple={multiple}
              onFilesChange={onChange}
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
      <div className="border my-10" />
    </div>
  );
}
