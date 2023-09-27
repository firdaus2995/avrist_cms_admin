import { useEffect, useState, useCallback } from 'react';
import { t } from 'i18next';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import {
  useGetPostTypeDetailQuery,
  useCreateContentDataMutation,
} from '@/services/ContentType/contentTypeApi';
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
    trigger,
  } = useForm();

  // LEAVE MODAL STATE
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  const [contentTempData, setContentTempData] = useState<any[]>([]);

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
            return { ...item, value, fieldType };
          } else if (item.fieldType === 'LOOPING') {
            const updatedContentData = item.contentData.map((data: any) => {
              if (data.id === id) {
                return { ...data, value };
              } else if (data.contentData) {
                const updatedNestedContentData = data.contentData.map((nestedData: any) => {
                  if (nestedData.id === id) {
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
  const fetchGetPostTypeDetail = useGetPostTypeDetailQuery({
    id,
    pageIndex: 0,
    limit: 100,
  });
  const { data: postTypeDetailData } = fetchGetPostTypeDetail;

  useEffect(() => {
    if (postTypeDetailData) {
      setPostTypeDetail(postTypeDetailData?.postTypeDetail);
    }
  }, [postTypeDetailData]);

  const fetchGetCategoryList = useGetCategoryListQuery({
    postTypeId: id,
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data: categoryListData } = fetchGetCategoryList;

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

  useEffect(() => {
    const refetch = async () => {
      await fetchGetCategoryList.refetch();
    };
    void refetch();
  }, []);

  // RTK POST DATA
  const [createContentData] = useCreateContentDataMutation();

  const convertContentData = (data: any[]) => {
    const combinedData: any[] = [];

    data.forEach((item: { duplicateId: any; contentData: any[] }) => {
      if (item.duplicateId) {
        const existingItem = combinedData.find(
          combinedItem => combinedItem.id === item.duplicateId,
        );

        if (existingItem) {
          item.contentData.forEach((contentItem: { fieldType: any; value: any[] }) => {
            const existingContentItem = existingItem.contentData.find(
              (existingContent: { fieldType: any }) =>
                existingContent.fieldType === contentItem.fieldType,
            );

            if (existingContentItem) {
              if (!Array.isArray(existingContentItem.value)) {
                existingContentItem.value = [existingContentItem.value];
              }
              if (!Array.isArray(contentItem.value)) {
                contentItem.value = [contentItem.value];
              }
              existingContentItem.value.push(...contentItem.value);
            }
          });
        } else {
          const newItem = { ...item };
          newItem.contentData = newItem.contentData.map((contentItem: { value: any }) => ({
            ...contentItem,
            value: Array.isArray(contentItem.value) ? [...contentItem.value] : [contentItem.value],
          }));
          combinedData.push(newItem);
        }
      } else {
        combinedData.push(item);
      }
    });

    return combinedData;
  };

  function convertLoopingToArrays(data: any) {
    return data.map((field: any) => {
      if (field.fieldType === 'LOOPING' && field.contentData) {
        const contentDataValue = field.contentData[0]?.value;
        if (contentDataValue) {
          field.contentData[0].value = Array.isArray(contentDataValue)
            ? JSON.stringify(contentDataValue)
            : JSON.stringify([contentDataValue]);
        }
      }
      return field;
    });
  }

  function onSubmitData(value: any) {
    const convertedData = convertContentData(contentTempData);
    const stringifyData = convertLoopingToArrays(convertedData);
    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: false,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? value.category : '',
      contentData: stringifyData,
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
  }

  const addNewLoopingField = (loopingId: any) => {
    const existingLoopingIndex: number = postTypeDetail.attributeList.findIndex(
      (attribute: { id: string }) => attribute.id === loopingId,
    );

    if (existingLoopingIndex !== -1) {
      const newLoopingField = {
        ...postTypeDetail.attributeList[existingLoopingIndex],
        id: Math.floor(Math.random() * 100),
        duplicateId: postTypeDetail.attributeList[existingLoopingIndex].duplicateId || loopingId,
        name: `${postTypeDetail.attributeList[existingLoopingIndex].name}`,
        attributeList: postTypeDetail.attributeList[existingLoopingIndex].attributeList.map(
          (attribute: any) => ({
            ...attribute,
            id: Math.floor(Math.random() * 100),
            parentId: loopingId,
            value: '', // Initialize value to empty
          }),
        ),
      };

      const newAttributeList = [...postTypeDetail.attributeList];
      newAttributeList.splice(existingLoopingIndex + 1, 0, newLoopingField);

      setPostTypeDetail((prevPostTypeDetail: { attributeList: any }) => ({
        ...prevPostTypeDetail,
        attributeList: newAttributeList,
      }));

      setLoopingDupCount(prevCount => ({
        ...prevCount,
        [postTypeDetail.attributeList[existingLoopingIndex].duplicateId || loopingId]:
          (prevCount[postTypeDetail.attributeList[existingLoopingIndex].duplicateId || loopingId] ||
            0) + 1,
      }));

      setContentTempData(prevContentTempData => [
        ...prevContentTempData,
        {
          ...newLoopingField,
          contentData: newLoopingField.attributeList.map((attribute: any) => ({
            id: attribute.id,
            value: '',
            fieldType: attribute.fieldType,
          })),
        },
      ]);
    }
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

  function generateOrderData(inputData: any[]) {
    // Filter hanya LOOPING yang memiliki duplicateId
    const loopingDataWithDuplicate = inputData.filter(
      (item: { fieldType: string; duplicateId: any }) =>
        item.fieldType === 'LOOPING' && item.duplicateId,
    );

    // Inisialisasi orderData
    const orderData: Array<{ id: any; order: any }> = [];

    // Membuat map untuk melacak urutan berdasarkan duplicateId
    const orderMap = new Map();

    // Mengisi orderMap dengan urutan berdasarkan duplicateId
    loopingDataWithDuplicate.forEach((loopingItem: { duplicateId: any; id: any }) => {
      const duplicateId = loopingItem.duplicateId;
      if (duplicateId !== null) {
        if (!orderMap.has(duplicateId)) {
          orderMap.set(duplicateId, 2); // Mengatur urutan awal
        }
        const order = orderMap.get(duplicateId);
        orderData.push({
          id: loopingItem.id,
          order,
        });
        // Increment urutan untuk duplicateId selanjutnya
        orderMap.set(duplicateId, (order as number) + 1);
      }
    });

    // Menambahkan orderData untuk LOOPING yang tidak memiliki duplicateId (order 1)
    const loopingDataWithoutDuplicate = inputData.filter(
      (item: { fieldType: string; duplicateId: any }) =>
        item.fieldType === 'LOOPING' && !item.duplicateId,
    );
    loopingDataWithoutDuplicate.forEach((loopingItem: { id: any }) => {
      orderData.push({
        id: loopingItem.id,
        order: 1, // Urutan 1
      });
    });

    // Mengembalikan orderData yang telah diurutkan
    return orderData.sort((a, b) => a.order - b.order);
  }

  const onLeave = () => {
    setShowLeaveModal(false);
    goBack();
  };

  const saveDraft = (e: any) => {
    e.preventDefault();
    const value = getValues();

    const convertedData = convertContentData(contentTempData);
    const stringifyData = convertLoopingToArrays(convertedData);
    void trigger();

    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: true,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? value.category : '',
      contentData: stringifyData,
    };
    createContentData(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: 'Success as draft',
          }),
        );
        goBack();
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: 'Failed save as draft',
          }),
        );
      });
  };

  const deleteLoopingField = (id: any) => {
    const existingLoopingIndex = postTypeDetail.attributeList.findIndex(
      (attribute: { id: any }) => attribute.id === id,
    );

    if (existingLoopingIndex !== -1) {
      const loopingToDelete = postTypeDetail.attributeList[existingLoopingIndex];

      // Mendapatkan duplicateId dari looping yang akan dihapus
      const duplicateId = loopingToDelete.duplicateId;

      // Hapus looping dari postTypeDetail.attributeList
      const updatedAttributeList = [...postTypeDetail.attributeList];
      updatedAttributeList.splice(existingLoopingIndex, 1);

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
    }
  };

  const renderFormList = () => {
    // DEFAULT VALUE
    return postTypeDetail?.attributeList.map((props: any, index: number) => {
      const { id, name, fieldType, attributeList, config, duplicateId } = props;
      const configs = JSON.parse(config);

      const loopingCount = loopingDupCount[id] || loopingDupCount[duplicateId] || 0;

      const aa = postTypeDetail?.attributeList.filter((val: { duplicateId: any; }) => val.duplicateId === duplicateId);

      const showAddDataButton = loopingCount === 0 || loopingCount > 0 && aa.slice(-1).pop().id === id;
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
                  value: configs?.max_length,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length,
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
                    fieldTypeLabel="TEXT_FIELD"
                    labelTitle={name}
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
                  value: configs?.max_length,
                  message: `${configs?.max_length} characters maximum`,
                },
                minLength: {
                  value: configs?.min_length,
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
                    fieldTypeLabel="TEXT_AREA"
                    labelTitle={name}
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
                    fieldTypeLabel="EMAIL"
                    labelTitle={name}
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
                    fieldTypeLabel="DOCUMENT"
                    labelTitle={name}
                    isDocument={true}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
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
                    fieldTypeLabel="IMAGE"
                    labelTitle={name}
                    isDocument={false}
                    multiple={configs?.media_type === 'multiple_media'}
                    error={!!errors?.[id]?.message}
                    helperText={errors?.[id]?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          );
        case 'TEXT_EDITOR':
          return <FormList.TextEditor key={id} name={name} />;
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
                  value: /^[0-9\- ]{8,14}$/,
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
                    fieldTypeLabel="PHONE_NUMBER"
                    labelTitle={name}
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
                    /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
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
                    fieldTypeLabel="YOUTUBE_URL"
                    labelTitle={name}
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
                  EMAIL_FORM
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
                      fieldTypeLabel="EMAIL_FORM"
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
        case 'LOOPING':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 my-5 ml-1 mr-9">
                {name}
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
                {attributeList?.map((val: { name: any; id: any; fieldType: any; config: any }) => {
                  const configs = JSON.parse(val?.config);

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
                                fieldTypeLabel="TEXT_FIELD"
                                labelTitle={val.name}
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
                              value: configs?.max_length,
                              message: `${configs?.max_length} characters maximum`,
                            },
                            minLength: {
                              value: configs?.min_length,
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
                                fieldTypeLabel="TEXT_AREA"
                                labelTitle={val.name}
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
                                fieldTypeLabel="EMAIL"
                                labelTitle={val.name}
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
                                fieldTypeLabel="DOCUMENT"
                                labelTitle={val.name}
                                isDocument={true}
                                multiple={configs?.media_type === 'multiple_media'}
                                error={!!errors?.[val.id]?.message}
                                helperText={errors?.[val.id]?.message}
                                onChange={onChange}
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
                                fieldTypeLabel="IMAGE"
                                labelTitle={val.name}
                                isDocument={false}
                                multiple={configs?.media_type === 'multiple_media'}
                                error={!!errors?.[val.id]?.message}
                                helperText={errors?.[val.id]?.message}
                                onChange={onChange}
                              />
                            );
                          }}
                        />
                      );
                    case 'TEXT_EDITOR':
                      return <FormList.TextEditor key={val.id} name={val.name} />;
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
                              value: /^[0-9\- ]{8,14}$/,
                              message: 'Invalid number',
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
                                fieldTypeLabel="PHONE_NUMBER"
                                labelTitle={val.name}
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
                                /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
                              message: 'Invalid URL',
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
                                fieldTypeLabel="YOUTUBE_URL"
                                labelTitle={val.name}
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
                              EMAIL_FORM
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
                                  fieldTypeLabel="EMAIL_FORM"
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
                    default:
                      return <p>err</p>;
                  }
                })}
              </div>
              {showAddDataButton && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      addNewLoopingField(id);
                    }}
                    className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                    <img src={Plus} className="mr-3" />
                    Add Data
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
            Cancel
          </button>
          <button
            onClick={saveDraft}
            className="btn btn-outline border-secondary-warning text-xs text-secondary-warning btn-sm w-28 h-10">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
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
        cancelTitle="No"
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle="Yes"
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form onSubmit={handleSubmit(onSubmitData)}>
        <div className="ml-2 mt-6">
          {/* DEFAULT FORM */}
          <div className="grid grid-cols-1 gap-5">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <FormList.TextField
                  {...field}
                  key="title"
                  labelTitle="Title"
                  placeholder="Title"
                  error={!!errors?.title?.message}
                  helperText={errors?.title?.message}
                  border={false}
                />
              )}
            />
            {postTypeDetail?.isUseCategory && (
              <div className="flex flex-row">
                <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                  Category
                </Typography>
                <Controller
                  name="category"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Category is required' }}
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
                        labelTitle="Category"
                        placeholder="Title"
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
              rules={{ required: 'Field is required' }}
              render={({ field }) => (
                <FormList.TextAreaField
                  {...field}
                  key="shortDesc"
                  labelTitle="Short Description"
                  placeholder="Enter Short Description"
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
