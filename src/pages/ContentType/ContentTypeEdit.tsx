import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import {
  ChangeEvent,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { InputText } from '@/components/atoms/Input/InputText';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.png';
import Modal from '@/components/atoms/Modal';
import {
  useGetConfigQuery,
  useGetPostTypeDetailQuery,
  usePostTypeUpdateMutation,
} from '@/services/ContentType/contentTypeApi';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import Radio from '@/components/molecules/Radio';
import { openToast } from '@/components/atoms/Toast/slice';

export default function ContentTypeEdit() {
  const params = useParams();
  const [id] = useState<any>(Number(params.id));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [isOpenModalEditAttribute, setIsOpenModalEditAttribute] = useState(false);
  const [openedAttribute, setOpenedAttribute] = useState<any>([]);
  const [listAttributes, setListAttributes] = useState<any>([]);
  const [config, setConfig] = useState<any>({});
  const [loopTypeRequest, setLoopTypeRequest] = useState<any>([]);
  const [editedIndex, setEditedIndex] = useState();

  const fetchConfigQuery = useGetConfigQuery<any>({});
  const [postUpdate] = usePostTypeUpdateMutation();

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(5);

  const [listItems, setListItems] = useState<any>([]);

  // RTK GET DATA
  const fetchQuery = useGetPostTypeDetailQuery({
    id,
    pageIndex,
    limit: pageLimit,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      setIsUseCategory(data?.postTypeDetail?.isUseCategory);
      setName(data?.postTypeDetail?.name);
      setSlug(data?.postTypeDetail?.slug);
      setListItems(data?.postTypeDetail?.attributeList);
    }
  }, [data]);

  useEffect(() => {
    const refetch = async () => {
      await fetchConfigQuery.refetch();
      await fetchQuery.refetch();
    };
    void refetch();
  }, []);

  useEffect(() => {
    if (fetchConfigQuery?.data?.getConfig?.value) {
      setListAttributes(JSON.parse(fetchConfigQuery?.data?.getConfig?.value).attributes);
    }
  }, [fetchConfigQuery]);

  useEffect(() => {
    if (fetchConfigQuery?.data?.getConfig?.value) {
      const filteredAttributes = JSON.parse(
        fetchConfigQuery?.data?.getConfig?.value,
      ).attributes.filter((attribute: { label: any; description: any }) => {
        const { label, description } = attribute;
        return (
          label.toLowerCase().includes(search.toLowerCase()) ||
          description.toLowerCase().includes(search.toLowerCase())
        );
      });
      setListAttributes(filteredAttributes);
    }
  }, [search]);

  function getFieldId(value: string) {
    const str = value?.replace(/\s+/g, '-').toLowerCase();

    return str;
  }

  function getType(value: string) {
    const str = value?.replace(/_/g, ' ').toLowerCase();

    return str;
  }

  function openAddModal(val: SetStateAction<never[]>, edited: boolean | undefined) {
    setOpenedAttribute(val);
    setIsOpenModalAttribute(false);
    if (edited) {
      setIsOpenModalEditAttribute(true);
    } else {
      setIsOpenModalAddAttribute(true);
    }
  }

  function onAddList() {
    if (openedAttribute?.code === 'looping') {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        loopTypeRequest,
      };
      setListItems((list: any) => [...list, data]);
    } else {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        config: openedAttribute?.config.length > 0 ? config : [],
      };
      setListItems((list: any) => [...list, data]);
    }
    setIsOpenModalAddAttribute(false);
    setConfig({});
  }

  function onEditList() {
    if (openedAttribute?.code === 'looping') {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        isDeleted: true,
        loopTypeRequest,
      };
      const updatedListItems = listItems.map((item: any, index: undefined) => {
        if (index === editedIndex) {
          // Ubah nilai objek pertama sesuai kebutuhan
          return {
            ...item,
            data,
          };
        }
        return item;
      });
      setListItems(updatedListItems);
    } else {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        config: openedAttribute?.config.length > 0 ? config : [],
      };
      const updatedListItems = listItems.map((item: any, index: undefined) => {
        if (index === editedIndex) {
          // Ubah nilai objek pertama sesuai kebutuhan
          return {
            ...item,
            ...data,
          };
        }
        return item;
      });
      setListItems(updatedListItems);
    }
    setIsOpenModalEditAttribute(false);
    setConfig({});
  }

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/content-type');
  };

  const renderListItems = () => {
    return (
      <div className="my-5">
        {listItems.map(
          (
            val: {
              name: string;
              fieldId:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              fieldType: string;
            },
            idx: undefined,
          ) => (
            <div
              key={idx}
              className="py-2 px-10 flex flex-row justify-between m-4 bg-light-purple-2 rounded-lg hover:border-2 font-medium">
              <div className="w-1/4 text-left font-semibold">{val.name}</div>
              <div className="w-1/4 text-center font-semibold">
                {val.fieldId ? val.fieldId : getFieldId(val.name)}
              </div>
              <div className="w-1/4 text-right capitalize">{getType(val.fieldType)}</div>
              <div className="w-1/4 flex flex-row gap-5 items-center justify-center">
                {idx && idx > 1 ? (
                  <>
                    <img
                      role="button"
                      onClick={() => {
                        setEditedIndex(idx);
                        const edited = listAttributes?.filter(
                          (value: { code: string }) => value.code === getFieldId(val.fieldType),
                        );
                        edited[0].label = val.name;
                        edited[0].fieldId = val.fieldId ? val.fieldId : getFieldId(val.name);
                        openAddModal(edited[0], true);
                      }}
                      className={`cursor-pointer select-none flex items-center justify-center`}
                      src={TableEdit}
                    />
                    <img
                      role="button"
                      onClick={() => {
                        const updated = listItems?.filter((_val: any, index: any) => index !== idx);
                        setListItems(updated);
                      }}
                      className={`cursor-pointer select-none flex items-center justify-center`}
                      src={TableDelete}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ),
        )}
        <div className="p-2 flex items-center justify-center">
          <div
            role="button"
            onClick={() => {
              setIsOpenModalAttribute(true);
            }}
            className="p-2 bg-lavender rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="flex flex-col border-b-2 pb-8">
        <div className="flex flex-row w-1/2 whitespace-nowrap items-center gap-10 text-lg font-bold">
          <span className={`label-text text-base-content`}>
            Content Type Name<span className={'text-reddist text-lg'}>*</span>
          </span>
          <InputText
            labelTitle=""
            placeholder={'Enter your new content name'}
            value={name}
            inputStyle="rounded-3xl"
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </div>
        <p></p>
        <div className="flex flex-row items-center">
          <div className="flex flex-row w-1/2 whitespace-nowrap items-center gap-24 text-lg font-bold">
            <span className={`label-text text-base-content`}>
              Slug Name<span className={'text-reddist text-lg'}>*</span>
            </span>
            <InputText
              labelTitle=""
              placeholder={'Enter slug name'}
              value={slug}
              inputStyle="rounded-3xl"
              onChange={e => {
                setSlug(e.target.value);
              }}
            />
          </div>
          <div className="ml-10">
            <CheckBox
              defaultValue={isUseCategory}
              updateFormValue={e => {
                setIsUseCategory(e.value);
              }}
              labelTitle="Use Category"
              updateType={''}
            />
          </div>
        </div>
      </div>
    );
  };

  function onSaveContent() {
    const updatedData = listItems.map(
      (item: { [x: string]: any; id: any; parentId: any; attributeList: any }) => {
        const { id, parentId, attributeList, ...rest } = item;
        if (loopTypeRequest.length > 0) {
          rest.loopTypeRequest = loopTypeRequest;
        } else if (attributeList !== null) {
          rest.loopTypeRequest = attributeList?.map(
            (attribute: { [x: string]: any; id: any; parentId: any }) => {
              const { id, parentId, ...attributeRest } = attribute;
              return attributeRest;
            },
          );
        }
        return rest;
      },
    );

    const payload = {
      id: data?.postTypeDetail?.id,
      name,
      slug,
      isUseCategory,
      attributeRequests: updatedData,
    };

    postUpdate(payload)
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
      <Modal open={isOpenModalAttribute} toggle={() => null} title="" width={840} height={640}>
        <div className="flex flex-col">
          <div className="p-2 absolute right-2 top-2">
            <svg
              role="button"
              onClick={() => {
                setIsOpenModalAttribute(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <TitleCard
            title="Attribute Type"
            topMargin="mt-4"
            SearchBar={
              <InputSearch
                value={search}
                onChange={(e: any) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search"
              />
            }>
            <></>
          </TitleCard>
          <div className="flex flex-col overflow-y-auto h-[35vh] scrollbar scrollbar-w-3 scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-light-purple scrollbar-track-light-purple-2">
            {listAttributes?.map((val: any, idx: Key | null | undefined) => (
              <div
                key={idx}
                role="button"
                onClick={() => {
                  setConfig({});
                  openAddModal(val, false);
                }}
                className="flex flex-row justify-between m-2 bg-light-purple-2 p-4">
                <div className="flex flex-col">
                  <div className="font-semibold text-md">{val.label}</div>
                  <div className="font-semibold text-md opacity-50">{val.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  };

  function changeValue(arr: any[]) {
    arr.forEach(function (obj: { code: any; value: any }) {
      if (obj.code) {
        obj.value = obj.code;
        delete obj.code;
      }
    });

    return arr;
  }

  const renderListLoopingAttribute = () => {
    return (
      <div className="flex flex-col overflow-hidden">
        <div className="p-2 absolute right-2 top-2">
          <svg
            role="button"
            onClick={() => {
              setIsOpenLoopingAttribute(false);
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="p-4 font-bold">List Attribute</div>
        <div className="flex flex-col overflow-auto">
          {listAttributes
            ?.filter((val: { code: string }) => val.code !== 'looping')
            .map((val: any, idx: Key | null | undefined) => (
              <div
                key={idx}
                role="button"
                onClick={() => {
                  const data = {
                    fieldType: val?.code?.toUpperCase(),
                    name: val?.label,
                    fieldId: val?.fieldId || getFieldId(val?.label),
                    config: val?.config,
                  };
                  setLoopTypeRequest((loopTypeRequest: any) => [...loopTypeRequest, data]);
                  setIsOpenLoopingAttribute(false);
                }}
                className="flex flex-row justify-between m-2 bg-light-purple-2 p-4">
                <div className="flex flex-col">
                  <div className="font-semibold text-md">{val.label}</div>
                  <div className="font-semibold text-md opacity-50">{val.description}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const updateFieldChanged = (
    name: string,
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newArr = loopTypeRequest.map((item: any, i: number) => {
      if (index === i) {
        return { ...item, [name]: event.target.value };
      } else {
        return item;
      }
    });

    setLoopTypeRequest(newArr);
  };

  const modalAddAttribute = () => {
    return (
      <Modal open={isOpenModalAddAttribute} toggle={() => null} title="" width={840} height={640}>
        <div className="flex flex-col">
          <div className="flex flex-row w-full absolute -m-6 rounded-t-2xl justify-between bg-light-purple-2 items-center p-4">
            <div className="font-bold capitalize ml-10">{getType(openedAttribute?.code)}</div>
            <div className="p-2">
              <svg
                role="button"
                onClick={() => {
                  setIsOpenModalAddAttribute(false);
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col mx-10 mt-16">
            <div className="p-4 capitalize font-bold border-b-2 mb-4">
              Add New {getType(openedAttribute?.code)}
            </div>
            <div className="flex flex-col w-1/2">
              <InputText
                labelTitle="Name"
                labelRequired
                value={openedAttribute?.label}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setOpenedAttribute((prevState: any) => ({
                    ...prevState,
                    label: e.target.value,
                  }));
                }}
              />
              <InputText
                labelTitle="Field ID"
                labelRequired
                value={openedAttribute?.fieldId || getFieldId(openedAttribute?.label)}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setOpenedAttribute((prevState: any) => ({
                    ...prevState,
                    fieldId: e.target.value,
                  }));
                }}
              />
            </div>
            {openedAttribute?.code !== 'looping' ? (
              openedAttribute?.config?.length > 0 && (
                <div className="flex flex-row gap-4 my-5">
                  {openedAttribute?.config?.map(
                    (
                      val: { type: string; label: any; code: string | number; value: any },
                      idx: Key | null | undefined,
                    ) =>
                      val?.type === 'text_field' ? (
                        <div key={idx}>
                          <InputText
                            labelTitle={`${val.label} (Optional)`}
                            type="number"
                            value={config?.[val.code] || ''}
                            inputStyle="rounded-3xl"
                            onChange={e => {
                              const text = val?.code;

                              setConfig((prevState: any) => ({
                                ...prevState,
                                [text]: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        <div key={idx}>
                          <Radio
                            labelTitle=""
                            labelStyle="font-bold	"
                            items={changeValue(val?.value)}
                            onSelect={(
                              event: React.ChangeEvent<HTMLInputElement>,
                              value: string | number | boolean,
                            ) => {
                              if (event) {
                                const text = val?.code;

                                setConfig((prevState: any) => ({
                                  ...prevState,
                                  [text]: value,
                                }));
                              }
                            }}
                            defaultSelected={config?.media_type}
                          />
                        </div>
                      ),
                  )}
                </div>
              )
            ) : (
              <div className="flex flex-col border-t-2 my-5 py-5 items-center justify-center">
                <>
                  {loopTypeRequest?.length > 0
                    ? loopTypeRequest?.map(
                        (
                          val: {
                            fieldType: string;
                            name: string;
                            fieldId: any;
                            config: Array<{
                              type: string;
                              label: any;
                              value: string | undefined;
                              media_type: string | number | boolean | undefined;
                            }>;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex flex-col mb-10 w-[80%] border-2 rounded-xl p-2">
                            <div className="flex flex-row justify-between w-full border-b-2 mb-4">
                              <div className="p-4 capitalize font-bold ">
                                {getType(val?.fieldType)}
                              </div>
                              <svg
                                role="button"
                                onClick={() => {
                                  const updated = loopTypeRequest?.filter(
                                    (_val: any, index: any) => index !== idx,
                                  );
                                  setLoopTypeRequest(updated);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-red-500 mt-2 mr-2">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </div>
                            <div className="flex flex-col w-1/2">
                              <InputText
                                labelTitle="Name"
                                labelRequired
                                value={val.name}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  updateFieldChanged('name', idx, e);
                                }}
                              />
                              <InputText
                                labelTitle="Field ID"
                                labelRequired
                                value={val?.fieldId || getFieldId(val?.name)}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  updateFieldChanged('fieldId', idx, e);
                                }}
                              />
                            </div>
                            {val?.config?.length > 0 && (
                              <div className="flex flex-row gap-4 my-5">
                                {val?.config?.map(
                                  (
                                    val: {
                                      type: string;
                                      label: any;
                                      value: any;
                                      media_type: string | number | boolean | undefined;
                                    },
                                    index: Key,
                                  ) =>
                                    val?.type === 'text_field' ? (
                                      <div key={index}>
                                        <InputText
                                          labelTitle={`${val.label} (Optional)`}
                                          type="number"
                                          value={val.value}
                                          inputStyle="rounded-3xl"
                                          onChange={e => {
                                            setLoopTypeRequest((prevState: any) => {
                                              const updatedLoopTypeRequest = [...prevState];
                                              updatedLoopTypeRequest[idx].config[index].value =
                                                e.target.value;
                                              return updatedLoopTypeRequest;
                                            });
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div key={index}>
                                        <Radio
                                          labelTitle=""
                                          labelStyle="font-bold	"
                                          items={changeValue(val?.value)}
                                          onSelect={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                            value: string | number | boolean,
                                          ) => {
                                            if (event) {
                                              setLoopTypeRequest((prevState: any) => {
                                                const updatedLoopTypeRequest = [...prevState];
                                                updatedLoopTypeRequest[idx].config[
                                                  index
                                                ].media_type = value;
                                                return updatedLoopTypeRequest;
                                              });
                                            }
                                          }}
                                          defaultSelected={val?.media_type}
                                        />
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                          </div>
                        ),
                      )
                    : null}
                </>

                {isOpenLoopingAttribute && (
                  <div className="w-[80%] h-80 overflow-auto border p-2 rounded-xl">
                    {renderListLoopingAttribute()}
                  </div>
                )}

                <button
                  className="btn btn-outline btn-primary btn-md w-[30%] items-center justify-center flex gap-2 mt-10"
                  onClick={() => {
                    setIsOpenLoopingAttribute(true);
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add More Attributes
                </button>
              </div>
            )}
            <div className="flex flex-row items-end justify-end gap-2 mt-10">
              <button
                className="btn btn-outline btn-md"
                onClick={() => {
                  setIsOpenModalAddAttribute(false);
                }}>
                {t('btn.cancel')}
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  onAddList();
                }}>
                {t('btn.save')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const modalEditAttribute = () => {
    return (
      <Modal open={isOpenModalEditAttribute} toggle={() => null} title="" width={840} height={640}>
        <div className="flex flex-col">
          <div className="flex flex-row w-full absolute -m-6 rounded-t-2xl justify-between bg-light-purple-2 items-center p-4">
            <div className="font-bold capitalize ml-10">{getType(openedAttribute?.code)}</div>
            <div className="p-2">
              <svg
                role="button"
                onClick={() => {
                  setIsOpenModalEditAttribute(false);
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col mx-10 mt-10">
            <div className="p-4 capitalize font-bold border-b-2 mb-4">
              {getType(openedAttribute?.code)}
            </div>
            <div className="flex flex-col w-1/2">
              <InputText
                labelTitle="Name"
                labelRequired
                value={openedAttribute?.label}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setOpenedAttribute((prevState: any) => ({
                    ...prevState,
                    label: e.target.value,
                  }));
                }}
              />
              <InputText
                labelTitle="Field ID"
                labelRequired
                value={openedAttribute?.fieldId || getFieldId(openedAttribute?.label)}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setOpenedAttribute((prevState: any) => ({
                    ...prevState,
                    fieldId: e.target.value,
                  }));
                }}
              />
            </div>
            {openedAttribute?.code !== 'looping' ? (
              openedAttribute?.config?.length > 0 && (
                <div className="flex flex-row gap-4 my-5">
                  {openedAttribute?.config?.map(
                    (
                      val: { type: string; label: any; code: string | number; value: any },
                      idx: Key | null | undefined,
                    ) =>
                      val?.type === 'text_field' ? (
                        <div key={idx}>
                          <InputText
                            labelTitle={`${val.label} (Optional)`}
                            type="number"
                            value={config?.[val.code] || ''}
                            inputStyle="rounded-3xl"
                            onChange={e => {
                              const text = val?.code;

                              setConfig((prevState: any) => ({
                                ...prevState,
                                [text]: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        <div key={idx}>
                          <Radio
                            labelTitle=""
                            labelStyle="font-bold	"
                            items={changeValue(val?.value)}
                            onSelect={(
                              event: React.ChangeEvent<HTMLInputElement>,
                              value: string | number | boolean,
                            ) => {
                              if (event) {
                                const text = val?.code;

                                setConfig((prevState: any) => ({
                                  ...prevState,
                                  [text]: value,
                                }));
                              }
                            }}
                            defaultSelected={config?.media_type}
                          />
                        </div>
                      ),
                  )}
                </div>
              )
            ) : (
              <div className="flex flex-col border-t-2 my-5 py-5 items-center justify-center">
                <>
                  {loopTypeRequest?.length > 0
                    ? loopTypeRequest?.map(
                        (
                          val: {
                            fieldType: string;
                            name: string;
                            fieldId: any;
                            config: Array<{
                              type: string;
                              label: any;
                              value: string | undefined;
                              media_type: string | number | boolean | undefined;
                            }>;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex flex-col mb-10 w-[80%] border-2 rounded-xl p-2">
                            <div className="flex flex-row justify-between w-full border-b-2 mb-4">
                              <div className="p-4 capitalize font-bold ">
                                {getType(val?.fieldType)}
                              </div>
                              <svg
                                role="button"
                                onClick={() => {
                                  const updated = loopTypeRequest?.filter(
                                    (_val: any, index: any) => index !== idx,
                                  );
                                  setLoopTypeRequest(updated);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-red-500 mt-2 mr-2">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </div>
                            <div className="flex flex-col w-1/2">
                              <InputText
                                labelTitle="Name"
                                labelRequired
                                value={val.name}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  updateFieldChanged('name', idx, e);
                                }}
                              />
                              <InputText
                                labelTitle="Field ID"
                                labelRequired
                                value={val?.fieldId || getFieldId(val?.name)}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  updateFieldChanged('fieldId', idx, e);
                                }}
                              />
                            </div>
                            {val?.config?.length > 0 && (
                              <div className="flex flex-row gap-4 my-5">
                                {val?.config?.map(
                                  (
                                    val: {
                                      type: string;
                                      label: any;
                                      value: any;
                                      media_type: string | number | boolean | undefined;
                                    },
                                    index: number,
                                  ) =>
                                    val?.type === 'text_field' ? (
                                      <div key={index}>
                                        <InputText
                                          labelTitle={`${val.label} (Optional)`}
                                          type="number"
                                          value={val.value}
                                          inputStyle="rounded-3xl"
                                          onChange={e => {
                                            setLoopTypeRequest((prevState: any) => {
                                              const updatedLoopTypeRequest = [...prevState];
                                              updatedLoopTypeRequest[idx].config[index].value =
                                                e.target.value;
                                              return updatedLoopTypeRequest;
                                            });
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div key={index}>
                                        <Radio
                                          labelTitle=""
                                          labelStyle="font-bold	"
                                          items={changeValue(val?.value)}
                                          onSelect={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                            value: string | number | boolean,
                                          ) => {
                                            if (event) {
                                              setLoopTypeRequest((prevState: any) => {
                                                const updatedLoopTypeRequest = [...prevState];
                                                updatedLoopTypeRequest[idx].config[
                                                  index
                                                ].media_type = value;
                                                return updatedLoopTypeRequest;
                                              });
                                            }
                                          }}
                                          defaultSelected={val?.media_type}
                                        />
                                      </div>
                                    ),
                                )}
                              </div>
                            )}
                          </div>
                        ),
                      )
                    : null}
                </>

                {isOpenLoopingAttribute && (
                  <div className="w-[80%] h-80 overflow-auto border p-2 rounded-xl">
                    {renderListLoopingAttribute()}
                  </div>
                )}

                <button
                  className="btn btn-outline btn-primary btn-md w-[30%] items-center justify-center flex gap-2 mt-10"
                  onClick={() => {
                    setIsOpenLoopingAttribute(true);
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add More Attributes
                </button>
              </div>
            )}
            <div className="flex flex-row items-end justify-end gap-2 mt-10">
              <button
                className="btn btn-outline btn-md"
                onClick={() => {
                  setIsOpenModalEditAttribute(false);
                }}>
                {t('btn.cancel')}
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  onEditList();
                }}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {modalListAttribute()}
      {modalAddAttribute()}
      {modalEditAttribute()}
      <TitleCard title={'Edit Content Type'} topMargin="mt-2">
        <ModalConfirm
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
          btnSubmitStyle="btn-warning"
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
            }}>
            {t('btn.cancel')}
          </button>
          <button
            onClick={() => {
              onSaveContent();
            }}
            className="btn btn-success btn-md">
            {t('btn.create')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
