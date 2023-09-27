import { useEffect, useState } from 'react';
import Typography from '@/components/atoms/Typography';
// import FileUploaderBase from '@/components/molecules/FileUploaderBase';
import FileUploaderBaseV2 from '../FileUploaderBaseV2';
import ErrorSmallIcon from '@/assets/error-small.svg';

export default function FileUploaderV2({
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
  labelText,
  border = true,
  disabled = false,
  maxSize,
  maxFile,
  parentData,
}: any) {
  const [isMaxFile, setIsMaxFile] = useState(false);
  function convertToArr(arr: any[], key: string | number | undefined) {
    if (!Array.isArray(arr) || arr.length === 0 || key === undefined) {
      return [];
    }

    const values = arr.map(obj => obj[key]);

    return values;
  }

  useEffect(() => {
    if (maxFile) {
      if (parentData?.items?.length >= maxFile) {
        setIsMaxFile(true);
      }
    }
  }, [maxFile, parentData]);

  return (
    <div>
      <div>
        <Typography
          type="body"
          size="s"
          weight="bold"
          className={`w-48 ml-1 mr-9 mb-1 ${fieldTypeLabel ? 'visible' : 'hidden'}`}>
          {fieldTypeLabel}
          <span className={'text-reddist text-lg'}>{labelRequired ? '*' : ''}</span>
        </Typography>
      </div>
      <div>
        <div
          className={`
            form-control
            w-full
            ${containerStyle}
            ${direction === 'row' ? 'flex-row' : ''}
            `}
          style={{ flex: '1' }}>
          <div>
            <FileUploaderBaseV2
              id={id}
              isDocument={isDocument}
              multiple={multiple}
              label={labelText}
              onFilesChange={(e: any) => {
                const values = convertToArr(e, 'response');
                onChange(values);
              }}
              disabled={disabled || isMaxFile}
              maxSize={maxSize}
              parentData={parentData}
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
