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
import FormList from './components/FormList';

import Plus from '@/assets/plus-purple.svg';

import { useForm, Controller } from 'react-hook-form';

export default function ContentManagerNew() {
  const dispatch = useAppDispatch();
  const [isAddLooping, setIsAddLooping] = useState(false);
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

  const [mainForm, setMainForm] = useState<any>({
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
  ) => {
    setContentTempData((prevFormValues: any[]) => {
      const existingIndex = prevFormValues.findIndex(
        (item: { id: string | number }) => item.id === id,
      );

      const mainForm = id && value && !fieldType && !isLooping;
      if (mainForm) {
        setMainForm((prevFormValues: any) => ({
          ...prevFormValues,
          [id]: value,
        }));
      }

      if (existingIndex !== -1 && !isLooping) {
        const updatedFormValues = [...prevFormValues];
        updatedFormValues[existingIndex] = { id, value, fieldType };
        return updatedFormValues;
      }

      if (isLooping) {
        const loopingDataIndex = prevFormValues.findIndex(item => item.fieldType === 'LOOPING');
        if (loopingDataIndex !== -1) {
          const loopingData = { ...prevFormValues[loopingDataIndex] };
          const contentData = loopingData.contentData || [];

          const contentDataIndex = contentData.findIndex((data: { id: any }) => data.id === id);

          if (contentDataIndex !== -1) {
            const updatedContentData = [...contentData];
            // Update value as an array of values
            updatedContentData[contentDataIndex] = {
              ...updatedContentData[contentDataIndex],
              value: Array.isArray(value) ? value : [value],
            };
            loopingData.contentData = updatedContentData;
            const updatedFormValues = [...prevFormValues];
            updatedFormValues[loopingDataIndex] = loopingData;
            return updatedFormValues;
          } else {
            // Add new looping data
            const newLoopingData = {
              id,
              value: Array.isArray(value) ? value : [value],
              fieldType,
            };
            loopingData.contentData.push(newLoopingData);
            const updatedFormValues = [...prevFormValues];
            updatedFormValues[loopingDataIndex] = loopingData;
            return updatedFormValues;
          }
        }
      }

      return [...prevFormValues, { id, value, fieldType }];
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

  const convertData = (contentTempData: any[]) => {
    const convertedData = contentTempData.map(
      (item: { fieldType: string; contentData: any[]; value: any[] }) => {
        if (item.fieldType === 'LOOPING') {
          const contentData = item.contentData.map((data: { value: any[] }) => ({
            ...data,
            value: data.value.length > 0 ? data.value.join(', ') : '',
          }));
          return { ...item, contentData };
        } else if (Array.isArray(item.value)) {
          return { ...item, value: item.value.join(', ') };
        }
        return item;
      },
    );

    return convertedData;
  };

  const transformedData = contentTempData.map(item => {
    if (item.fieldType === 'LOOPING' && item.contentData) {
      const groupedContentData = item.contentData.reduce(
        (
          grouped: Record<string, any[]>,
          contentItem: { fieldType: string | number; value: any },
        ) => {
          if (!grouped[contentItem.fieldType]) {
            grouped[contentItem.fieldType] = [];
          }
          grouped[contentItem.fieldType].push(...contentItem.value);
          return grouped;
        },
        {},
      );

      const newContentData = Object.entries(groupedContentData).map(
        ([fieldType, values], index) => {
          return {
            id: item.contentData[index].id, // Use the original id from contentData
            value: values,
            fieldType,
          };
        },
      );

      return {
        ...item,
        contentData: newContentData,
      };
    }
    return item;
  });

  function onSubmitData(value: any) {
    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: false,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? mainForm.categoryName : '',
      contentData: isAddLooping ? transformedData : convertData(contentTempData),
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

  const addNewLoopingField = () => {
    // Find the existing looping field
    const existingLoopingField = postTypeDetail.attributeList.find(
      (attribute: { fieldType: string }) => attribute.fieldType === 'LOOPING',
    );

    if (existingLoopingField) {
      // Create a new looping field based on the existing one
      const newLoopingField = {
        id: Math.floor(Math.random() * 100000), // Generate a random ID
        name: 'Looping',
        fieldType: 'LOOPING',
        fieldId: 'looping',
        config: null,
        parentId: null,
        attributeList: existingLoopingField.attributeList.map((item: any) => ({
          ...item,
          id: Math.floor(Math.random() * 100000),
        })),
      };

      // Add the new looping field to attributeList
      setPostTypeDetail((prevPostTypeDetail: { attributeList: any }) => ({
        ...prevPostTypeDetail,
        attributeList: [...prevPostTypeDetail.attributeList, newLoopingField],
      }));
    }
  };

  const renderFormList = () => {
    // DEFAULT VALUE
    const attributeList = postTypeDetail?.attributeList || [];
    if (contentTempData.length === 0 && attributeList.length > 0) {
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

    return postTypeDetail?.attributeList.map((props: any) => {
      const { id, name, fieldType, attributeList, config } = props;
      const configs = JSON.parse(config);
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
                {attributeList?.map(({ id, name, fieldType }: any) => {
                  switch (fieldType) {
                    case 'EMAIL':
                    case 'DOCUMENT':
                    case 'IMAGE':
                    case 'TEXT_AREA':
                    case 'TEXT_EDITOR':
                    case 'PHONE_NUMBER':
                    case 'TEXT_FIELD':
                      return (
                        <Controller
                          name={id.toString()}
                          control={control}
                          defaultValue=""
                          rules={{ required: `${name} is required` }}
                          render={({ field }) => {
                            const onChange = useCallback(
                              (e: any) => {
                                handleFormChange(id, e.target.value, fieldType, true);
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
                    case 'YOUTUBE_URL':
                      return (
                        <Controller
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
                                handleFormChange(id, e.target.value, fieldType, true);
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
                    default:
                      return <p>err</p>;
                  }
                })}
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
                <Typography type="body" size="m" weight="bold" className="w-48 ml-1 mr-9">
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
                        field.onChange({ target: { value: e} });
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
        {postTypeDetail?.attributeList?.filter(
          (item: { fieldType: string }) => item.fieldType === 'LOOPING',
        )?.length > 0 ? (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => {
                addNewLoopingField();
                setIsAddLooping(true);
              }}
              className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
              <img src={Plus} className="mr-3" />
              Add Data
            </button>
          </div>
        ) : null}
        <Footer />
      </form>
    </TitleCard>
  );
}
