import { useEffect, useState, useCallback } from 'react';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import {
  useGetPostTypeDetailQuery,
  useCreateContentDataMutation,
} from '@/services/ContentType/contentTypeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';

import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
// import DropDown from '@/components/molecules/DropDown';
import FormList from '@/components/molecules/FormList';

import Plus from '@/assets/plus-purple.svg';

import { useForm, Controller } from 'react-hook-form';

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

  const [mainForm] = useState<any>({
    title: '',
    shortDesc: '',
    categoryName: '',
  });

  // FORM VALIDATION
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
  const [postTypeId] = useState(1);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(5);
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
    postTypeId,
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
      categoryName: postTypeDetail?.isUseCategory ? mainForm.categoryName : '',
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
        [loopingId]: (prevCount[loopingId] || 0) + 1,
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
  }, [postTypeDetail?.attributeList]);

  const renderFormList = () => {
    // DEFAULT VALUE

    return postTypeDetail?.attributeList.map((props: any, index: number) => {
      const { id, name, fieldType, attributeList, config } = props;
      const configs = JSON.parse(config);

      const loopingCount = loopingDupCount[id] || 0;
      const showAddDataButton =
        loopingCount === 0 ||
        (loopingCount > 0 && index === postTypeDetail.attributeList.length - 1);
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
        case 'LOOPING':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 my-5 ml-1 mr-9">
                {name}
              </Typography>
              <div className="card w-full shadow-md p-5">
                {attributeList?.map((val: { name: any; id: any; fieldType: any }) => {
                  switch (val.fieldType) {
                    case 'EMAIL':
                    case 'DOCUMENT':
                    case 'IMAGE':
                    case 'TEXT_AREA':
                    case 'TEXT_EDITOR':
                    case 'PHONE_NUMBER':
                    case 'TEXT_FIELD':
                      return (
                        <Controller
                          name={val.id.toString()}
                          control={control}
                          defaultValue=""
                          rules={{ required: `${name} is required` }}
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
                    default:
                      return <p>err</p>;
                  }
                })}
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
          <button onClick={() => {}} className="btn btn-outline text-xs btn-sm w-28 h-10">
            Cancel
          </button>
          <button
            onClick={() => {}}
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
