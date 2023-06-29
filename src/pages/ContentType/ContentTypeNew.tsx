import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useRoleCreateMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import CancelIcon from "../../assets/cancel.png";
import { Key, SetStateAction, useEffect, useState } from 'react';
import { InputText } from '@/components/atoms/Input/InputText';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import TableEdit from "../../assets/table-edit.png";
import TableDelete from "../../assets/table-delete.png";
import Modal from '@/components/atoms/Modal';
import { useGetConfigQuery, usePostTypeCreateMutation } from '@/services/ContentType/contentTypeApi';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import Radio from '@/components/molecules/Radio';
import { openToast } from '@/components/atoms/Toast/slice';

export default function ContentTypeNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [roleCreate, { isLoading: onSaveLoading }] = useRoleCreateMutation();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isUseCategory, setIsUseCategory] = useState(false);

  const [isOpenModalAttribute, setIsOpenModalAttribute] = useState(false);
  const [isOpenLoopingAttribute, setIsOpenLoopingAttribute] = useState(false);
  const [isOpenModalAddAttribute, setIsOpenModalAddAttribute] = useState(false);
  const [openedAttribute, setOpenedAttribute] = useState([]);
  const [listAttributes, setListAttributes] = useState([]);
  const [config, setConfig] = useState({});
  const [loopTypeRequest, setLoopTypeRequest] = useState([]);

  const fetchConfigQuery = useGetConfigQuery({});
  const { data } = fetchConfigQuery;
  const { postTypeCreate } = usePostTypeCreateMutation();

  useEffect(() => {
    const refetch = async () => {
      await fetchConfigQuery.refetch();
    };
    void refetch();
  }, [])

  useEffect(() => {
    if(data?.getConfig?.value){
      setListAttributes(JSON.parse(data?.getConfig?.value).attributes)
    }
  }, [data])
  
  function getFieldId(value: string) {
    const str = value?.replace(/\s+/g, '-').toLowerCase();
    
    return str;
  }
  
  function getType(value: string) {
    const str = value?.replace(/_/g, ' ').toLowerCase();
    
    return str;
  }

  function openAddModal(val: SetStateAction<never[]>) {
    setOpenedAttribute(val);
    setIsOpenModalAttribute(false);
    setIsOpenModalAddAttribute(true);
    console.log(openedAttribute)
  }
  
  const [listItems, setListItems] = useState([
    {
      fieldType: 'TEXT_FIELD',
      name: 'Title',
      fieldId: '',
      config: [],
      isDeleted: false,
    },
    {
      fieldType: 'TEXT_AREA',
      name: 'Short Description',
      fieldId: '',
      config: [],
      isDeleted: false,
    }
  ]);

  function onAddList() {
    if (openedAttribute?.code === 'looping') {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        isDeleted: true,
        loopTypeRequest,
      };
    setListItems(list => [...list, data]);
  }else{
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        isDeleted: true,
        config: openedAttribute?.config.length > 0 ? config : [],
      };
    setListItems(list => [...list, data]);
  }
    setIsOpenModalAddAttribute(false); 
    setConfig({});
  }

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/roles');
  }

  const renderListItems = () => {
    return (
      <div className='my-5'>
        {listItems.map((val, idx) => (
          <div key={idx} className='py-2 px-10 flex flex-row justify-between m-4 bg-light-purple-2 rounded-lg hover:border-2 font-medium'>
            <div className='w-1/4 text-left'>{val.name}</div>
            <div className='w-1/4 text-center'>{val.fieldId ? val.fieldId : getFieldId(val.name)}</div>
            <div className='w-1/4 text-right capitalize'>{getType(val.fieldType)}</div>
            <div className='w-1/4 flex flex-row gap-5 items-center justify-center'>
              <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableEdit} />
              {val.isDeleted && (
                <img className={`cursor-pointer select-none flex items-center justify-center`} src={TableDelete}/>
              )}
            </div>
          </div>
        ))}
        <div className='p-2 flex items-center justify-center'>
          <div 
            role='button'
            onClick={() => { setIsOpenModalAttribute(true); }}
            className='p-2 bg-lavender rounded-full'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6 text-white">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    return (
      <div className='flex flex-col border-b-2 pb-8'>
        <div className='flex flex-row w-1/2 whitespace-nowrap items-center gap-10 text-lg font-bold'>
          <span className={`label-text text-base-content`}>Content Type Name<span className={'text-reddist text-lg'}>*</span></span>
          <InputText 
            labelTitle='' 
            placeholder={'Enter your new content name'}
            value={name}
            inputStyle='rounded-3xl' 
            onChange={(e) => { setName(e.target.value); }} />
        </div>
        <p></p>
        <div className='flex flex-row items-center'>
          <div className='flex flex-row w-1/2 whitespace-nowrap items-center gap-24 text-lg font-bold'>
            <span className={`label-text text-base-content`}>Slug Name<span className={'text-reddist text-lg'}>*</span></span>
            <InputText 
              labelTitle='' 
              placeholder={'Enter slug name'}
              value={slug}
              inputStyle='rounded-3xl' 
              onChange={(e) => { setSlug(e.target.value); }} />
          </div>
          <div className='ml-10'>
            <CheckBox
              defaultValue={isUseCategory}
              updateFormValue={(e) => { setIsUseCategory(e.value); } }
              labelTitle='Use Category' updateType={''} />
          </div>
        </div>
      </div>
    )
  }

  // Fungsi untuk mengubah fieldId menjadi lowercase jika kosong
  function lowercaseIfEmpty(str) {
    if (str === "") {
      return str;
    }
    return str.toLowerCase();
  }

  // Fungsi untuk menghapus atribut isDeleted dari objek
  function removeIsDeleted(obj) {
    const { isDeleted, ...rest } = obj;
    return rest;
  }

  function onSaveContent () {
    
    // Mengisi fieldId dengan lowercase jika kosong
    const updatedData = listItems.map(obj => {
      if (obj.fieldId === "") {
        return {
          ...obj,
          fieldId: lowercaseIfEmpty(obj.fieldType)
        };
      }
      return obj;
    });

    // Menghapus atribut isDeleted dari objek
    const newData = updatedData.map(obj => removeIsDeleted(obj));

    // Mengubah format config pada loopTypeRequest
    newData.forEach(obj => {
      if (obj.fieldType === "LOOPING") {
        obj.loopTypeRequest.forEach(item => {
          item.config = item.config.reduce((acc, curr) => {
            if (curr.code === 'media_type') {
              acc[curr.code] = curr.media_type;
            }else{
              acc[curr.code] = curr.value;
            }
            return acc;
          }, {});
        });
      }
    });

    const payload = {
      name: name,
      slug: slug,
      isUseCategory: isUseCategory,
      attributeRequests: newData
    }

    postTypeCreate(payload)
    .unwrap()
    .then(() => {
      dispatch(
        openToast({
          type: 'success',
          title: t('toast-success'),
        }),
      );
      navigate('/content-type');
    })
    .catch(() => {
      dispatch(
        openToast({
          type: 'error',
          title: t('toast-failed'),
        }),
      );
    });
  }

  const modalListAttribute = () => {
    return (
      <Modal open={isOpenModalAttribute} toggle={() => null} title="" width={840} height={480}>
        <div className='flex flex-col overflow-hidden'>
          <div className='p-2 absolute right-2 top-2'>
              <svg 
                  role='button'
                  onClick={() => { setIsOpenModalAttribute(false); }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 opacity-50">
                  <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
          </div>
          <TitleCard 
            title="Attribute Type"
            topMargin="mt-4"
            SearchBar={<InputSearch
              value={search}
              onBlur={(e: any) => {
                setSearch(e.target.value);
              } }
              placeholder="Search" />}>
          </TitleCard>
          <div className='flex flex-col overflow-auto'>
            {listAttributes?.map((val: any, idx: Key | null | undefined) => (
              <div 
                key={idx}
                role='button'
                onClick={() => {
                  setConfig({});
                  console.log(config)
                  openAddModal(val);}} 
                className='flex flex-row justify-between m-2 bg-light-purple-2 p-4'>
                <div className='flex flex-col'>
                  <div className='font-semibold text-md'>{val.label}</div>
                  <div className='font-semibold text-md opacity-50'>{val.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }

  function changeValue(arr) {
    arr.forEach(function(obj: {
        [x: string]: any; child: any; children: any; 
    }) {
        if (obj.code) {
            obj.value = obj.code;
            delete obj.code;
        }
    });

    return arr;
  }

  const renderListLoopingAttribute = () => {
    return (
      <div className='flex flex-col overflow-hidden'>
        <div className='p-2 absolute right-2 top-2'>
            <svg 
                role='button'
                onClick={() => { 
                  setIsOpenLoopingAttribute(false);
                 }}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 opacity-50">
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        <TitleCard 
          title="Attribute Type"
          topMargin="mt-4">
        </TitleCard>
        <div className='flex flex-col overflow-auto'>
          {listAttributes?.map((val: any, idx: Key | null | undefined) => (
            <div 
              key={idx}
              role='button'
              onClick={() => {
                const data = {
                  fieldType: val?.code?.toUpperCase(),
                  name: val?.label,
                  fieldId: val?.fieldId || getFieldId(val?.label),
                  config: val?.config,
                };
                setLoopTypeRequest((loopTypeRequest) => [...loopTypeRequest, data]);
                setIsOpenLoopingAttribute(false);
              }} 
              className='flex flex-row justify-between m-2 bg-light-purple-2 p-4'>
              <div className='flex flex-col'>
                <div className='font-semibold text-md'>{val.label}</div>
                <div className='font-semibold text-md opacity-50'>{val.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const updateFieldChanged = (name, index, event) => {
    const newArr = loopTypeRequest.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event.target.value };
      } else {
        return item;
      }
    });

    setLoopTypeRequest(newArr);
  };

  const modalAddAttribute = () => {
    return (
      <Modal open={isOpenModalAddAttribute} toggle={() => null} title="" width={840} height={480}>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between bg-light-purple-2 items-center p-2'>
            <div className='font-bold capitalize'>{getType(openedAttribute?.code)}</div>
            <div className='p-2'>
              <svg 
                  role='button'
                  onClick={() => { setIsOpenModalAddAttribute(false); }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6 opacity-50">
                  <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className='flex flex-col mx-10'>
            <div className='p-4 capitalize font-bold border-b-2 mb-4'>Add New {getType(openedAttribute?.code)}</div>
            <div className='flex flex-col w-1/2'>
              <InputText 
                labelTitle='Name' 
                labelRequired
                value={openedAttribute?.label}
                inputStyle='rounded-3xl' 
                onChange={(e) => { 
                  setOpenedAttribute((prevState) => ({
                    ...prevState,
                    label: e.target.value
                  }))
                }} />
              <InputText 
                labelTitle='Field ID' 
                labelRequired
                value={openedAttribute?.fieldId || getFieldId(openedAttribute?.label)}
                inputStyle='rounded-3xl' 
                onChange={(e) => { 
                  setOpenedAttribute((prevState) => ({
                    ...prevState,
                    fieldId: e.target.value
                  }))
                 }} />
            </div>
            {openedAttribute?.code !== 'looping' ? (
              openedAttribute?.config?.length > 0 && (
                <div className='flex flex-row gap-4 my-5'>
                  {openedAttribute?.config?.map((val, idx) => (
                    val?.type === 'text_field' ? (
                      <div key={idx}>
                        <InputText 
                          labelTitle={`${val.label} (Optional)`} 
                          type='number'
                          value={config?.[val.code] || ''}
                          inputStyle='rounded-3xl' 
                          onChange={(e) => { 
                            const text = val?.code;
                            
                            setConfig((prevState) => ({
                              ...prevState,
                              [text]: e.target.value
                            }))
                          }} />
                      </div>
                    ) : (
                      <div key={idx}>
                          <Radio 
                            labelTitle=""
                            labelStyle="font-bold	"
                            items={changeValue(val?.value)}
                            onSelect={(event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
                              if (event) {
                              const text = val?.code;
  
                              setConfig((prevState) => ({
                                  ...prevState,
                                  [text]: value
                                }))
                              }
                            }}
                            defaultSelected={config?.media_type}
                          />
                      </div>
                    )
                  ))}
                </div>
              )
            ): (
              <div className='flex flex-col border-t-2 my-5 py-5 items-center justify-center'>
                <>
                  {loopTypeRequest?.length > 0 ? (
                    loopTypeRequest?.map((val, idx) => (
                      <div key={idx} className='flex flex-col mb-10 w-[80%] border-2 rounded-xl p-2'>
                        <div className='p-4 capitalize font-bold border-b-2 mb-4'>{getType(val?.code)}</div>
                        <div className='flex flex-col w-1/2'>
                          <InputText 
                            labelTitle='Name' 
                            labelRequired
                            value={val.name}
                            inputStyle='rounded-3xl' 
                            onChange={(e) => { 
                              updateFieldChanged("name", idx, e)
                            }} />
                          <InputText 
                            labelTitle='Field ID' 
                            labelRequired
                            value={val?.fieldId || getFieldId(val?.name)}
                            inputStyle='rounded-3xl' 
                            onChange={(e) => { 
                              updateFieldChanged("fieldId", idx, e)
                              }} />
                        </div>
                        {val?.config?.length > 0 && (
                          <div className='flex flex-row gap-4 my-5'>
                            {val?.config?.map((val, index) => (
                              val?.type === 'text_field' ? (
                                <div key={index}>
                                  <InputText 
                                    labelTitle={`${val.label} (Optional)`} 
                                    type='number'
                                    value={val.value}
                                    inputStyle='rounded-3xl' 
                                    onChange={(e) => { 
                                      setLoopTypeRequest(prevState => {
                                        const updatedLoopTypeRequest = [...prevState];
                                        updatedLoopTypeRequest[idx].config[index].value = e.target.value;
                                        return updatedLoopTypeRequest;
                                      });

                                      console.log(loopTypeRequest)
                                    }} />
                                </div>
                              ) : (
                                <div key={index}>
                                    <Radio 
                                      labelTitle=""
                                      labelStyle="font-bold	"
                                      items={changeValue(val?.value)}
                                      onSelect={(event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
                                        if (event) {
                                        setLoopTypeRequest(prevState => {
                                          const updatedLoopTypeRequest = [...prevState];
                                          updatedLoopTypeRequest[idx].config[index].media_type = value;
                                          return updatedLoopTypeRequest;
                                        });
                                        }
                                      }}
                                      defaultSelected={val?.media_type}
                                    />
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    null
                  )}
                </>

                {isOpenLoopingAttribute && (
                  <div className='w-[80%] h-80 overflow-auto border p-2 rounded-xl'>
                    {renderListLoopingAttribute()}
                  </div>
                )}

                <button
                  className="btn btn-outline btn-primary btn-md w-[30%] items-center justify-center flex gap-2 mt-10"
                  onClick={() => {
                    setIsOpenLoopingAttribute(true)
                  }}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>

                  Add More Attributes
                </button>
              </div>
            )}
            <div className='flex flex-row items-end justify-end gap-2 mt-10'>
             <button
                className="btn btn-outline btn-md"
                onClick={() => {
                  console.log(listAttributes)
                }}>
                {t('btn.cancel')}
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {onAddList()}}>
                {onSaveLoading ? 'Loading...' : t('btn.save')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <>
      {modalListAttribute()}
      {modalAddAttribute()}
      <TitleCard title={'New Content Type'} topMargin="mt-2">
        <ModalConfirmLeave
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle="No"
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle="Yes"
          icon={CancelIcon}
          btnType='btn-warning'
        />
        {renderForm()}
        {renderListItems()}
        <div className="flex float-right gap-3">
          <button
            className="btn btn-outline btn-md"
            onClick={() => {
              setTitleConfirm('Are you sure?');
              setmessageConfirm(`Do you want to cancel all the process?`);
              setShowComfirm(true);
              console.log(listItems)
            }}>
            {t('btn.cancel')}
          </button>
          <button
            onClick={() => {onSaveContent()}}
            className="btn btn-success btn-md">
            {onSaveLoading ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
