import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Key, SetStateAction, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import TableEdit from '../../assets/table-edit.png';
import TableDelete from '../../assets/table-delete.svg';
import Modal from '@/components/atoms/Modal';
import Radio from '@/components/molecules/Radio';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { openToast } from '@/components/atoms/Toast/slice';
import { copyArray, errorMessageTypeConverter } from '@/utils/logicHelper';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useAppDispatch } from '../../store';
import { InputText } from '@/components/atoms/Input/InputText';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import {
  useGetConfigQuery,
  usePostTypeCreateMutation,
} from '@/services/ContentType/contentTypeApi';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';

export default function ContentTypeNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showComfirm, setShowComfirm] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [search, setSearch] = useState('');

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

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

  const listDataType = [
    {
      value: 'SINGLE',
      label: 'Single',
    },
    {
      value: 'COLLECTION',
      label: 'Collection',
    },
  ];

  const [selectedDataType, setSelectedDataType] = useState<any>(listDataType[1]);

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
    navigate(-1);
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
          <Controller
            name="contentName"
            control={control}
            defaultValue=""
            rules={{ required: t('components.atoms.required') ?? '' }}
            render={({ field }) => (
              <InputText
                {...field}
                labelTitle={t('user.content-type-edit.contentTypeColumnName')}
                direction="row"
                labelRequired
                roundStyle="xl"
                placeholder={'Enter your new content name'}
                isError={!!errors?.contentName}
                inputWidth={400}
              />
            )}
          />
        </div>

        <div className="flex flex-row items-center mt-3">
          <div className="flex flex-row w-1/2 whitespace-nowrap items-center gap-24 text-lg font-bold">
            <Controller
              name="slugName"
              control={control}
              defaultValue=""
              rules={{ required: t('components.atoms.required') ?? '' }}
              render={({ field }) => (
                <InputText
                  {...field}
                  labelTitle={t('user.content-type-edit.slugName')}
                  direction="row"
                  labelRequired
                  roundStyle="xl"
                  placeholder={t('user.content-type-edit.slugName-placeholder')}
                  isError={!!errors?.slugName}
                  inputWidth={400}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-row items-center mt-3">
          <div className="flex flex-row items-center">
            <Typography type="body" size="s" weight="bold" className="w-[222px] ml-1">
              {t('user.page-template-list.page-template.table.data-type')}
              <span className={'text-reddist ml-1'}>{`*`}</span>
            </Typography>
            <FormList.DropDown
              defaultValue={selectedDataType?.label}
              items={listDataType}
              onChange={(e: any) => {
                setSelectedDataType(e);
              }}
              inputWidth={400}
            />
          </div>
          {selectedDataType?.value === 'COLLECTION' && (
            <div className="ml-10">
              <CheckBox
                defaultValue={isUseCategory}
                updateFormValue={e => {
                  setIsUseCategory(e.value);
                }}
                labelTitle={t('user.content-type-edit.use-category')}
                updateType={''}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  function onSubmit(data: any) {
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
      name: data?.contentName,
      slug: data?.slugName,
      isUseCategory: selectedDataType.value === 'COLLECTION' ? isUseCategory : false,
      attributeRequests: transformedData.filter((_element: any, index: number) => index >= 2),
      dataType: selectedDataType.value,
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
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.content-type.${errorMessageTypeConverter(error.message)}`),
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
                  if (val.code === 'text_field' || val.code === 'text_area' || val.code === 'tags') {
                    val.config = '{"min_length":"","max_length":""}';
                  } else if (val.code === 'image' || val.code === 'document') {
                    val.config = '{"media_type":""}';
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
        <div className="p-4 font-bold">{t('user.content-type-edit.list-attribute')}</div>
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

                    if (val.code === 'text_field' || val.code === 'text_area' || val.code === 'tags') {
                      data.config = '{"min_length":"","max_length":""}';
                    } else if (val.code === 'image' || val.code === 'document') {
                      data.config = '{"media_type":""}';
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

                    if (val.code === 'text_field' || val.code === 'text_area' || val.code === 'tags') {
                      data.config = '{"min_length":"","max_length":""}';
                    } else if (val.code === 'image' || val.code === 'document') {
                      data.config = '{"media_type":""}';
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
              <div className="font-bold capitalize ml-5">
                {getType(openedAttribute?.code) === 'looping'
                  ? 'looping content'
                  : getType(openedAttribute?.code)}
              </div>
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
              {`${t('user.content-type-edit.add-new')} ${
                getType(openedAttribute?.code) === 'looping'
                  ? t('user.content-type-edit.looping')
                  : `${t('user.content-type-edit.add-new-extension')} ${getType(
                      openedAttribute?.code,
                    )}`
              }`}
            </div>
            <div className="flex flex-col w-1/2">
              <InputText
                labelTitle={t('user.content-type-edit.modal.addAttribute.nameLabel')}
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
                labelTitle={t('user.content-type-edit.modal.addAttribute.fieldIdLabel')}
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
            {openedAttribute?.code === 'text_field' || openedAttribute?.code === 'text_area' || openedAttribute?.code === 'tags' ? (
              <div className="flex flex-row gap-4 my-5">
                <InputText
                  labelTitle={t('user.content-type-edit.modal.addAttribute.minLengthLabel')}
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
                  labelTitle={t('user.content-type-edit.modal.addAttribute.maxLengthLabel')}
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
            ) : openedAttribute?.code === 'image' || openedAttribute?.code === 'document' ? (
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

                                  const newOpenedAttribute: any = copyArray(openedAttribute);
                                  if (newOpenedAttribute?.attributeList?.length > 0) {
                                    newOpenedAttribute?.attributeList?.splice(idx, 1);
                                    setOpenedAttribute(newOpenedAttribute);
                                  }
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
                                labelTitle={t(
                                  'user.content-type-edit.modal.addAttribute.nameLabel',
                                )}
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
                                labelTitle={t(
                                  'user.content-type-edit.modal.addAttribute.fieldIdLabel',
                                )}
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
                            {val?.fieldType === 'TEXT_FIELD' || val?.fieldType === 'TEXT_AREA' || val?.fieldType === 'TAGS'? (
                              <div className="flex flex-row gap-4 my-5">
                                <InputText
                                  labelTitle={t(
                                    'user.content-type-edit.modal.addAttribute.minLengthLabel',
                                  )}
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
                                  labelTitle={t(
                                    'user.content-type-edit.modal.addAttribute.maxLengthLabel',
                                  )}
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
                            ) : val?.fieldType === 'IMAGE' || val?.fieldType === 'DOCUMENT' ? (
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
                  {t('user.content-type-edit.modal.addAttribute.addAttributeButton')}
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
                {t('btn.create')}
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
              <div className="font-bold capitalize ml-5">
                {getType(openedAttribute?.fieldType) === 'looping'
                  ? 'looping content'
                  : getType(openedAttribute?.fieldType)}
              </div>
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
              <div className="font-bold capitalize ml-5">
                {getType(openedAttribute?.fieldType) === 'looping'
                  ? 'multiple content type'
                  : getType(openedAttribute?.fieldType)}
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <InputText
                labelTitle={t('user.content-type-edit.modal.addAttribute.nameLabel')}
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
                labelTitle={t('user.content-type-edit.modal.addAttribute.fieldIdLabel')}
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
            openedAttribute?.fieldType === 'TEXT_AREA' ||
            openedAttribute?.fieldType === 'TAGS' ? (
              <div className="flex flex-row gap-4 my-5">
                <InputText
                  labelTitle={t('user.content-type-edit.modal.addAttribute.minLengthLabel')}
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
                  labelTitle={t('user.content-type-edit.modal.addAttribute.maxLengthLabel')}
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
            ) : openedAttribute?.fieldType === 'IMAGE' ||
              openedAttribute?.fieldType === 'DOCUMENT' ? (
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
                                labelTitle={t(
                                  'user.content-type-edit.modal.addAttribute.nameLabel',
                                )}
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
                                labelTitle={t(
                                  'user.content-type-edit.modal.addAttribute.fieldIdLabel',
                                )}
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
                            {val?.fieldType === 'TEXT_FIELD' || val?.fieldType === 'TEXT_AREA' || val?.fieldType === 'TAGS'? (
                              <div className="flex flex-row gap-4 my-5">
                                <InputText
                                  labelTitle={t(
                                    'user.content-type-edit.modal.addAttribute.minLengthLabel',
                                  )}
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
                                  labelTitle={t(
                                    'user.content-type-edit.modal.addAttribute.maxLengthLabel',
                                  )}
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
                            ) : val?.fieldType === 'IMAGE' || val?.fieldType === 'DOCUMENT' ? (
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
                  {t('user.content-type-edit.modal.addAttribute.addAttributeButton')}
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
                {t('user.content-type-edit.edit')}
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
      <TitleCard title={t('user.content-type-edit.add-content-type')} topMargin="mt-2">
        <ModalConfirm
          open={showComfirm}
          cancelAction={() => {
            setShowComfirm(false);
          }}
          title={titleConfirm}
          cancelTitle={t('user.content-type-edit.modal.confirm.cancelButton')}
          message={messageConfirm}
          submitAction={onLeave}
          submitTitle={t('user.content-type-edit.modal.confirm.confirmButton')}
          icon={CancelIcon}
          btnSubmitStyle="btn-warning"
        />
        <form className="flex flex-col w-100" onSubmit={handleSubmit(onSubmit)}>
          {renderForm()}
          {renderListItems()}
          <div className="flex absolute right-2 bottom-2 gap-3">
            <button
              className="btn btn-outline btn-md"
              type="button"
              onClick={() => {
                setTitleConfirm(t('user.content-type-edit.modal.confirm.title') ?? '');
                setmessageConfirm(t('user.content-type-edit.modal.confirm.message') ?? '');
                setShowComfirm(true);
              }}>
              {t('btn.cancel')}
            </button>
            <button type="submit" className="btn btn-success btn-md text-white">
              {t('btn.create')}
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
}
