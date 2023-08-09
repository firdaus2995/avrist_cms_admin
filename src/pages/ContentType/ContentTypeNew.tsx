import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import { Key, SetStateAction, useEffect, useState } from 'react';
import { InputText } from '@/components/atoms/Input/InputText';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.svg';
import Modal from '@/components/atoms/Modal';
import {
  useGetConfigQuery,
  usePostTypeCreateMutation,
} from '@/services/ContentType/contentTypeApi';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import Radio from '@/components/molecules/Radio';
import { openToast } from '@/components/atoms/Toast/slice';

export default function ContentTypeNew() {
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
  const [loopTypeRequest, setLoopTypeRequest] = useState<any>([]);
  const [editedIndex, setEditedIndex] = useState();

  const fetchConfigQuery = useGetConfigQuery<any>({});
  const { data } = fetchConfigQuery;
  const [postCreate] = usePostTypeCreateMutation();

  useEffect(() => {
    const refetch = async () => {
      await fetchConfigQuery.refetch();
    };
    void refetch();
  }, []);

  useEffect(() => {
    if (data?.getConfig?.value) {
      setListAttributes(JSON.parse(data?.getConfig?.value).attributes);
    }
  }, [data]);

  useEffect(() => {
    if (data?.getConfig?.value) {
      const filteredAttributes = JSON.parse(data?.getConfig?.value).attributes.filter(
        (attribute: { label: any; description: any }) => {
          const { label, description } = attribute;
          return (
            label.toLowerCase().includes(search.toLowerCase()) ||
            description.toLowerCase().includes(search.toLowerCase())
          );
        },
      );
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

  const [listItems, setListItems] = useState<any>([
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
    },
  ]);

  function onAddList() {
    if (openedAttribute?.code === 'looping') {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        attributeList: openedAttribute?.attributeList,
        icon: openedAttribute?.icon,
      };
      setListItems((list: any) => [...list, data]);
    } else {
      const data = {
        fieldType: openedAttribute?.code?.toUpperCase(),
        name: openedAttribute?.label,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.label),
        config: openedAttribute?.config,
        icon: openedAttribute?.icon,
      };
      setListItems((list: any) => [...list, data]);
    }
    setIsOpenModalAddAttribute(false);
  }

  function onEditList() {
    if (openedAttribute?.fieldType === 'LOOPING') {
      const data = {
        fieldType: openedAttribute?.fieldType?.toUpperCase(),
        name: openedAttribute?.name,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.name),
        attributeList: openedAttribute?.attributeList,
        icon: openedAttribute?.icon,
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
    } else {
      const data = {
        fieldType: openedAttribute?.fieldType?.toUpperCase(),
        name: openedAttribute?.name,
        fieldId: openedAttribute?.fieldId || getFieldId(openedAttribute?.name),
        config: openedAttribute?.config,
        icon: openedAttribute?.icon,
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
  }

  const onLeave = () => {
    setShowComfirm(false);
    navigate('/content-type');
  };

  const renderListItems = () => {
    return (
      <div className="my-5">
        {listItems.map((val: any, idx: undefined) => (
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
                      openAddModal(val, true);
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
        ))}
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
    const transformedData = listItems.map((item: any) => {
      const newItem = { ...item };

      // 1. Hapus attribut config jika kosong
      if (newItem.config && newItem.config.length === 0) {
        delete newItem.config;
      }

      // 2. Hapus isDeleted
      delete newItem.isDeleted;
      delete newItem.icon;

      // 3. Isi fieldId jika kosong
      if (newItem.fieldId === '') {
        newItem.fieldId = newItem.name.toLowerCase().replace(/\s/g, '-');
      }

      // 4. Hapus attribute id pada attributeList
      if (newItem.attributeList) {
        newItem.attributeList = newItem.attributeList.map(
          (attribute: { [x: string]: any; id: any }) => {
            const { id, ...newAttribute } = attribute;

            // 5. Hapus attribut config pada attributeList jika kosong
            if (newAttribute.config && newAttribute.config.length === 0) {
              delete newAttribute.config;
            }
            delete newAttribute.icon;

            return newAttribute;
          },
        );

        // 6. Ubah attributeList menjadi loopTypeRequest
        newItem.loopTypeRequest = newItem.attributeList;
        delete newItem.attributeList;
      }

      return newItem;
    });

    const payload = {
      name,
      slug,
      isUseCategory,
      attributeRequests: transformedData,
    };

    postCreate(payload)
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
                  if (val.code === 'text_field' || val.code === 'text_area') {
                    val.config = '{"min_length":[],"max_length":[]}';
                  } else if (val.code === 'image') {
                    val.config = '{"media_type":"[]"}';
                  }

                  openAddModal(val, false);
                }}
                className="flex flex-row justify-between m-2 bg-light-purple-2 p-4">
                <div className="flex flex-col">
                  <div className="font-semibold text-md">{val.label}</div>
                  <div className="font-semibold text-md opacity-50">{val.description}</div>
                </div>
                <img src={`data:image/svg+xml;base64,${val.icon}`} />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  };

  const renderListLoopingAttribute = () => {
    return (
      <div className="flex flex-col overflow-hidden">
        <div className="p-4 font-bold">List Attribute</div>
        <div className="flex flex-col overflow-auto">
          {listAttributes
            ?.filter((val: { code: string }) => val.code !== 'looping')
            .map((val: any, idx: Key | null | undefined) => (
              <div
                key={idx}
                role="button"
                onClick={() => {
                  if (
                    openedAttribute?.attributeList &&
                    openedAttribute?.attributeList?.length > 0
                  ) {
                    const lastId =
                      openedAttribute.attributeList[openedAttribute.attributeList.length - 1].id;
                    const newId = parseInt(lastId) + 1;

                    const data = {
                      id: newId,
                      fieldType: val?.code?.toUpperCase(),
                      name: val?.label,
                      fieldId: val?.fieldId || getFieldId(val?.label),
                      icon: val?.icon,
                      config: '',
                    };

                    if (val.code === 'text_field' || val.code === 'text_area') {
                      data.config = '{"min_length":[],"max_length":[]}';
                    } else if (val.code === 'image') {
                      data.config = '{"media_type":"[]"}';
                    }

                    const updatedAttributeList = [...openedAttribute.attributeList, data];

                    setOpenedAttribute({
                      ...openedAttribute,
                      attributeList: updatedAttributeList,
                    });
                  } else {
                    const data = {
                      id: 1,
                      fieldType: val?.code?.toUpperCase(),
                      name: val?.label,
                      icon: val?.icon,
                      fieldId: val?.fieldId || getFieldId(val?.label),
                      config: '',
                    };

                    if (val.code === 'text_field' || val.code === 'text_area') {
                      data.config = '{"min_length":[],"max_length":[]}';
                    } else if (val.code === 'image') {
                      data.config = '{"media_type":"[]"}';
                    }

                    setOpenedAttribute({
                      ...openedAttribute,
                      attributeList: [data],
                    });
                  }

                  setIsOpenLoopingAttribute(false);
                }}
                className="flex flex-row justify-between m-2 bg-light-purple-2 p-4">
                <div className="flex flex-col">
                  <div className="font-semibold text-md">{val.label}</div>
                  <div className="font-semibold text-md opacity-50">{val.description}</div>
                </div>
                <img src={`data:image/svg+xml;base64,${val.icon}`} />
              </div>
            ))}
        </div>
      </div>
    );
  };

  const modalAddAttribute = () => {
    return (
      <Modal open={isOpenModalAddAttribute} toggle={() => null} title="" width={840} height={640}>
        <div className="flex flex-col">
          <div className="flex flex-row w-full absolute -m-6 rounded-t-2xl justify-between bg-light-purple-2 items-center p-4">
            <div className="flex flex-row">
              <img className="ml-5" src={`data:image/svg+xml;base64,${openedAttribute?.icon}`} />
              <div className="font-bold capitalize ml-5">{getType(openedAttribute?.code)}</div>
            </div>
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
                labelStyle="font-bold"
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
                labelStyle="font-bold"
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
            {openedAttribute?.code === 'text_field' || openedAttribute?.code === 'text_area' ? (
              <div className="flex flex-row gap-4 my-5">
                <InputText
                  labelTitle={`Minimum Length (Optional)`}
                  labelStyle="font-bold"
                  type="number"
                  value={JSON.parse(openedAttribute?.config)?.min_length || ''}
                  inputStyle="rounded-3xl"
                  onChange={e => {
                    const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                    updatedConfig.min_length = e.target.value;
                    setOpenedAttribute({
                      ...openedAttribute,
                      config: JSON.stringify(updatedConfig),
                    });
                  }}
                />
                <InputText
                  labelTitle={`Maximum Length (Optional)`}
                  labelStyle="font-bold"
                  type="number"
                  value={JSON.parse(openedAttribute?.config)?.max_length || ''}
                  inputStyle="rounded-3xl"
                  onChange={e => {
                    const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                    updatedConfig.max_length = e.target.value;
                    setOpenedAttribute({
                      ...openedAttribute,
                      config: JSON.stringify(updatedConfig),
                    });
                  }}
                />
              </div>
            ) : openedAttribute?.code === 'image' ? (
              <div className="flex flex-row gap-4 my-5">
                <Radio
                  labelTitle=""
                  labelStyle="font-bold"
                  items={[
                    {
                      label: 'Single Media',
                      value: 'single_media',
                    },
                    {
                      label: 'Multiple Media',
                      value: 'multiple_media',
                    },
                  ]}
                  onSelect={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    value: string | number | boolean,
                  ) => {
                    if (event) {
                      const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                      updatedConfig.media_type = value;
                      setOpenedAttribute({
                        ...openedAttribute,
                        config: JSON.stringify(updatedConfig),
                      });
                    }
                  }}
                  defaultSelected={JSON.parse(openedAttribute?.config)?.media_type}
                />
              </div>
            ) : openedAttribute?.code === 'looping' ? (
              <div className="flex flex-col border-t-2 my-5 py-5 items-center justify-center">
                <>
                  {openedAttribute?.attributeList?.length > 0
                    ? openedAttribute?.attributeList?.map(
                        (
                          val: {
                            icon: any;
                            id: any;
                            fieldType: string;
                            name: string;
                            fieldId: any;
                            config: string;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex flex-col mb-10 w-[80%] border-2 rounded-xl p-2">
                            <div className="flex flex-row justify-between w-full border-b-2 mb-4">
                              <div className="flex flex-row w-full mb-4">
                                <img
                                  className="ml-5"
                                  src={`data:image/svg+xml;base64,${val?.icon}`}
                                />
                                <div className="font-bold capitalize ml-5">
                                  {getType(val?.fieldType)}
                                </div>
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
                                labelStyle="font-bold"
                                labelRequired
                                value={val.name}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  const updatedAttributeList = openedAttribute.attributeList.map(
                                    (attribute: { id: any }) => {
                                      if (attribute.id === val.id) {
                                        return {
                                          ...attribute,
                                          name: e.target.value,
                                        };
                                      }
                                      return attribute;
                                    },
                                  );

                                  setOpenedAttribute((prevState: any) => ({
                                    ...prevState,
                                    attributeList: updatedAttributeList,
                                  }));
                                }}
                              />
                              <InputText
                                labelTitle="Field ID"
                                labelStyle="font-bold"
                                labelRequired
                                value={val?.fieldId || getFieldId(val?.name)}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  const updatedAttributeList = openedAttribute.attributeList.map(
                                    (attribute: { id: any }) => {
                                      if (attribute.id === val.id) {
                                        return {
                                          ...attribute,
                                          fieldId: e.target.value,
                                        };
                                      }
                                      return attribute;
                                    },
                                  );

                                  setOpenedAttribute((prevState: any) => ({
                                    ...prevState,
                                    attributeList: updatedAttributeList,
                                  }));
                                }}
                              />
                            </div>
                            {val?.fieldType === 'TEXT_FIELD' || val?.fieldType === 'TEXT_AREA' ? (
                              <div className="flex flex-row gap-4 my-5">
                                <InputText
                                  labelTitle={`Minimum Length (Optional)`}
                                  labelStyle="font-bold"
                                  type="number"
                                  value={JSON.parse(val?.config).min_length}
                                  inputStyle="rounded-3xl"
                                  onChange={e => {
                                    const updatedAttributeList = openedAttribute.attributeList.map(
                                      (attribute: { id: any; config: any }) => {
                                        if (attribute.id === val.id) {
                                          const updatedAttribute = { ...attribute };
                                          const config = JSON.parse(updatedAttribute.config);
                                          config.min_length = e.target.value;
                                          updatedAttribute.config = JSON.stringify(config);
                                          return updatedAttribute;
                                        }
                                        return attribute;
                                      },
                                    );

                                    setOpenedAttribute((prevState: any) => ({
                                      ...prevState,
                                      attributeList: updatedAttributeList,
                                    }));
                                  }}
                                />
                                <InputText
                                  labelTitle={`Maximum Length (Optional)`}
                                  labelStyle="font-bold"
                                  type="number"
                                  value={JSON.parse(val?.config).max_length}
                                  inputStyle="rounded-3xl"
                                  onChange={e => {
                                    const updatedAttributeList = openedAttribute.attributeList.map(
                                      (attribute: { id: any; config: any }) => {
                                        if (attribute.id === val.id) {
                                          const updatedAttribute = { ...attribute };
                                          const config = JSON.parse(updatedAttribute.config);
                                          config.max_length = e.target.value;
                                          updatedAttribute.config = JSON.stringify(config);
                                          return updatedAttribute;
                                        }
                                        return attribute;
                                      },
                                    );

                                    setOpenedAttribute((prevState: any) => ({
                                      ...prevState,
                                      attributeList: updatedAttributeList,
                                    }));
                                  }}
                                />
                              </div>
                            ) : val?.fieldType === 'IMAGE' ? (
                              <div className="flex flex-row gap-4 my-5">
                                <Radio
                                  labelTitle=""
                                  labelStyle="font-bold"
                                  items={[
                                    {
                                      label: 'Single Media',
                                      value: 'single_media',
                                    },
                                    {
                                      label: 'Multiple Media',
                                      value: 'multiple_media',
                                    },
                                  ]}
                                  onSelect={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                    value: string | number | boolean,
                                  ) => {
                                    if (event) {
                                      const updatedAttributeList =
                                        openedAttribute.attributeList.map(
                                          (attribute: { id: any; config: any }) => {
                                            if (attribute.id === val.id) {
                                              const updatedAttribute = { ...attribute };
                                              const config = JSON.parse(updatedAttribute.config);
                                              config.media_type = value;
                                              updatedAttribute.config = JSON.stringify(config);
                                              return updatedAttribute;
                                            }
                                            return attribute;
                                          },
                                        );

                                      setOpenedAttribute((prevState: any) => ({
                                        ...prevState,
                                        attributeList: updatedAttributeList,
                                      }));
                                    }
                                  }}
                                  defaultSelected={JSON.parse(val?.config)?.media_type}
                                />
                              </div>
                            ) : null}
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
            ) : null}
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
            <div className="flex flex-row">
              <img className="ml-5" src={`data:image/svg+xml;base64,${openedAttribute?.icon}`} />
              <div className="font-bold capitalize ml-5">{getType(openedAttribute?.fieldType)}</div>
            </div>
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
              {getType(openedAttribute?.fieldType)}
            </div>
            <div className="flex flex-col w-1/2">
              <InputText
                labelTitle="Name"
                labelStyle="font-bold"
                labelRequired
                value={openedAttribute?.name}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setOpenedAttribute((prevState: any) => ({
                    ...prevState,
                    name: e.target.value,
                  }));
                }}
              />
              <InputText
                labelTitle="Field ID"
                labelStyle="font-bold"
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
            {openedAttribute?.fieldType === 'TEXT_FIELD' ||
            openedAttribute?.fieldType === 'TEXT_AREA' ? (
              <div className="flex flex-row gap-4 my-5">
                <InputText
                  labelTitle={`Minimum Length (Optional)`}
                  labelStyle="font-bold"
                  type="number"
                  value={JSON.parse(openedAttribute?.config)?.min_length || ''}
                  inputStyle="rounded-3xl"
                  onChange={e => {
                    const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                    updatedConfig.min_length = e.target.value;
                    setOpenedAttribute({
                      ...openedAttribute,
                      config: JSON.stringify(updatedConfig),
                    });
                  }}
                />
                <InputText
                  labelTitle={`Maximum Length (Optional)`}
                  labelStyle="font-bold"
                  type="number"
                  value={JSON.parse(openedAttribute?.config)?.max_length || ''}
                  inputStyle="rounded-3xl"
                  onChange={e => {
                    const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                    updatedConfig.max_length = e.target.value;
                    setOpenedAttribute({
                      ...openedAttribute,
                      config: JSON.stringify(updatedConfig),
                    });
                  }}
                />
              </div>
            ) : openedAttribute?.fieldType === 'IMAGE' ? (
              <div className="flex flex-row gap-4 my-5">
                <Radio
                  labelTitle=""
                  labelStyle="font-bold"
                  items={[
                    {
                      label: 'Single Media',
                      value: 'single_media',
                    },
                    {
                      label: 'Multiple Media',
                      value: 'multiple_media',
                    },
                  ]}
                  onSelect={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    value: string | number | boolean,
                  ) => {
                    if (event) {
                      const updatedConfig = JSON.parse(openedAttribute?.config) || {};
                      updatedConfig.media_type = value;
                      setOpenedAttribute({
                        ...openedAttribute,
                        config: JSON.stringify(updatedConfig),
                      });
                    }
                  }}
                  defaultSelected={JSON.parse(openedAttribute?.config)?.media_type}
                />
              </div>
            ) : openedAttribute?.fieldType === 'LOOPING' ? (
              <div className="flex flex-col border-t-2 my-5 py-5 items-center justify-center">
                <>
                  {openedAttribute?.attributeList?.length > 0
                    ? openedAttribute?.attributeList?.map(
                        (
                          val: {
                            icon: any;
                            id: any;
                            fieldType: string;
                            name: string;
                            fieldId: any;
                            config: string;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex flex-col mb-10 w-[80%] border-2 rounded-xl p-2">
                            <div className="flex flex-row justify-between w-full border-b-2 mb-4">
                              <div className="flex flex-row w-full mb-4">
                                <img
                                  className="ml-5"
                                  src={`data:image/svg+xml;base64,${val?.icon}`}
                                />
                                <div className="font-bold capitalize ml-5">
                                  {getType(val?.fieldType)}
                                </div>
                              </div>
                              <svg
                                role="button"
                                onClick={() => {
                                  const updatedAttributeList = openedAttribute.attributeList.filter(
                                    (_attribute: any, index: number) => index !== idx,
                                  );
                                  setOpenedAttribute((prevState: any) => ({
                                    ...prevState,
                                    attributeList: updatedAttributeList,
                                  }));
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
                                labelStyle="font-bold"
                                labelRequired
                                value={val.name}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  const updatedAttributeList = openedAttribute.attributeList.map(
                                    (attribute: { id: any }) => {
                                      if (attribute.id === val.id) {
                                        return {
                                          ...attribute,
                                          name: e.target.value,
                                        };
                                      }
                                      return attribute;
                                    },
                                  );

                                  setOpenedAttribute((prevState: any) => ({
                                    ...prevState,
                                    attributeList: updatedAttributeList,
                                  }));
                                }}
                              />
                              <InputText
                                labelTitle="Field ID"
                                labelStyle="font-bold"
                                labelRequired
                                value={val?.fieldId || getFieldId(val?.name)}
                                inputStyle="rounded-3xl"
                                onChange={e => {
                                  const updatedAttributeList = openedAttribute.attributeList.map(
                                    (attribute: { id: any }) => {
                                      if (attribute.id === val.id) {
                                        return {
                                          ...attribute,
                                          fieldId: e.target.value,
                                        };
                                      }
                                      return attribute;
                                    },
                                  );

                                  setOpenedAttribute((prevState: any) => ({
                                    ...prevState,
                                    attributeList: updatedAttributeList,
                                  }));
                                }}
                              />
                            </div>
                            {val?.fieldType === 'TEXT_FIELD' || val?.fieldType === 'TEXT_AREA' ? (
                              <div className="flex flex-row gap-4 my-5">
                                <InputText
                                  labelTitle={`Minimum Length (Optional)`}
                                  labelStyle="font-bold"
                                  type="number"
                                  value={JSON.parse(val?.config).min_length}
                                  inputStyle="rounded-3xl"
                                  onChange={e => {
                                    const updatedAttributeList = openedAttribute.attributeList.map(
                                      (attribute: { id: any; config: any }) => {
                                        if (attribute.id === val.id) {
                                          const updatedAttribute = { ...attribute };
                                          const config = JSON.parse(updatedAttribute.config);
                                          config.min_length = e.target.value;
                                          updatedAttribute.config = JSON.stringify(config);
                                          return updatedAttribute;
                                        }
                                        return attribute;
                                      },
                                    );

                                    setOpenedAttribute((prevState: any) => ({
                                      ...prevState,
                                      attributeList: updatedAttributeList,
                                    }));
                                  }}
                                />
                                <InputText
                                  labelTitle={`Maximum Length (Optional)`}
                                  labelStyle="font-bold"
                                  type="number"
                                  value={JSON.parse(val?.config).max_length}
                                  inputStyle="rounded-3xl"
                                  onChange={e => {
                                    const updatedAttributeList = openedAttribute.attributeList.map(
                                      (attribute: { id: any; config: any }) => {
                                        if (attribute.id === val.id) {
                                          const updatedAttribute = { ...attribute };
                                          const config = JSON.parse(updatedAttribute.config);
                                          config.max_length = e.target.value;
                                          updatedAttribute.config = JSON.stringify(config);
                                          return updatedAttribute;
                                        }
                                        return attribute;
                                      },
                                    );

                                    setOpenedAttribute((prevState: any) => ({
                                      ...prevState,
                                      attributeList: updatedAttributeList,
                                    }));
                                  }}
                                />
                              </div>
                            ) : val?.fieldType === 'IMAGE' ? (
                              <div className="flex flex-row gap-4 my-5">
                                <Radio
                                  labelTitle=""
                                  labelStyle="font-bold"
                                  items={[
                                    {
                                      label: 'Single Media',
                                      value: 'single_media',
                                    },
                                    {
                                      label: 'Multiple Media',
                                      value: 'multiple_media',
                                    },
                                  ]}
                                  onSelect={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                    value: string | number | boolean,
                                  ) => {
                                    if (event) {
                                      event.stopPropagation();
                                      const updatedAttributeList =
                                        openedAttribute.attributeList.map(
                                          (attribute: { id: any; config: any }) => {
                                            if (attribute.id === val.id) {
                                              const updatedAttribute = { ...attribute };
                                              const config = JSON.parse(updatedAttribute.config);
                                              config.media_type = value;
                                              updatedAttribute.config = JSON.stringify(config);
                                              return updatedAttribute;
                                            }
                                            return attribute;
                                          },
                                        );

                                      setOpenedAttribute((prevState: any) => ({
                                        ...prevState,
                                        attributeList: updatedAttributeList,
                                      }));
                                    }
                                  }}
                                  defaultSelected={JSON.parse(val?.config)?.media_type}
                                />
                              </div>
                            ) : null}
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
            ) : null}
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
      <TitleCard title={'New Content Type'} topMargin="mt-2">
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
            className="btn btn-success btn-md text-white">
            {t('btn.create')}
          </button>
        </div>
      </TitleCard>
    </>
  );
}
