import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Typography from '@/components/atoms/Typography';
import UploadDocumentIcon from '@/assets/efb/preview-document.svg';
import DropDown from '@/components/molecules/DropDown';
import { InputText } from '@/components/atoms/Input/InputText';
import { useGetEmailFormBuilderDetailQuery } from '@/services/EmailFormBuilder/emailFormBuilderApi';
import { LoadingCircle } from '@/components/atoms/Loading/loadingCircle';
import { copyArray } from '@/utils/logicHelper';
import { getImage } from '../../../services/Images/imageUtils';
import { CheckBox } from '@/components/atoms/Input/CheckBox';

export default function PreviewModal(props: any) {
  const { open, toggle, id } = props;
  const fetchGetEmailFormBuilder = useGetEmailFormBuilderDetailQuery({
    id,
    pageIndex: 0,
    limit: 100,
  });
  const { data, isLoading } = fetchGetEmailFormBuilder;
  const [listData, setListData] = useState([]);
  const nameId: any = uuidv4();

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
    return listData.map(({ name, fieldType, config, value }: any) => {
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
            <div className="mb-1">
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
            <div className="mb-1">
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
            <div className="mb-1">
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
            <div className="my-2">
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
            <div className="my-2">
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
              labelTitle={name}
              labelStyle="font-bold	"
              labelRequired={required}
              defaultValue="item1"
              items={[
                {
                  value: 'item1',
                  label: 'Item 1',
                },
                {
                  value: 'item2',
                  label: 'Item 2',
                },
              ]}
            />
          );
        case 'LINE_BREAK':
          return (
            <div className="flex my-5">
              <div className="w-full flex justify-center items-center border-[1px] border-[#D6D6D6]" />
            </div>
          );
        case 'RATING':
          return (
            <div className="w-full h-[120px] flex flex-row items-center rounded-lg bg-white p-2 overflow-auto">
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
            <div className="my-2">
              <label className={`label font-bold`}>
                <span className={`label-text text-base-content`}>
                  {name}
                  {required && <span className={'text-reddist text-lg ml-1'}>*</span>}
                </span>
              </label>
              <div className="w-full flex flex-col gap-4">
                {items?.map(async (element: any, index: number) => {
                  const imageUrl = await getImage(element.value);
                  return (
                    <label
                      key={index}
                      className="label cursor-pointer justify-start flex gap-2 p-0">
                      <input
                        type="radio"
                        name={nameId}
                        className="radio radio-primary h-[22px] w-[22px] bg-white"
                      />
                      <div
                        className="w-32 h-32 bg-[#5E217C] bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})})` }}></div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        case 'TNC':
          return (
            <CheckBox
              containerStyle="w-full flex flex-row flex-start"
              labelTitle={(
                <>Ya. Saya telah membaca dan menyetujui <span className="text-[#2C89F5] font-bold">Syarat dan Ketentuan</span></>
              )}
              labelStyle="max-w-[220px] font-normal"
              inputStyle="w-[20px] h-[20px]"
            />
          );  
        default:
          return <div>err: {data.fieldType}</div>;
      }
    });
  };

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box overflow-hidden">
        <div className="h-7">
          <button
            onClick={() => toggle()}
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

        <div className="sticky max-h-[calc(100vh-10rem)] overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center items-center">
              <LoadingCircle />
            </div>
          )}
          <div className="mb-10 p-1 mr-2">{renderFormList()}</div>
          <div className="flex justify-center items-center">
            <div className="btn btn-primary flex flex-row gap-2 rounded-xl w-80">Submit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
