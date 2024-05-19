/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import { t } from 'i18next';
import {
  useCreateContentDataMutation,
  useGetCategoryListQuery,
  useGetEligibleAutoApproveQuery,
} from '@/services/ContentManager/contentManagerApi';
import { useGetPostTypeDetailQuery } from '@/services/ContentType/contentTypeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { useForm, Controller } from 'react-hook-form';
import { openToast } from '@/components/atoms/Toast/slice';

import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';

import Plus from '@/assets/plus-purple.svg';
import CancelIcon from '@/assets/cancel.png';
import TableDelete from '@/assets/table-delete.svg';
import ModalForm from '@/components/molecules/ModalForm';
import PaperSubmit from '../../assets/paper-submit.png';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import {
  addNewDataInLoopingField,
  convertContentData,
  errorMessageTypeConverter,
  generateOrderData,
  stringifyContentData,
  transformText,
} from '@/utils/logicHelper';

export default function ContentManagerNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const [postTypeDetail, setPostTypeDetail] = useState<any>({
    id: null,
    name: '',
    postTypeGroup: '',
    slug: '',
    isUseCategory: '',
    total: null,
    attributeList: [],
  });
  const [orderList, setOrderList] = useState<any>([]);

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // AUTO APPROVE MODAL STATE
  const [showModalAutoApprove, setShowModalAutoApprove] = useState<boolean>(false);
  const [isAutoApprove, setIsAutoApprove] = useState<boolean>(false);

  const [contentTempData, setContentTempData] = useState<any[]>([]);
  // const [stringifyData, setStringifyData] = useState<any[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const handleFormChange = (
    id: string | number,
    value: any,
    fieldType?: string,
    isLooping: boolean = false,
    parentId: any = false,
  ) => {
    setContentTempData((prevFormValues: any[]) => {
      return prevFormValues.map(item => {
        if (item.id === id || item.id === parentId) {
          if (!isLooping) {
            if (fieldType === 'IMAGE') {
              if (typeof value === 'string') {
                try {
                  value = JSON.parse(value);
                } catch (e) {
                  console.error('Failed to parse value', e);
                }
              }
              if (!value || value.length === 0) {
                value = JSON.stringify([
                  {
                    imageUrl: 'no-image',
                    altText: 'no-image',
                  },
                ]);
              } else {
                value = JSON.stringify(value);
              }
            }
            return { ...item, value, fieldType };
          } else if (item.fieldType === 'LOOPING') {
            const updatedContentData = item.contentData.map((data: any) => {
              if (data.id === id) {
                if (fieldType === 'IMAGE' && (!value || value.length === 0)) {
                  value = [
                    {
                      imageUrl: 'no-image',
                      altText: 'no-image',
                    },
                  ];
                }
                return { ...data, value };
              } else if (data.contentData) {
                const updatedNestedContentData = data.contentData.map((nestedData: any) => {
                  if (nestedData.id === id) {
                    if (fieldType === 'IMAGE' && (!value || value.length === 0)) {
                      value = [
                        {
                          imageUrl: 'no-image',
                          altText: 'no-image',
                        },
                      ];
                    }
                    return { ...nestedData, value };
                  }
                  return nestedData;
                });
                return { ...data, contentData: updatedNestedContentData };
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

  const params = useParams();
  const [id] = useState<any>(Number(params.id));

  // TABLE PAGINATION STATE
  const [categoryList, setCategoryList] = useState<any>([]);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');

  const [loopingDupCount, setLoopingDupCount] = useState<number[]>([]);

  // RTK GET DATA
  const { data: postTypeDetailData } = useGetPostTypeDetailQuery({
    id,
    pageIndex: 0,
    limit: 100,
  });

  const { data: eligibleAutoApprove } = useGetEligibleAutoApproveQuery({
    actionType: 'create',
    dataType: 'content',
  });

  useEffect(() => {
    if (postTypeDetailData) {
      setPostTypeDetail(postTypeDetailData?.postTypeDetail);
    }
  }, [postTypeDetailData]);

  const { data: categoryListData } = useGetCategoryListQuery({
    postTypeId: id,
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });

  useEffect(() => {
    if (categoryListData) {
      const tempCategoryList = categoryListData?.categoryList?.categoryList.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setCategoryList(tempCategoryList);
    }
  }, [categoryListData]);

  // RTK POST DATA
  const [createContentData] = useCreateContentDataMutation();

  const onLeave = () => {
    setShowLeaveModal(false);
    goBack();
  };

  const saveDraft = () => {
    const value = getValues();
    setIsDraft(false);
    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: true,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? value.category : '',
      contentData: stringifyContentData(convertContentData(contentTempData)),
    };

    createContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.content-manager-new.draft-success'),
          }),
        );
        goBack();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.content-manager-new.draft-failed'),
            message: t(`errors.content-manager.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  function onSubmitData() {
    if (isDraft) {
      saveDraft();
    } else {
      if (eligibleAutoApprove?.isUserEligibleAutoApprove?.result) {
        setShowModalAutoApprove(true);
      } else {
        saveData();
      }
    }
  }

  const saveData = () => {
    const value = getValues();
    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: false,
      isAutoApprove,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? value.category : '',
      contentData: stringifyContentData(convertContentData(contentTempData)),
    };
    createContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success',
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed',
          }),
        );
      });
  };

  const addNewLoopingField = (loopingId: any) => {
    const [existingLoopingIndex, newLoopingField, newAttributeList] = addNewDataInLoopingField(
      postTypeDetail.attributeList,
      loopingId,
    );

    // Re render Form
    setPostTypeDetail((prevPostTypeDetail: { attributeList: any }) => ({
      ...prevPostTypeDetail,
      attributeList: newAttributeList,
    }));

    setLoopingDupCount(prevCount => ({
      ...prevCount,
      [postTypeDetail.attributeList[existingLoopingIndex as number].duplicateId || loopingId]:
        (prevCount[
          postTypeDetail.attributeList[existingLoopingIndex as number].duplicateId || loopingId
        ] || 0) + 1,
    }));

    // Update temporary data (used in saveData function)
    setContentTempData(prevContentTempData => [
      ...prevContentTempData,
      {
        ...newLoopingField,
        contentData: newLoopingField.attributeList.map((attribute: any) => ({
          id: attribute.id,
          value: '',
          duplicateId: attribute?.duplicateId ?? attribute.id,
          fieldType: attribute.fieldType,
        })),
      },
    ]);
    // }
  };

  useEffect(() => {
    const attributeList = postTypeDetail?.attributeList || [];
    if (attributeList.length > 0 && contentTempData.length === 0) {
      const defaultFormData = attributeList.map((attribute: any) => {
        if (attribute.fieldType === 'LOOPING' && attribute.attributeList) {
          return {
            id: attribute.id,
            value: 'temporary_value',
            fieldType: 'LOOPING',
            contentData: attribute.attributeList.map(
              (nestedAttribute: { id: any; fieldType: any }) => ({
                id: nestedAttribute.id,
                value: '',
                fieldType: nestedAttribute.fieldType,
              }),
            ),
          };
        } else {
          return {
            id: attribute.id,
            value: '',
            fieldType: attribute.fieldType,
          };
        }
      });
      setContentTempData(defaultFormData);
    }

    const order = generateOrderData(postTypeDetail?.attributeList);
    setOrderList(order);
  }, [postTypeDetail?.attributeList]);

  const deleteLoopingField = (id: any) => {
    // find delete id in postTypeDetail
    const postTypeLoopingIndex = postTypeDetail.attributeList.findIndex(
      (attribute: { id: any }) => attribute.id === id,
    );

    // find delete id in contentTempData
    const contentDataLoopingIndex = contentTempData.findIndex(
      (data: { id: any }) => data.id === id,
    );

    if (postTypeLoopingIndex !== -1) {
      const loopingToDelete = postTypeDetail.attributeList[postTypeLoopingIndex];

      // Mendapatkan duplicateId dari looping yang akan dihapus
      const duplicateId = loopingToDelete.duplicateId;

      // Hapus looping dari postTypeDetail.attributeList
      const updatedAttributeList = [...postTypeDetail.attributeList];
      updatedAttributeList.splice(postTypeLoopingIndex, 1);

      // Set state dengan atribut yang telah diperbarui
      setPostTypeDetail((prevPostTypeDetail: any) => ({
        ...prevPostTypeDetail,
        attributeList: updatedAttributeList,
      }));

      // Hapus hitungan dari loopingDupCount berdasarkan duplicateId
      if (loopingDupCount[duplicateId]) {
        const updatedLoopingDupCount = { ...loopingDupCount };
        updatedLoopingDupCount[duplicateId] -= 1;
        setLoopingDupCount(updatedLoopingDupCount);
      }

      // remove deleted id in current contentTempData
      setContentTempData(prevState => [
        ...prevState.slice(0, contentDataLoopingIndex),
        ...prevState.slice(contentDataLoopingIndex + 1),
      ]);
    }
  };

  const renderFormList = () => {
    // DEFAULT VALUE
    return postTypeDetail?.attributeList.map((props: any, _index: number) => {
      const { id, name, fieldType, attributeList, config, duplicateId } = props;
      const configs = JSON.parse(config);

      const loopingCount = loopingDupCount[id] || loopingDupCount[duplicateId] || 0;

      const aa = postTypeDetail?.attributeList.filter(
        (val: { duplicateId: any }) => val.duplicateId === duplicateId,
      );

      const showAddDataButton =
        loopingCount === 0 || (loopingCount > 0 && aa.slice(-1).pop().id === id);
      switch (fieldType) {
        case 'TEXT_FIELD':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue=""
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
              defaultValue=""
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
              defaultValue=""
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
                    type="email"
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
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
              defaultValue=""
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
                    isDocument={true}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                    editMode={true}
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
                    } else {
                      return 'All items must have imageUrl and altText'; // Validation failed
                    }
                  }
                },
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
                  <FormList.FileUploaderV2
                    {...field}
                    key={id}
                    id={id}
                    fieldTypeLabel={transformText(name)}
                    labelTitle={transformText(name)}
                    isDocument={false}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                    editMode={true}
                  />
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
              defaultValue={''}
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
              defaultValue=""
              rules={{
                required: `${name} is required`,
                pattern: {
                  value: /^[\d./-]+$/,
                  message: t('user.content-manager-new.invalid-number'),
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
              defaultValue=""
              rules={{
                required: `${name} is required`,
                pattern: {
                  value:
                    /^([-]|\b(https?:\/\/)?([-\w]+\.)+[-\w]+(-|\.\w{2,})(:\d+)?(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?\b)$/i,
                  message: t('user.content-manager-new.invalid-url'),
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
            <div className="flex flex-row mt-16">
              <div>
                <Typography
                  type="body"
                  size="m"
                  weight="bold"
                  className={`w-48 ml-1 mr-9 -mt-7 mb-2`}>
                  {t('user.content-manager-new.email-form')}
                </Typography>
                <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                  {name}
                </Typography>
              </div>
              <Controller
                key={id}
                name={id.toString()}
                control={control}
                defaultValue=""
                rules={{ required: `${name} is required` }}
                render={({ field }) => {
                  const onChange = useCallback(
                    (e: any) => {
                      handleFormChange(id, e.value, fieldType);
                      field.onChange({ target: { value: e.value } });
                    },
                    [id, field, handleFormChange],
                  );
                  return (
                    <FormList.EmailForm
                      {...field}
                      key={id}
                      fieldTypeLabel={transformText(name)}
                      placeholder=""
                      error={!!errors?.[id]?.message}
                      helperText={errors?.[id]?.message}
                      items={categoryList}
                      onChange={onChange}
                    />
                  );
                }}
              />
            </div>
          );
        case 'TAGS':
          return (
            <Controller
              key={id}
              name={id.toString()}
              control={control}
              defaultValue=""
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
                {transformText(name)}
              </Typography>
              <div className="card w-full shadow-md p-5">
                <div className="p-2 flex items-end justify-end">
                  <div className="px-4 py-2 bg-light-purple rounded-xl font-semibold text-bright-purple">
                    {orderList?.find((entry: { id: any }) => entry.id === id)?.order}
                  </div>
                  {orderList?.find((entry: { id: any }) => entry.id === id)?.order > 1 && (
                    <div className="tooltip ml-2" data-tip={t('action.delete')}>
                      <img
                        className={`cursor-pointer select-none flex items-center justify-center`}
                        src={TableDelete}
                        onClick={() => {
                          deleteLoopingField(id);
                        }}
                      />
                    </div>
                  )}
                </div>
                {attributeList?.map(
                  (val: { name: any; id: any; fieldType: any; config: any; duplicateId?: any }) => {
                    const configs = val?.config ? JSON.parse(val?.config) : {};

                    switch (val.fieldType) {
                      case 'TEXT_FIELD':
                        return (
                          <Controller
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{ required: `${val.name} is required` }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );

                              return (
                                <FormList.TextField
                                  {...field}
                                  key={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder=""
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'TEXT_AREA':
                        return (
                          <Controller
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{
                              required: { value: true, message: `${val.name} is required` },
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
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );
                              return (
                                <FormList.TextAreaField
                                  {...field}
                                  key={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder=""
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'EMAIL':
                        return (
                          <Controller
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{ required: `${val.name} is required` }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );

                              return (
                                <FormList.TextField
                                  {...field}
                                  key={val.id}
                                  type="email"
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder=""
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'DOCUMENT':
                        return (
                          <Controller
                            key={val.id}
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{
                              required: { value: true, message: `${val.name} is required` },
                            }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e, val.fieldType, true, id);
                                  field.onChange({ target: { value: e } });
                                },
                                [id, fieldType, field, handleFormChange],
                              );
                              return (
                                <FormList.FileUploaderV2
                                  {...field}
                                  key={val.id}
                                  id={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  isDocument={true}
                                  multiple={configs?.media_type === 'multiple_media'}
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                  editMode={true}
                                />
                              );
                            }}
                          />
                        );
                      case 'IMAGE':
                        return (
                          <Controller
                            key={val.id}
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{
                              required: { value: true, message: `${val.name} is required` },
                            }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e, val.fieldType, true, id);
                                  field.onChange({ target: { value: e } });
                                },
                                [id, fieldType, field, handleFormChange],
                              );
                              return (
                                <FormList.FileUploaderV2
                                  {...field}
                                  key={val.id}
                                  id={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  isDocument={false}
                                  multiple={configs?.media_type === 'multiple_media'}
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                  editMode={true}
                                />
                              );
                            }}
                          />
                        );
                      case 'TEXT_EDITOR':
                        return (
                          <Controller
                            key={val.id}
                            name={val.id.toString()}
                            control={control}
                            defaultValue={''}
                            rules={{
                              required: { value: true, message: `${name} is required` },
                            }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e, val.fieldType, true, id);
                                  field.onChange({ target: { value: e } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );

                              return (
                                <FormList.TextEditor
                                  {...field}
                                  title={val.name}
                                  value={field.value}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'PHONE_NUMBER':
                        return (
                          <Controller
                            key={val.id}
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{
                              required: `${val.name} is required`,
                              pattern: {
                                value: /^[\d./-]+$/,
                                message: t('user.content-manager-new.invalid-number'),
                              },
                            }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [id, fieldType, field, handleFormChange],
                              );
                              return (
                                <FormList.TextField
                                  {...field}
                                  key={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder=""
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'YOUTUBE_URL':
                        return (
                          <Controller
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            rules={{
                              required: `${val.name} is required`,
                              pattern: {
                                value:
                                  /^([-]|\b(https?:\/\/)?([-\w]+\.)+[-\w]+(-|\.\w{2,})(:\d+)?(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?\b)$/i,
                                message: t('user.content-manager-new.invalid-url'),
                              },
                            }}
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );
                              return (
                                <FormList.TextField
                                  {...field}
                                  key={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder=""
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      case 'EMAIL_FORM':
                        return (
                          <div className="flex flex-row mt-16">
                            <div>
                              <Typography
                                type="body"
                                size="m"
                                weight="bold"
                                className={`w-48 ml-1 mr-9 -mt-7 mb-2`}>
                                {t('user.content-manager-new.email-form')}
                              </Typography>
                              <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                                {val.name}
                              </Typography>
                            </div>
                            <Controller
                              key={val.id}
                              name={val.id.toString()}
                              control={control}
                              defaultValue=""
                              rules={{ required: `${val.name} is required` }}
                              render={({ field }) => {
                                const onChange = useCallback(
                                  (e: any) => {
                                    handleFormChange(val.id, e.value, val.fieldType, true, id);
                                    field.onChange({ target: { value: e.value } });
                                  },
                                  [val.id, val.fieldType, handleFormChange],
                                );
                                return (
                                  <FormList.EmailForm
                                    {...field}
                                    key={val.id}
                                    fieldTypeLabel={transformText(val.name)}
                                    placeholder=""
                                    error={!!errors?.[val.id]?.message}
                                    helperText={errors?.[val.id]?.message}
                                    items={categoryList}
                                    onChange={onChange}
                                  />
                                );
                              }}
                            />
                          </div>
                        );
                      case 'TAGS':
                        return (
                          <Controller
                            name={val.id.toString()}
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                              const onChange = useCallback(
                                (e: any) => {
                                  handleFormChange(val.id, e.target.value, val.fieldType, true, id);
                                  field.onChange({ target: { value: e.target.value } });
                                },
                                [val.id, val.fieldType, field, handleFormChange],
                              );

                              return (
                                <FormList.TextField
                                  {...field}
                                  key={val.id}
                                  fieldTypeLabel={transformText(val.name)}
                                  labelTitle={transformText(val.name)}
                                  placeholder={t('user.content-manager-new.tags-placeholder')}
                                  error={!!errors?.[val.id]?.message}
                                  helperText={errors?.[val.id]?.message}
                                  onChange={onChange}
                                />
                              );
                            }}
                          />
                        );
                      default:
                        return <p>err</p>;
                    }
                  },
                )}
              </div>
              {showAddDataButton && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      addNewLoopingField(id);
                    }}
                    className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                    <img src={Plus} className="mr-3" />
                    {t('user.content-manager-new.add-data')}
                  </button>
                </div>
              )}
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
            {t('user.content-manager-new.cancel')}
          </button>
          <button
            onClick={() => {
              setIsDraft(true);
            }}
            type="submit"
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            {t('user.content-manager-new.save-as-draft')}
          </button>
          <button type="submit" className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            {t('user.content-manager-new.submit')}
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <TitleCard title={`New ${postTypeDetail?.name ?? ''}`} border={true}>
      {/* ON CANCEL */}
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
          <p className="font-bold mt-3 text-xl">{t('user.content-manager-new.autoApproveTitle')}</p>
          <p className="font-base mt-2 text-xl text-center">
            {t('user.content-manager-new.autoApproveSubtitle', { title: getValues().title })}
          </p>
          <CheckBox
            defaultValue={isAutoApprove}
            updateFormValue={e => {
              setIsAutoApprove(e.value);
            }}
            labelTitle={t('user.content-manager-new.autoApproveLabel')}
            labelStyle="text-xl mt-2"
          />
        </div>
      </ModalForm>
      <form onSubmit={handleSubmit(onSubmitData)}>
        <div className="ml-2 mt-6">
          {/* DEFAULT FORM */}
          <div className="grid grid-cols-1 gap-5">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: t('user.content-manager-new.title-required') ?? '' }}
              render={({ field }) => (
                <FormList.TextField
                  {...field}
                  key="title"
                  labelTitle={t('user.content-manager-new.title')}
                  placeholder={t('user.content-manager-new.title')}
                  error={!!errors?.title?.message}
                  helperText={errors?.title?.message}
                  border={false}
                />
              )}
            />
            {postTypeDetail?.isUseCategory && (
              <div className="flex flex-row">
                <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                  {t('user.content-manager-new.category')}
                </Typography>
                <Controller
                  name="category"
                  control={control}
                  defaultValue=""
                  rules={{ required: t('user.content-manager-new.category-required') ?? '' }}
                  render={({ field }) => {
                    const onChange = useCallback(
                      (e: any) => {
                        handleFormChange('categoryName', e);
                        field.onChange({ target: { value: e } });
                      },
                      [id, field, handleFormChange],
                    );
                    return (
                      <FormList.TextInputDropDown
                        {...field}
                        key="category"
                        labelTitle={t('user.content-manager-new.category')}
                        placeholder={t('user.content-manager-new.title')}
                        error={!!errors?.category?.message}
                        helperText={errors?.category?.message}
                        items={categoryList}
                        onChange={onChange}
                      />
                    );
                  }}
                />
              </div>
            )}
            <Controller
              name="shortDesc"
              control={control}
              defaultValue=""
              rules={{ required: t('user.content-manager-new.field-required') ?? '' }}
              render={({ field }) => (
                <FormList.TextAreaField
                  {...field}
                  key="shortDesc"
                  labelTitle={t('user.content-manager-new.short-description') ?? ''}
                  placeholder={t('user.content-manager-new.short-placeholder')}
                  error={!!errors?.shortDesc?.message}
                  helperText={errors?.shortDesc?.message}
                  border={false}
                />
              )}
            />
          </div>
        </div>

        <div className="border border-primary my-10" />

        {/* DYNAMIC FORM */}
        {renderFormList()}
        <Footer />
      </form>
    </TitleCard>
  );
}
