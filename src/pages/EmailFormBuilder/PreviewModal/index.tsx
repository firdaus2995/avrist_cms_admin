import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { t } from 'i18next';

import Typography from '@/components/atoms/Typography';
import UploadDocumentIcon from '@/assets/efb/preview-document.svg';
import DropDown from '@/components/molecules/DropDown';
import ImageRadioField from './ImageRadioField';
import { InputText } from '@/components/atoms/Input/InputText';
import { useGetEmailFormBuilderDetailQuery } from '@/services/EmailFormBuilder/emailFormBuilderApi';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { copyArray } from '@/utils/logicHelper';
import { CheckBox } from '@/components/atoms/Input/CheckBox';

interface IPreviewModal {
  open: boolean;
  id: number | null;
  toggle: () => void;
}

export default function PreviewModal({ open, toggle, id }: IPreviewModal) {
  const nameId: any = uuidv4();

  const [listData, setListData] = useState([]);

  const fetchGetEmailFormBuilder = useGetEmailFormBuilderDetailQuery({
    id,
    pageIndex: 0,
    limit: 100,
  });
  const { data, isLoading } = fetchGetEmailFormBuilder;

  useEffect(() => {
    if (data) {
      const dataAttribute = copyArray(data?.postTypeDetail?.attributeList);
      setListData(dataAttribute);
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchGetEmailFormBuilder.refetch();
    };
    void refetch();
  }, [open]);

  const renderFormList = () => {
    return listData.map(({ name, fieldType, config, value }: any, index: any) => {
      const dataConfig: any = config ? JSON.parse(config) : {};
      const { required, placeholder, position, size, ALLOW_OTHER_VALUE } = dataConfig;

      let items = [];
      if (value) {
        items = value.split(';').map((element: any) => {
          return {
            value: element,
            label: element,
          };
        });
      }

      switch (fieldType) {
        case 'EMAIL':
          return (
            <InputText
              key={index}
              disabled
              labelTitle={name}
              labelStyle="font-bold"
              labelRequired={required}
              value={placeholder}
              roundStyle="xl"
            />
          );
        case 'IMAGE':
          return (
            <div key={index} className="mb-1">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full h-[120px] bg-form-disabled-bg flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-lg gap-2 p-2">
                <img src={UploadDocumentIcon} />
                <span className="text-xs text-center">
                  Drag and Drop Files or click to <p className="text-primary inline">Browse</p>
                </span>
              </div>
            </div>
          );
        case 'DOCUMENT':
          return (
            <div key={index} className="mb-1">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full h-[120px] bg-form-disabled-bg flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-lg gap-2 p-2">
                <img src={UploadDocumentIcon} />
                <span className="text-xs text-center">
                  Drag and Drop Files or click to <p className="text-primary inline">Browse</p>
                </span>
              </div>
            </div>
          );
        case 'TEXT_AREA':
          return (
            <div key={index} className="mb-1">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full h-[120px] bg-form-disabled-bg flex flex-col justify-center items-center border-dashed border-[1px] border-lavender rounded-lg gap-2 p-2">
                <textarea
                  name={name}
                  rows={3}
                  disabled
                  placeholder={placeholder}
                  className={`w-full h-full px-1 outline-0 resize-none`}
                />
              </div>
            </div>
          );
        case 'LABEL':
          return (
            <div
              key={index}
              className={`flex flex-1 ${
                position[0] === 'left'
                  ? 'justify-start'
                  : position[0] === 'middle'
                  ? 'justify-center'
                  : 'justify-end'
              } font-bold text-lg`}>
              {size[0] === 'title' && (
                <Typography type="body" size="xl" weight="semi" className="truncate m-2">
                  {name}
                </Typography>
              )}
              {size[0] === 'subtitle' && (
                <Typography type="body" size="normal" weight="regular" className="truncate m-2">
                  {name}
                </Typography>
              )}
            </div>
          );
        case 'NUMBER':
          return (
            <InputText
              key={index}
              disabled
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              value={name}
              placeholder={'name'}
              roundStyle="xl"
            />
          );
        case 'TEXT_FIELD':
          return (
            <InputText
              key={index}
              disabled
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              value={name}
              placeholder={placeholder}
              roundStyle="xl"
            />
          );
        case 'RADIO_BUTTON':
          return (
            <div key={index} className="my-2">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full flex flex-col gap-1">
                {items?.map((element: any, index: number) => (
                  <label
                    key={index}
                    className="label cursor-pointer justify-start flex h-[34px] gap-2 p-0">
                    <input
                      type="radio"
                      name={nameId}
                      className="radio radio-primary h-[22px] w-[22px] bg-white"
                    />
                    <span className="label-text">{element?.label}</span>
                  </label>
                ))}
                {ALLOW_OTHER_VALUE && (
                  <label className="label cursor-pointer justify-start flex h-[34px] gap-2 p-0">
                    <input
                      type="radio"
                      name={nameId}
                      className="radio radio-primary h-[22px] w-[22px] bg-white"
                    />
                    <span className="w-full label-text text-other-grey border-b-[1px] border-other-grey">
                      Other
                    </span>
                  </label>
                )}
              </div>
            </div>
          );
        case 'CHECKBOX':
          return (
            <div key={index} className="my-2">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full flex flex-col gap-1">
                {items.map((element: any, index: number) => (
                  <div key={index} className="form-control">
                    <label className="h-[34px] label cursor-pointer p-0 justify-start gap-2">
                      <input
                        type="checkbox"
                        className="h-[22px] w-[22px] checkbox checkbox-primary bg-white border-[2px] border-dark-grey"
                      />
                      <span className="label-text">{element?.label}</span>
                    </label>
                  </div>
                ))}
                {ALLOW_OTHER_VALUE && (
                  <div className="form-control">
                    <label className="h-[34px] label cursor-pointer p-0 justify-start gap-2">
                      <input
                        type="checkbox"
                        className="h-[22px] w-[22px] checkbox checkbox-primary bg-white border-[2px] border-other-grey"
                      />
                      <span className="w-full label-text text-other-grey border-b-[1px] border-other-grey">
                        Other
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        case 'DROPDOWN':
          return (
            <DropDown
              key={index}
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              defaultValue="item1"
              items={items}
            />
          );
        case 'LINE_BREAK':
          return (
            <div key={index} className="flex my-5">
              <div className="w-full flex justify-center items-center border-[1px] border-[#D6D6D6]" />
            </div>
          );
        case 'RATING':
          return (
            <div
              key={index}
              className="w-full h-[120px] flex flex-row items-center rounded-lg bg-white p-2 overflow-auto scrollbar scrollbar-h-3 scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-light-purple">
              {items.map((element: any, keyIndex: number) => {
                return (
                  <div key={keyIndex} className={`min-w-[20%] flex flex-col items-center`}>
                    <div className={`w-full flex flex-row items-center`}>
                      {keyIndex === 0 ? (
                        <div className="w-full h-[1px] border-[1px] border-white" />
                      ) : (
                        <div className="w-full h-[1px] border-[1px] border-form-disabled-bg" />
                      )}
                      <input type="radio" name={`radio_${id}`} className="radio radio-primary" />
                      {keyIndex === items.length - 1 ? (
                        <div className="w-full h-[1px] border-[1px] border-white" />
                      ) : (
                        <div className="w-full h-[1px] border-[1px] border-form-disabled-bg" />
                      )}
                    </div>
                    <div className="text-center">{element.label}</div>
                  </div>
                );
              })}
            </div>
          );
        case 'IMAGE_RADIO':
          return (
            <ImageRadioField
              key={index}
              name={name}
              required={required}
              items={items}
              nameId={nameId}
            />
          );
        case 'TNC':
          return (
            <CheckBox
              key={index}
              containerStyle="w-full flex flex-row flex-start"
              labelTitle={
                <>
                  Ya. Saya telah membaca dan menyetujui{' '}
                  <span className="text-[#2C89F5] font-bold">Syarat dan Ketentuan</span>
                </>
              }
              labelStyle="max-w-[220px] font-normal"
              inputStyle="w-[20px] h-[20px]"
            />
          );
        case 'DATE_PICKER': {
          return (
            <InputText
              key={index}
              disabled
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              value={name}
              placeholder={'name'}
              roundStyle="xl"
            />
          );
        }
        case 'RANGE_DATE_PICKER': {
          return (
            <div>
              <p className="text-sm font-bold my-2 flex flex-row gap-1">
                {name}
                <span className="text-reddist">{required ? '*' : ''}</span>
              </p>
              <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-2 items-center h-full w-full">
                  <p className="text-sm font-bold">From</p>
                  <input
                    key={index}
                    disabled
                    placeholder={'yyyy/mm/dd'}
                    className="bg-[#E9EEF4] border border-other-grey rounded-xl py-2 px-4 w-full"
                  />
                </div>
                <div className="flex flex-row gap-2 items-center h-full w-full">
                  <p className="text-sm font-bold h-full">To</p>
                  <input
                    key={index}
                    disabled
                    placeholder={'yyyy/mm/dd'}
                    className="bg-[#E9EEF4] border border-other-grey rounded-xl py-2 px-4 w-full"
                  />
                </div>
              </div>
            </div>
          );
        }
        case 'PHONE_NUMBER':
          return (
            <InputText
              key={index}
              disabled
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              value={name}
              placeholder={'name'}
              roundStyle="xl"
            />
          );
        case 'TEXT_CURRENCY':
          return (
            <div>
              <p className="text-sm font-bold my-2 flex flex-row gap-1">
                {name}
                <span className="text-reddist">{required ? '*' : ''}</span>
              </p>
              <div className="flex flex-row gap-2 items-center h-full w-full">
                <p className="text-sm font-bold h-full">{dataConfig?.currency.toUpperCase()}</p>
                <input
                  key={index}
                  disabled
                  placeholder={'Harga'}
                  className="bg-[#E9EEF4] border border-other-grey rounded-xl py-2 px-4 w-full"
                />
              </div>
            </div>
          );
        default:
          return <div key={index}>err: {JSON.stringify(data.postTypeDetail.postTypeGroup)}</div>;
      }
    });
  };

  return (
    <div className={`modal ${open ? 'modal-open' : ''} `}>
      <div className="max-w-[450px] modal-box overflow-hidden">
        <div className="h-7">
          <button
            onClick={() => {
              toggle();
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div className="sticky max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar scrollbar-w-3 scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-light-purple">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoadingCircle />
            </div>
          ) : (
            <>
              <div className="p-[16px] mr-2 bg-toast-error rounded-lg">
                <div className="flex flex-col gap-2">
                  <Typography type="body" size="m" weight="bold" className="text-reddist">
                    {t(
                      'user.email-form-builder-list.email-form-builder.list.preview-disclaimer-title',
                    )}
                  </Typography>
                  <Typography type="body" size="s" weight="regular" className="text-reddist">
                    {t(
                      'user.email-form-builder-list.email-form-builder.list.preview-disclaimer-body',
                    )}
                  </Typography>
                </div>
              </div>
              <div className="mb-10 p-1 mr-2">{renderFormList()}</div>
              <div className="flex justify-center items-center">
                <div className="btn btn-primary flex flex-row gap-2 rounded-xl w-80">Submit</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
