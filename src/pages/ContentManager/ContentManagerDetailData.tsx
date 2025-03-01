import dayjs from 'dayjs';
import React, { Key, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'i18next';

import Plus from '@/assets/plus-purple.svg';
import Edit from '@/assets/edit-purple.svg';
import Restore from '@/assets/restore.svg';
import RestoreOrange from '@/assets/restore-orange.svg';
import CheckOrange from '@/assets/check-orange.svg';
import FormList from '@/components/molecules/FormList';
import Typography from '@/components/atoms/Typography';
import StatusBadge from '@/components/atoms/StatusBadge';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import CloseSolid from '../../assets/close-solid.svg';
import PaperIcon from '../../assets/paper.png';
import WarningIcon from '@/assets/warning.png';
import ModalForm from '@/components/molecules/ModalForm';
import ModalLog from './components/ModalLog';
import TimelineLog from '@/assets/timeline-log.svg';
import TableDelete from '@/assets/table-delete.svg';
import PaperSubmit from '../../assets/paper-submit.png';
import CancelIcon from '@/assets/cancel.png';
import RectangleBadge from '@/components/molecules/Badge/RectangleBadge';
import { store, useAppDispatch } from '@/store';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import {
  useGetCategoryListQuery,
  useGetContentDataDetailQuery,
  useGetEligibleAutoApproveQuery,
  useRestoreContentDataMutation,
  useCreateCategoryMutation,
  useUpdateContentDataMutation,
  useUpdateContentDataStatusMutation,
} from '@/services/ContentManager/contentManagerApi';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { ButtonMenu } from '@/components/molecules/ButtonMenu';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { openToast } from '@/components/atoms/Toast/slice';
import { errorMessageTypeConverter, transformText } from '@/utils/logicHelper';
import { v4 as uuidv4 } from 'uuid';

export default function ContentManagerDetailData() {
  const dispatch = useAppDispatch();
  const { trigger } = useForm();
  const [contentDataDetailList, setContentDataDetailList] = useState<any>({
    id: null,
    title: '',
    shortDesc: '',
    categoryName: '',
    status: '',
    lastComment: '',
    contentData: [],
  });
  const [isEdited, setIsEdited] = useState(false);
  const [isAlreadyReview, setIsAlreadyReview] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [showModalWarning, setShowModalWarning] = useState(false);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalRejected, setShowModalRejected] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const roles = store.getState().loginSlice.roles;
  const [idLog, setIdLog] = useState<number | null>(null);
  const [logTitle, setLogTitle] = useState(null);

  const handleChange = (id: string | number, value: string) => {
    setContentDataDetailList((prevFormValues: any) => ({
      ...prevFormValues,
      [id]: value,
    }));
  };

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [contentTempData, setContentTempData] = useState<any[]>([]);

  // GO BACK
  const navigate = useNavigate();
  const redirectPage = () => {
    navigate(-1);
    void refetch();
  };

  const params = useParams();
  const [id] = useState<number>(Number(params.dataId));
  const [postTypeId] = useState<number>(Number(params.id));

  // TABLE PAGINATION STATE
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');

  // RTK GET DATA
  const { data: contentDataDetail, refetch } = useGetContentDataDetailQuery({ id });

  const fetchGetEligibleAutoApprove = useGetEligibleAutoApproveQuery({
    actionType: 'edit',
    dataType: 'content',
  });
  const { data: eligibleAutoApprove } = fetchGetEligibleAutoApprove;

  // AUTO APPROVE MODAL STATE
  const [showModalAutoApprove, setShowModalAutoApprove] = useState<boolean>(false);
  const [isAutoApprove, setIsAutoApprove] = useState<boolean>(false);

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK CREATE CONTENT MANAGER CATEGORY
  const [createContentCategory] = useCreateCategoryMutation();

  // CREATE CATEGORY STATE
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (contentDataDetail) {
      const updatedContentData = contentDataDetail?.contentDataDetail?.contentData.map(
        (item: any) => {
          if (item.fieldType === 'LOOPING' && item.contentData) {
            return {
              ...item,
              contentData: item.contentData.map((content: any) => ({
                ...content,
                uuid: uuidv4(),
              })),
            };
          }
          return item;
        },
      );

      setContentDataDetailList({
        ...contentDataDetail?.contentDataDetail,
        contentData: updatedContentData,
      });

      if (contentDataDetail?.contentDataDetail?.categories[0]?.categoryName) {
        setSelectedCategories(
          contentDataDetail?.contentDataDetail.categories.map((item: any) => item.categoryName),
        );
      }
    }
  }, [contentDataDetail]);

  useEffect(() => {
    void refetch();
  }, []);

  const handleFormChange = (
    id: string | number,
    value: any,
    fieldType?: string,
    isLooping: boolean = false,
    parentId: any = false,
    idxLoop: any = false,
    nestedId: any = false,
  ) => {
    setContentTempData((prevFormValues: any[]) => {
      return prevFormValues.map(item => {
        if (item.id === id || item.id === parentId) {
          if (!isLooping) {
            return { ...item, value, fieldType };
          } else if (item.fieldType === 'LOOPING') {
            const updatedContentData = item.contentData.map((data: any, idx: any) => {
              if (idxLoop === idx) {
                const updatedDetails = data.details.map((detail: any) => {
                  if (detail.id === nestedId) {
                    return { ...detail, value };
                  }
                  return detail;
                });

                return { ...data, details: updatedDetails };
              }
              return data;
            });

            return { ...item, contentData: updatedContentData };
          }
        }
        return item;
      });
    });
  };

  const fetchGetCategoryList = useGetCategoryListQuery(
    {
      postTypeId,
      pageIndex,
      limit: pageLimit,
      direction,
      search,
      sortBy,
    },
    { skip: contentDataDetailList?.categoryName === '' },
  );
  const { data: categoryListData, refetch: refetchCategory } = fetchGetCategoryList;

  useEffect(() => {
    if (categoryListData) {
      const tempCategoryList = categoryListData?.categoryList?.categoryList.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setCategoryList(tempCategoryList);
      void refetchCategory();
    }
  }, [categoryListData]);

  // RTK POST DATA
  const [updateContentData] = useUpdateContentDataMutation();
  const [updateContentDataStatus] = useUpdateContentDataStatusMutation();
  const [restoreContentData] = useRestoreContentDataMutation();

  const convertContentData = (inputData: any[]) => {
    const convertedData = [];
    for (const item of inputData) {
      if (item.fieldType === 'LOOPING' && item.contentData) {
        const contentData: any = {};

        for (const detail of item.contentData[0].details) {
          const dataImage =
            detail.fieldType === 'IMAGE' &&
            item.contentData.map(
              (data: { details: any[] }) =>
                data.details.find((d: { id: any }) => d.id === detail.id)?.value,
            );

          if (dataImage) {
            const jsonStringArray = dataImage.map((itemImg: any) => JSON.parse(itemImg));
            const dataValue: any = [];
            jsonStringArray.map((data: string | any[]) => {
              let temp = {};
              if (data.length > 0) {
                temp = data
                  ? data[0].imageUrl
                    ? JSON.stringify(data)
                    : '[{"imageUrl":"no-image","altText":"no-image"}]'
                  : '[{"imageUrl":"no-image","altText":"no-image"}]';
              } else {
                temp = '[{"imageUrl":"no-image","altText":"no-image"}]';
              }

              return dataValue.push(temp);
            });

            contentData[detail.id] = {
              id: detail.id,
              fieldType: detail.fieldType,
              value: JSON.stringify(dataValue),
            };
          } else {
            const tempValue = JSON.stringify(
              item.contentData.map(
                (data: { details: any[] }) =>
                  data.details.find((d: { id: any }) => d.id === detail.id)?.value,
              ),
            );
            contentData[detail.id] = {
              id: detail.id,
              fieldType: detail.fieldType,
              value: tempValue === null || tempValue === '' ? '-' : tempValue,
            };
          }
        }

        const loopItem = {
          id: item.id,
          value: item.value,
          fieldType: item.fieldType,
          contentData: Object.values(contentData),
        };

        convertedData.push(loopItem);
      } else {
        if (item.fieldType === 'IMAGE') {
          const dataValue = JSON.parse(item.value);
          const temp = dataValue
            ? dataValue[0]?.imageUrl
              ? JSON.stringify(dataValue)
              : '[{"imageUrl":"no-image","altText":"no-image"}]'
            : '[{"imageUrl":"no-image","altText":"no-image"}]';

          const imageData = {
            id: item.id,
            fieldType: item.fieldType,
            value: temp,
          };

          convertedData.push(imageData);
        } else {
          const { id, fieldType, value } = item;
          const data = {
            id,
            fieldType,
            value: value === null || value === '' ? '-' : value,
          };
          convertedData.push(data);
        }
      }
    }

    return convertedData;
  };

  function onSubmitData() {
    if (eligibleAutoApprove?.isUserEligibleAutoApprove?.result) {
      setShowModalAutoApprove(true);
    } else {
      saveData();
    }
  }

  const saveData = () => {
    const payload = {
      title: contentDataDetailList?.title,
      shortDesc: contentDataDetailList?.shortDesc,
      isDraft: false,
      isAutoApprove,
      postTypeId: id,
      categories: selectedCategories || '',
      contentData: convertContentData(contentTempData),
    };
    updateContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        redirectPage();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
            message: t(`errors.content-manager.${errorMessageTypeConverter(error.message)}`),
          }),
        );
        redirectPage();
      });
  };

  const onSaveNewCategory = () => {
    const payload = {
      postTypeId,
      name: newCategoryName,
      shortDesc: '-',
    };
    createContentCategory(payload)
      .unwrap()
      .then(() => {
        if (newCategoryName) {
          const updatedCategories = [...selectedCategories, newCategoryName];
          setSelectedCategories(updatedCategories);
          setNewCategoryName('');
        }
        void refetchCategory();
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('content-manager.category.add.success-msg', { name: newCategoryName }),
          }),
        );
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('content-manager.category.add.failed-msg', { name: newCategoryName }),
          }),
        );
      });
  };

  useEffect(() => {
    const attributeList = contentDataDetailList?.contentData || [];
    if (attributeList.length > 0 && contentTempData.length === 0) {
      const defaultFormData = attributeList.map((attribute: any) => {
        if (attribute.fieldType === 'LOOPING' && attribute.contentData) {
          const loopingContentData = attribute.contentData.map((nestedAttribute: any) => ({
            details: nestedAttribute.details.map((detail: any) => ({
              id: detail.id,
              name: detail.name,
              fieldType: detail.fieldType,
              value: detail.value,
            })),
          }));

          return {
            id: attribute.id,
            value: attribute.value,
            fieldType: attribute.fieldType,
            contentData: loopingContentData,
          };
        } else {
          return {
            id: attribute.id,
            value: attribute.value,
            fieldType: attribute.fieldType,
          };
        }
      });
      setContentTempData(defaultFormData);
    }
  }, [contentDataDetailList?.contentData]);

  const addNewLoopingField = (loopingId: any) => {
    const existingLoopingIndex: number = contentDataDetailList.contentData.findIndex(
      (attribute: { id: string }) => attribute.id === loopingId,
    );

    if (existingLoopingIndex !== -1) {
      const newLoopingField = {
        ...contentDataDetailList.contentData[existingLoopingIndex],
        contentData: [
          ...contentDataDetailList.contentData[existingLoopingIndex].contentData,
          {
            details: contentDataDetailList.contentData[
              existingLoopingIndex
            ].contentData[0].details.map((detail: any) => ({
              ...detail,
              value: '',
            })),
            uuid: uuidv4(),
          },
        ],
      };

      const newAttributeList = [...contentDataDetailList.contentData];
      newAttributeList[existingLoopingIndex] = newLoopingField;
      setContentDataDetailList((prevContentDataDetailList: any) => ({
        ...prevContentDataDetailList,
        contentData: newAttributeList,
      }));

      const updatedContentTempData = contentTempData.map((data: any) => {
        if (data.id === loopingId) {
          return {
            ...data,
            contentData: [
              ...data.contentData,
              {
                details: data.contentData[0].details.map((detail: any) => ({
                  ...detail,
                  value: '',
                })),
              },
            ],
          };
        }
        return data;
      });

      setContentTempData(updatedContentTempData);
    }
  };

  const deleteLoopingField = (id: any, idx: any) => {
    const parseObject = (obj: any) => JSON.parse(JSON.stringify(obj));
    const updatedContentDataDetailList = parseObject(contentDataDetailList);

    const loopingElement = updatedContentDataDetailList.contentData.find((e: any) => e.id === id);

    if (loopingElement) {
      const filteredElement = loopingElement.contentData.filter(
        (_: any, index: number) => index !== idx,
      );
      loopingElement.contentData = filteredElement;
      setContentDataDetailList(updatedContentDataDetailList);
      setContentTempData(updatedContentDataDetailList.contentData);
    }
  };

  const onCategoryChange = useCallback(
    (e: any) => {
      if (e) {
        const newItems = new Set(selectedCategories);
        newItems.add(e);
        setSelectedCategories(Array.from(newItems));
        setNewCategoryName('');
        void trigger('category'); // Trigger validation for category field
      }
    },
    [selectedCategories, trigger],
  );

  const renderFormList = () => {
    // DEFAULT VALUE
    return contentDataDetailList?.contentData.map((props: any, _index: number) => {
      const { id, name, fieldType, contentData, config, value } = props;
      const configs = JSON.parse(config);
      switch (fieldType) {
        case 'TEXT_FIELD':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
                maxLength: {
                  value: configs?.max_length > 0 ? configs?.max_length : 9999,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length > 0 ? configs?.min_length : 0,
                  message: `${configs?.min_length} characters minimum`,
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'TEXT_AREA':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
                maxLength: {
                  value: configs?.max_length > 0 ? configs?.max_length : 9999,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length > 0 ? configs?.min_length : 0,
                  message: `${configs?.min_length} characters minimum`,
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextAreaField
                    {...field}
                    key={id}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'EMAIL':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    type={field.value === '-' ? 'text' : 'email'}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'DOCUMENT':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e, fieldType);
                    field.onChange({ target: { value: e } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.FileUploaderV2
                    {...field}
                    key={id}
                    id={id}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    isDocument={true}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                    editMode={isEdited}
                  />
                );
              }}
            />
          );
        case 'IMAGE':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                validate: value => {
                  // Parse the input value as JSON
                  const parsedValue = JSON?.parse(value);
                  if (parsedValue && parsedValue.length > 0) {
                    // Check if parsedValue is an array and every item has imageUrl and altText properties
                    if (
                      Array.isArray(parsedValue) &&
                      parsedValue.every(item => item.imageUrl && item.altText)
                    ) {
                      return true; // Validation passed
                    }
                  }
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e, fieldType);
                    field.onChange({ target: { value: e } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <div className="flex flex-col">
                    <FormList.FileUploaderV2
                      {...field}
                      key={id}
                      fieldTypeLabel={transformText(name)}
                      labelTitle={transformText(name)}
                      disabled={!isEdited}
                      isDocument={false}
                      multiple={configs?.media_type === 'multiple_media'}
                      error={!!errors?.[id]?.message}
                      helperText={errors?.[id]?.message}
                      onChange={onChange}
                      editMode={isEdited}
                      optionalComponent={() => {
                        return (
                          <div className="flex flex-col gap-2">
                            {configs?.width && configs?.height && (
                              <p className="text-xs font-medium">
                                Recommended Size: {configs?.width} x {configs?.height}
                              </p>
                            )}
                            {configs?.image_fit && (
                              <p className="text-xs font-medium">
                                Image Fit:{' '}
                                {configs?.image_fit.includes('full')
                                  ? 'Proportional Full'
                                  : 'Proportional Crop'}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                );
              }}
            />
          );
        case 'TEXT_EDITOR':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: { value: true, message: `${name} is required` },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e, fieldType);
                    field.onChange(e);
                  },
                  [id, fieldType, field, handleFormChange],
                );

                return (
                  <FormList.TextEditor
                    title={name}
                    value={field.value}
                    error={!!errors?.[id.toString()]}
                    helperText={errors?.[id.toString()]?.message}
                    disabled={!isEdited}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'PHONE_NUMBER':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: `${name} is required`,
                pattern: {
                  value: /^[\d./-]+$/,
                  message: 'Invalid number',
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'YOUTUBE_URL':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                required: `${name} is required`,
                pattern: {
                  value:
                    /^([-]|\b(https?:\/\/)?([-\w]+\.)+[-\w]+(-|\.\w{2,})(:\d+)?(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?\b)$/i,
                  message: 'Invalid URL',
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    labelTitle={transformText(name)}
                    disabled={!isEdited}
                    placeholder=""
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'EMAIL_FORM':
          return (
            <div className="flex flex-col">
              <div className="flex flex-row mt-16">
                <div>
                  <Typography type="body" size="m" weight="bold" className={`w-48 mr-9 -mt-7 mb-2`}>
                    Email Form
                  </Typography>
                  <Typography
                    type="body"
                    size="m"
                    weight="bold"
                    className="w-56 h-full flex items-center">
                    {name}
                  </Typography>
                </div>
                <Controller
                  key={id}
                  name={id.toString()}
                  control={control}
                  defaultValue=""
                  render={({ field }) => {
                    const onChange = useCallback(
                      (e: any) => {
                        handleFormChange(id, e.value, fieldType);
                        field.onChange({ target: { value: e.value } });
                      },
                      [id, field, handleFormChange],
                    );

                    useEffect(() => {
                      if (value) {
                        handleFormChange(id, value, fieldType);
                        field.onChange({ target: { value } });
                      }
                    }, [value]);
                    return (
                      <FormList.EmailForm
                        {...field}
                        key={id}
                        defaultValue={value}
                        fieldTypeLabel={transformText(name)}
                        disabled={!isEdited}
                        placeholder=""
                        error={!!errors?.[id]?.message}
                        helperText={errors?.[id]?.message}
                        onChange={onChange}
                      />
                    );
                  }}
                />
              </div>
              <div className="border my-10" />
            </div>
          );
        case 'TAGS':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue={value}
              rules={{
                maxLength: {
                  value: configs?.max_length > 0 ? configs?.max_length : 9999,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length > 0 ? configs?.min_length : 0,
                  message: `${configs?.min_length} characters minimum`,
                },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, e.target.value, fieldType);
                    field.onChange({ target: { value: e.target.value } });
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextField
                    {...field}
                    key={id}
                    fieldTypeLabel={transformText(name)}
                    disabled={!isEdited}
                    labelTitle={transformText(name)}
                    placeholder={t('user.content-manager-new.tags-placeholder')}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'LOOPING':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 my-5 ml-1 mr-9">
                {name}
              </Typography>
              <div className="card w-full shadow-md p-5 my-5">
                {contentData?.map((value: { details: any[]; uuid: any }, idx: Key) => (
                  <>
                    <div key={`content-${idx}`}>
                      <div className="p-2 flex items-end justify-end">
                        <div className="px-4 py-2 bg-light-purple rounded-xl font-semibold text-bright-purple">
                          {(idx as number) + 1}
                        </div>
                        {(idx as number) > 0 && isEdited && (
                          <div className="tooltip ml-2" data-tip={t('action.delete')}>
                            <img
                              className={`cursor-pointer select-none flex items-center justify-center`}
                              src={TableDelete}
                              onClick={() => {
                                deleteLoopingField(id, idx);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      {value.details.map(
                        (val: { config: any; fieldType: any; id: any; value: any; name: any }) => {
                          const uniqueKey = `${value.uuid}_${val.name}`;

                          switch (val.fieldType) {
                            case 'EMAIL':
                              return (
                                <Controller
                                  key={`EMAIL_${uniqueKey}`}
                                  name={`EMAIL_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{ required: `${val.name} is required` }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.TextField
                                        {...field}
                                        key={id}
                                        type={field.value === '-' ? 'text' : 'email'}
                                        fieldTypeLabel={transformText(val.name)}
                                        labelTitle={transformText(val.name)}
                                        disabled={!isEdited}
                                        placeholder=""
                                        error={!!errors?.[`EMAIL_${uniqueKey}`]?.message}
                                        helperText={errors?.[`EMAIL_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'DOCUMENT':
                              return (
                                <Controller
                                  key={`DOCUMENT_${uniqueKey}`}
                                  name={`DOCUMENT_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{
                                    required: { value: true, message: `${val.name} is required` },
                                  }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.FileUploaderV2
                                        {...field}
                                        key={`DOCUMENT_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val.name)}
                                        labelTitle={transformText(val.name)}
                                        disabled={!isEdited}
                                        isDocument={true}
                                        multiple={configs?.media_type === 'multiple_media'}
                                        error={!!errors?.[`DOCUMENT_${uniqueKey}`]?.message}
                                        helperText={errors?.[`DOCUMENT_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                        editMode={true}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'TEXT_AREA':
                              return (
                                <Controller
                                  key={`TEXT_AREA_${uniqueKey}`}
                                  name={`TEXT_AREA_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{ required: `${val.name} is required` }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.TextAreaField
                                        {...field}
                                        key={`TEXT_AREA_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val.name)}
                                        labelTitle={transformText(val.name)}
                                        placeholder=""
                                        error={!!errors?.[`TEXT_AREA_${uniqueKey}`]?.message}
                                        helperText={errors?.[`TEXT_AREA_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'TEXT_FIELD':
                              return (
                                <Controller
                                  key={`TEXT_FIELD_${uniqueKey}`}
                                  name={`TEXT_FIELD_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{ required: `${name} is required` }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );

                                    return (
                                      <FormList.TextField
                                        {...field}
                                        key={`TEXT_FIELD_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val?.name)}
                                        labelTitle={transformText(val?.name)}
                                        disabled={!isEdited}
                                        placeholder=""
                                        error={!!errors?.[`TEXT_FIELD_${uniqueKey}`]?.message}
                                        helperText={errors?.[`TEXT_FIELD_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'TEXT_EDITOR':
                              return (
                                <Controller
                                  key={`TEXT_EDITOR_${uniqueKey}`}
                                  name={`TEXT_EDITOR_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{
                                    required: { value: true, message: `${val.name} is required` },
                                  }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange(e);
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );

                                    return (
                                      <FormList.TextEditor
                                        title={val.name}
                                        value={field.value}
                                        error={!!errors?.[`TEXT_EDITOR_${uniqueKey}`]}
                                        helperText={errors?.[`TEXT_EDITOR_${uniqueKey}`]?.message}
                                        disabled={!isEdited}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'TAGS':
                              return (
                                <Controller
                                  key={`TAGS_${uniqueKey}`}
                                  name={`TAGS_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );

                                    return (
                                      <FormList.TextField
                                        {...field}
                                        key={`TAGS_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val?.name)}
                                        labelTitle={transformText(val?.name)}
                                        disabled={!isEdited}
                                        placeholder=""
                                        error={!!errors?.[`TAGS_${uniqueKey}`]?.message}
                                        helperText={errors?.[`TAGS_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'IMAGE':
                              return (
                                <Controller
                                  key={`IMAGE_${uniqueKey}`}
                                  name={`IMAGE_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{
                                    validate: value => {
                                      // Parse the input value as JSON
                                      const parsedValue = JSON?.parse(value);
                                      if (parsedValue && parsedValue.length > 0) {
                                        // Check if parsedValue is an array and every item has imageUrl and altText properties
                                        if (
                                          Array.isArray(parsedValue) &&
                                          parsedValue.every(item => item.imageUrl && item.altText)
                                        ) {
                                          return true; // Validation passed
                                        }
                                      }
                                    },
                                  }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.FileUploaderV2
                                        {...field}
                                        key={`IMAGE_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val?.name)}
                                        labelTitle={transformText(val?.name)}
                                        disabled={!isEdited}
                                        isDocument={false}
                                        multiple={
                                          JSON.parse(val?.config)?.media_type === 'multiple_media'
                                        }
                                        error={!!errors?.[`IMAGE_${uniqueKey}`]?.message}
                                        helperText={errors?.[`IMAGE_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                        editMode={isEdited}
                                        optionalComponent={() => {
                                          return (
                                            <div className="flex flex-col gap-2">
                                              {JSON.parse(val?.config)?.width &&
                                                JSON.parse(val?.config)?.height && (
                                                  <p className="text-xs font-medium">
                                                    Recommended Size:{' '}
                                                    {JSON.parse(val?.config)?.width} x{' '}
                                                    {JSON.parse(val?.config)?.height}
                                                  </p>
                                                )}
                                              {JSON.parse(val?.config)?.image_fit && (
                                                <p className="text-xs font-medium">
                                                  Image Fit:{' '}
                                                  {JSON.parse(val?.config)?.image_fit.includes(
                                                    'full',
                                                  )
                                                    ? 'Proportional Full'
                                                    : 'Proportional Crop'}
                                                </p>
                                              )}
                                            </div>
                                          );
                                        }}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'YOUTUBE_URL':
                              return (
                                <Controller
                                  key={`YOUTUBE_URL_${uniqueKey}`}
                                  name={`YOUTUBE_URL_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{
                                    required: `${val.name} is required`,
                                    pattern: {
                                      value:
                                        /^([-]|\b(https?:\/\/)?([-\w]+\.)+[-\w]+(-|\.\w{2,})(:\d+)?(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?\b)$/i,
                                      message: 'Invalid URL',
                                    },
                                  }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.TextField
                                        {...field}
                                        key={`YOUTUBE_URL_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val?.name)}
                                        labelTitle={transformText(val?.name)}
                                        disabled={!isEdited}
                                        placeholder=""
                                        error={!!errors?.[`YOUTUBE_URL_${uniqueKey}`]?.message}
                                        helperText={errors?.[`YOUTUBE_URL_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'PHONE_NUMBER':
                              return (
                                <Controller
                                  key={`PHONE_NUMBER_${uniqueKey}`}
                                  name={`PHONE_NUMBER_${uniqueKey}`}
                                  control={control}
                                  defaultValue={val.value}
                                  rules={{
                                    required: `${val.name} is required`,
                                    pattern: {
                                      value: /^[\d./-]+$/,
                                      message: 'Invalid number',
                                    },
                                  }}
                                  render={({ field }) => {
                                    const onChange = useCallback(
                                      (e: any) => {
                                        handleFormChange(
                                          val.id,
                                          e.target.value,
                                          val.fieldType,
                                          true,
                                          id,
                                          idx,
                                          val.id,
                                        );
                                        field.onChange({ target: { value: e.target.value } });
                                      },
                                      [val.id, val.fieldType, field, handleFormChange],
                                    );
                                    return (
                                      <FormList.TextField
                                        {...field}
                                        key={`PHONE_NUMBER_${uniqueKey}`}
                                        fieldTypeLabel={transformText(val?.name)}
                                        labelTitle={transformText(val?.name)}
                                        disabled={!isEdited}
                                        placeholder=""
                                        error={!!errors?.[`PHONE_NUMBER_${uniqueKey}`]?.message}
                                        helperText={errors?.[`PHONE_NUMBER_${uniqueKey}`]?.message}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                />
                              );
                            case 'EMAIL_FORM':
                              return (
                                <div className="flex flex-col">
                                  <div className="flex flex-row mt-16">
                                    <div>
                                      <Typography
                                        type="body"
                                        size="m"
                                        weight="bold"
                                        className={`w-48 mr-9 -mt-7 mb-2`}>
                                        {t('user.content-manager-new.email-form')}
                                      </Typography>
                                      <Typography
                                        type="body"
                                        size="m"
                                        weight="bold"
                                        className="w-56 h-full flex items-center">
                                        {val.name}
                                      </Typography>
                                    </div>
                                    <Controller
                                      key={`EMAIL_FORM_${uniqueKey}`}
                                      name={`EMAIL_FORM_${uniqueKey}`}
                                      control={control}
                                      defaultValue={val.value}
                                      render={({ field }) => {
                                        const onChange = useCallback(
                                          (e: any) => {
                                            const value =
                                              e.value === '' || e.value === null ? '-' : e.value;
                                            handleFormChange(
                                              val.id,
                                              value,
                                              val.fieldType,
                                              true,
                                              id,
                                              idx,
                                              val.id,
                                            );
                                            field.onChange({ target: { value } });
                                          },
                                          [val.id, val.fieldType, field, handleFormChange],
                                        );

                                        return (
                                          <FormList.EmailForm
                                            {...field}
                                            key={`EMAIL_FORM_${uniqueKey}`}
                                            fieldTypeLabel={transformText(val.name)}
                                            disabled={!isEdited}
                                            placeholder=""
                                            error={!!errors?.[`EMAIL_FORM_${uniqueKey}`]?.message}
                                            helperText={errors?.[`EMAIL_FORM_${uniqueKey}`]?.message}
                                            items={categoryList}
                                            onChange={onChange}
                                          />
                                        );
                                      }}
                                    />
                                  </div>
                                  <div className="border my-10" />
                                </div>
                              );
                            default:
                              return (
                                <p>{`${val.fieldType} ${val.id} ${val.name} is not defineds`}</p>
                              );
                          }
                        },
                      )}
                    </div>
                    {idx === contentData?.length - 1 && isEdited && (
                      <div className="flex justify-end mt-8">
                        <button
                          onClick={() => {
                            addNewLoopingField(id);
                          }}
                          className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                          <img src={Plus} className="mr-3" />
                          {t('user.content-manager-detail-data.addData')}
                        </button>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          );
        default:
          return <p>err</p>;
      }
    });
  };

  const Footer = useCallback(() => {
    return (
      <div className="flex justify-end mt-10">
        <div className="flex flex-row p-2 gap-2">
          <button
            onClick={e => {
              e.preventDefault();
              setLeaveTitleModalShow(t('modal.confirmation'));
              setMessageLeaveModalShow(t('modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}
            className="btn btn-outline text-xs btn-sm w-28 h-10">
            {t('user.content-manager-detail-data.cancel')}
          </button>
          <button
            onClick={() => {}}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            {t('user.content-manager-detail-data.saveAsDraft')}
          </button>
          <button type="submit" className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            {t('user.content-manager-detail-data.submit')}
          </button>
        </div>
      </div>
    );
  }, [selectedCategories]);

  const rigthTopButton = () => {
    switch (contentDataDetailList?.status) {
      case 'WAITING_REVIEW':
        return null;
      case 'WAITING_APPROVE':
      case 'DELETE_APPROVE':
        return (
          <>
            {roles?.includes('CONTENT_MANAGER_APPROVE') ? (
              <ButtonMenu
                title={''}
                onClickApprove={() => {
                  setShowModalApprove(true);
                }}
                onClickReject={() => {
                  setShowModalRejected(true);
                }}
              />
            ) : null}
          </>
        );

      case 'DRAFT':
      case 'APPROVED':
      case 'REJECTED':
      case 'DELETE_REJECTED':
        return (
          <>
            {roles?.includes('CONTENT_MANAGER_EDIT')
              ? !isEdited && (
                  <button
                    onClick={() => {
                      setIsEdited(true);
                    }}
                    className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                    <img src={Edit} className="mr-3" />
                    {t('user.content-manager-detail-data.editContent')}
                  </button>
                )
              : null}
          </>
        );
      case 'ARCHIVED':
        return (
          <button
            onClick={() => {
              setShowArchivedModal(true);
            }}
            className="btn bg-secondary-warning border-none text-xs btn-sm w-48 h-10">
            <img src={Restore} className="mr-3" />
            {t('user.content-manager-detail-data.restore')}
          </button>
        );
      default:
        return null;
    }
  };

  const onUpdateStatus = (payload: { id: any; status: string; comment: string }) => {
    updateContentDataStatus(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-manager-detail-data.success'),
            message: getMessageToast(status),
          }),
        );
        void refetch();
        window.scrollTo(0, 0);
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-manager-detail-data.failed'),
            message: t(`errors.content-manager.${errorMessageTypeConverter(error.message)}`),
          }),
        );
        redirectPage();
      });
  };

  const onRestoreData = (payload: { id: any }) => {
    restoreContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-manager-detail-data.success'),
            message: getMessageToast(status),
          }),
        );
        redirectPage();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-manager-detail-data.failed'),
            message: t(`errors.content-manager.${errorMessageTypeConverter(error.message)}`),
          }),
        );
        redirectPage();
      });
  };

  const getMessageToast = (status: string) => {
    switch (status) {
      case 'WAITING APPROVE':
        return t('user.content-manager-detail-data.success-review');
      case 'APPROVED':
        return t('user.content-manager-detail-data.success-approved');
      case 'REJECTED':
        return t('user.content-manager-detail-data.success-rejected');
    }
  };

  const Badge = () => {
    return (
      <div className="ml-5 flex flex-row gap-5">
        <div
          className="ml-3 cursor-pointer tooltip"
          data-tip="Log"
          onClick={() => {
            setIdLog(id);
            setLogTitle(contentDataDetailList?.title);
          }}>
          <img src={TimelineLog} className="w-6 h-6" />
        </div>
        <StatusBadge status={contentDataDetailList?.status} />
      </div>
    );
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    redirectPage();
  };

  return (
    <React.Fragment>
      <ModalLog
        id={idLog}
        open={!!idLog}
        toggle={() => {
          setIdLog(null);
        }}
        title={`${t('user.content-manager-detail-data.log-approval') ?? ''} - ${logTitle}`}
      />
      <ModalConfirm
        open={showModalReview}
        title={t('user.content-manager-detail-data.reviewPageContent')}
        cancelTitle={t('user.content-manager-detail-data.no')}
        message={t('user.content-manager-detail-data.modalMessages.reviewPageContent') ?? ''}
        submitTitle={t('user.content-manager-detail-data.yes')}
        icon={PaperIcon}
        submitAction={() => {
          setShowModalReview(false);
          const payload = {
            id: contentDataDetailList?.id,
            status:
              contentDataDetailList?.status === 'DELETE_REVIEW'
                ? 'DELETE_APPROVE'
                : 'WAITING_APPROVE',
            comment: 'Already review',
          };

          onUpdateStatus(payload);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowModalReview(false);
          setIsAlreadyReview(false);
        }}
      />
      <ModalConfirm
        open={showModalWarning}
        title={''}
        message={t('user.content-manager-detail-data.modalMessages.warning') ?? ''}
        submitTitle={t('user.content-manager-detail-data.yes')}
        icon={WarningIcon}
        submitAction={() => {
          setShowModalWarning(false);
        }}
        btnSubmitStyle="btn-error"
        cancelTitle={''}
        cancelAction={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <ModalConfirm
        open={showModalApprove}
        title={t('user.content-manager-detail-data.approve')}
        cancelTitle={t('user.content-manager-detail-data.no')}
        message={
          contentDataDetailList?.status === 'WAITING_APPROVE'
            ? t('user.content-manager-detail-data.modalMessages.approveContent') ?? ''
            : t('user.content-manager-detail-data.modalMessages.approveDelete') ?? ''
        }
        submitTitle={t('user.content-manager-detail-data.yes')}
        icon={CheckOrange}
        submitAction={() => {
          setShowModalApprove(false);
          const payload = {
            id: contentDataDetailList?.id,
            status: contentDataDetailList?.status === 'DELETE_APPROVE' ? 'ARCHIVED' : 'APPROVED',
            comment: 'Already approve',
          };

          onUpdateStatus(payload);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowModalApprove(false);
        }}
      />
      <ModalConfirm
        open={showArchivedModal}
        title={t('user.content-manager-detail-data.restoreContentData')}
        cancelTitle={t('user.content-manager-detail-data.cancel')}
        message={t('user.content-manager-detail-data.modalMessages.restoreContentData') ?? ''}
        submitTitle={t('user.content-manager-detail-data.yes')}
        icon={RestoreOrange}
        submitAction={() => {
          setShowArchivedModal(false);
          const payload = {
            id: contentDataDetailList?.id,
          };

          onRestoreData(payload);
        }}
        btnSubmitStyle="btn bg-secondary-warning border-none"
        cancelAction={() => {
          setShowArchivedModal(false);
        }}
      />
      <ModalForm
        open={showModalRejected}
        formTitle=""
        height={640}
        submitTitle={t('user.content-manager-detail-data.yes')}
        submitType="bg-secondary-warning border-none"
        submitDisabled={rejectComments === ''}
        cancelTitle={t('user.content-manager-detail-data.no')}
        cancelAction={() => {
          setShowModalRejected(false);
        }}
        submitAction={() => {
          setShowModalRejected(false);
          const payload = {
            id: contentDataDetailList?.id,
            status:
              contentDataDetailList?.status === 'DELETE_APPROVE' ? 'DELETE_REJECTED' : 'REJECTED',
            comment: rejectComments,
          };

          onUpdateStatus(payload);
        }}>
        <div className="flex flex-col justify-center items-center">
          <img src={PaperIcon} className="w-10" />
          {contentDataDetailList?.status === 'WAITING_APPROVE' ? (
            <p className="font-semibold my-3 text-xl">
              {t('user.content-manager-detail-data.modalMessages.rejectContent')}
            </p>
          ) : (
            <p className="font-semibold my-3 text-xl">
              {t('user.content-manager-detail-data.deleteRejectConfirmation')}
            </p>
          )}
          <TextArea
            name="shortDesc"
            labelTitle={t('user.content-manager-detail-data.rejectComment')}
            labelStyle="font-bold"
            value={rejectComments}
            labelRequired
            placeholder={t('user.content-manager-detail-data.reject-comments-placeholder') ?? ''}
            containerStyle="rounded-3xl"
            onChange={e => {
              setRejectComments(e.target.value);
            }}
          />
        </div>
      </ModalForm>
      <ModalForm
        open={showModalAutoApprove}
        formTitle=""
        height={640}
        width={540}
        submitTitle={'Yes'}
        submitType="bg-secondary-warning border-none"
        cancelTitle={'No'}
        cancelAction={() => {
          setShowModalAutoApprove(false);
          setIsAutoApprove(false);
        }}
        submitPosition={'justify-center'}
        submitAction={() => {
          setShowModalAutoApprove(false);
          saveData();
        }}>
        <div className="flex flex-col justify-center items-center">
          <img src={PaperSubmit} className="w-10" />
          <p className="font-bold mt-3 text-xl">
            {t('user.content-manager-detail-data.modalMessages.autoApproveTitle')}
          </p>
          <p className="font-base mt-2 text-xl text-center">
            {t('user.content-manager-detail-data.modalMessages.autoApproveSubtitle', {
              title: contentDataDetailList?.title,
            })}
          </p>
          <CheckBox
            defaultValue={isAutoApprove}
            updateFormValue={e => {
              setIsAutoApprove(e.value);
            }}
            labelTitle={t('user.content-manager-detail-data.modalMessages.autoApproveLabel')}
            labelStyle="text-xl mt-2"
          />
        </div>
      </ModalForm>
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('yes')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />

      <TitleCard
        onBackClick={() => {
          navigate(-1);
        }}
        hasBack={true}
        title={`${contentDataDetail?.contentDataDetail?.title ?? ''}`}
        titleComponent={<Badge />}
        TopSideButtons={rigthTopButton()}>
        {contentDataDetailList?.lastComment &&
          (contentDataDetailList?.status === 'DELETE_REJECTED' ||
            contentDataDetailList?.status === 'REJECTED') && (
            <RectangleBadge title="Rejected Comment:" comment={contentDataDetailList.lastComment} />
          )}
        {contentDataDetail && (
          <form onSubmit={handleSubmit(onSubmitData)}>
            <div className="ml-2 mt-6">
              <div className="grid grid-cols-1 gap-5">
                {contentDataDetailList?.lastEdited && (
                  <div>
                    {t('user.content-manager-detail-data.lastEditedBy')}{' '}
                    <span className="font-bold">{contentDataDetailList?.lastEdited?.editedBy}</span>{' '}
                    {t('user.content-manager-detail-data.at')}{' '}
                    <span className="font-bold">
                      {dayjs(contentDataDetailList?.lastEdited?.editedAt).format(
                        'DD/MM/YYYY - HH:mm',
                      )}
                    </span>
                  </div>
                )}
                <div className="flex flex-row">
                  <Typography type="body" size="m" weight="bold" className="mt-5 ml-1 w-48 mr-16">
                    {t('user.content-manager-detail-data.title')}
                  </Typography>
                  <InputText
                    name="title"
                    value={contentDataDetailList?.title}
                    labelTitle=""
                    disabled={!isEdited}
                    roundStyle="xl"
                    onChange={e => {
                      handleChange(e.target.name, e.target.value);
                    }}
                  />
                </div>
                {contentDataDetailList?.categories?.length > 0 && (
                  <div className="flex flex-row">
                    <Typography type="body" size="m" weight="bold" className="w-48 ml-1 mr-16">
                      {t('user.content-manager-detail-data.category')}
                    </Typography>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="category"
                        control={control}
                        rules={{
                          validate: () =>
                            selectedCategories.length > 0 ||
                            `${t('user.content-manager-detail-data.category')} ${t(
                              'user.content-manager-detail-data.is-required',
                            )}`,
                        }}
                        render={({ field }) => {
                          const onChange = (val: string) => {
                            setNewCategoryName(val);
                          };

                          const onCreateCategory = (e: any) => {
                            e.preventDefault();
                            onSaveNewCategory();
                          };

                          return (
                            <FormList.TextInputDropDown
                              {...field}
                              key="category"
                              labelTitle={t('user.content-manager-detail-data.category')}
                              placeholder={t('user.content-manager-detail-data.title')}
                              error={selectedCategories.length < 1 && !!errors?.category?.message}
                              helperText={
                                selectedCategories.length < 1 && errors?.category?.message
                              }
                              disabled={!isEdited}
                              items={categoryList}
                              onChange={onChange}
                              onItemClick={onCategoryChange}
                              onCreate={onCreateCategory}
                            />
                          );
                        }}
                      />
                      {selectedCategories?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="relative flex items-center h-[46px] px-[16px] py-[10px] bg-light-purple-2 rounded-xl z-0 w-auto">
                          {item}
                          <img
                            className={`absolute top-[-5px] right-[-5px] cursor-pointer ${
                              !isEdited ? 'hidden' : ''
                            }`}
                            src={CloseSolid}
                            onClick={() => {
                              const filteredItem = selectedCategories.filter(
                                (i: any) => i !== item,
                              );
                              setSelectedCategories(filteredItem);
                              void trigger('category'); // Trigger validation for category field
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-row">
                  <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-16">
                    {t('user.content-manager-detail-data.shortDescription')}
                  </Typography>
                  <TextArea
                    name="shortDesc"
                    labelTitle=""
                    value={contentDataDetailList?.shortDesc}
                    disabled={!isEdited}
                    placeholder={t('user.content-manager-detail-data.description') ?? ''}
                    containerStyle="rounded-3xl"
                    onChange={e => {
                      handleChange(e.target.name, e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="border border-primary my-10" />

            {renderFormList()}
            {isEdited && <Footer />}
          </form>
        )}
        {roles?.includes('CONTENT_MANAGER_REVIEW') ? (
          contentDataDetailList?.status === 'WAITING_REVIEW' ||
          contentDataDetailList?.status === 'DELETE_REVIEW' ? (
            <div className="flex flex-row justify-between">
              <div className="w-[30vh] mt-5">
                <CheckBox
                  defaultValue={isAlreadyReview}
                  updateFormValue={e => {
                    setIsAlreadyReview(e.value);
                    if (e.value) {
                      setShowModalReview(true);
                    }
                  }}
                  labelTitle={t('user.content-manager-detail-data.iAlreadyReview')}
                  updateType={''}
                />
              </div>
            </div>
          ) : null
        ) : null}
      </TitleCard>
    </React.Fragment>
  );
}
