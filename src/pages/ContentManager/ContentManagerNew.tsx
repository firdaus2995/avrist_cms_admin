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
import DropDown from '@/components/molecules/DropDown';
import FormList from './components/FormList';

import Plus from '@/assets/plus-purple.svg';

import { useForm, Controller } from 'react-hook-form';

export default function ContentManagerNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const [postTypeDetail, setPostTypeDetail] = useState({
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
  const handleChange = (id: string | number, value: any) => {
    setMainForm((prevFormValues: any) => ({
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
  const handleFormChange = (
    id: string | number,
    value: any,
    fieldType: string,
    isLooping: boolean = false,
  ) => {
    setContentTempData((prevFormValues: any[]) => {
      const existingIndex = prevFormValues.findIndex(
        (item: { id: string | number }) => item.id === id,
      );

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
            updatedContentData[contentDataIndex] = {
              ...updatedContentData[contentDataIndex],
              value,
            };
            loopingData.contentData = updatedContentData;
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

  function onSubmitData(value: any) {
    const payload = {
      title: value.title,
      shortDesc: value.shortDesc,
      isDraft: false,
      postTypeId: id,
      categoryName: postTypeDetail?.isUseCategory ? mainForm.categoryName : '',
      contentData: contentTempData,
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

  const handleFilesChange = (id: string, files: any, fieldType: string) => {
    const base64Array = files.map((file: { base64: any }) => file.base64);
    handleFormChange(id, base64Array[0], fieldType);
  };

  const renderFormList = () => {
    // DEFAULT VALUE
    const attributeList = postTypeDetail?.attributeList || [];
    if (contentTempData.length === 0 && attributeList.length > 0) {
      const defaultFormData = attributeList.map((attribute: any) => {
        if (attribute.fieldType === 'LOOPING' && attribute.attributeList) {
          return {
            id: attribute.id,
            value: '',
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

    return postTypeDetail?.attributeList.map(({ id, name, fieldType, attributeList }: any) => {
      switch (fieldType) {
        case 'EMAIL':
          return (
            <Controller
              name={id.toString()}
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: `${name} is required` },
                // maxLength: { value: 5, message: 'Too many characters' },
                // minLength: { value: 5, message: 'Less characters' },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, field.value, fieldType);
                    field.onChange(e);
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
        case 'IMAGE':
          return (
            <FormList.FileUploader
              key={id}
              name={name}
              fieldType={fieldType}
              multiple={true}
              onFilesChange={e => {
                handleFilesChange(id, e, fieldType);
              }}
            />
          );
        case 'TEXT_AREA':
          return (
            <Controller
              name={id.toString()}
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: `${name} is required` },
                // maxLength: { value: 5, message: 'Too many characters' },
                // minLength: { value: 5, message: 'Less characters' },
              }}
              render={({ field }) => {
                const onChange = useCallback(
                  (e: any) => {
                    handleFormChange(id, field.value, fieldType);
                    field.onChange(e);
                  },
                  [id, fieldType, field, handleFormChange],
                );
                return (
                  <FormList.TextAreaField
                    {...field}
                    key={id}
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
        case 'TEXT_EDITOR':
          return <FormList.TextEditor key={id} name={name} />;
        case 'PHONE_NUMBER':
          return (
            <Controller
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
                    handleFormChange(id, field.value, fieldType);
                    field.onChange(e);
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
                    handleFormChange(id, field.value, fieldType);
                    field.onChange(e);
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
              render={({ field }) => (
                <FormList.TextField
                  {...field}
                  key={id}
                  fieldTypeLabel="YOUTUBE_URL"
                  labelTitle={name}
                  placeholder=""
                  error={!!errors?.[id]?.message}
                  helperText={errors?.[id]?.message}
                  onChange={(e: any) => {
                    handleFormChange(id, field.value, fieldType);
                    field.onChange(e);
                  }}
                />
              )}
            />
          );
        case 'LOOPING':
          return (
            <div key={id} className="">
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
                          render={({ field }) => (
                            <FormList.TextField
                              {...field}
                              key={id}
                              fieldTypeLabel="TEXT_FIELD"
                              labelTitle={name}
                              placeholder=""
                              error={!!errors?.[id]?.message}
                              helperText={errors?.[id]?.message}
                              onChange={(e: any) => {
                                handleFormChange(id, field.value, fieldType, true);
                                field.onChange(e);
                              }}
                            />
                          )}
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
                          render={({ field }) => (
                            <FormList.TextField
                              {...field}
                              key={id}
                              fieldTypeLabel="YOUTUBE_URL"
                              labelTitle={name}
                              placeholder=""
                              error={!!errors?.[id]?.message}
                              helperText={errors?.[id]?.message}
                              onChange={(e: any) => {
                                handleFormChange(id, field.value, fieldType);
                                field.onChange(e);
                              }}
                            />
                          )}
                        />
                      );
                    default:
                      return <p>err</p>;
                  }
                })}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => {}}
                  className="btn btn-outline border-primary text-primary text-xs btn-sm w-48 h-10">
                  <img src={Plus} className="mr-3" />
                  Add Data
                </button>
              </div>
              <div className="border my-10" />
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
                  onChange={(e: any) => {
                    field.onChange(e);
                    handleChange('title', field.value);
                  }}
                />
              )}
            />
            {postTypeDetail?.isUseCategory && (
              <div className="flex flex-row items-center">
                <Typography type="body" size="m" weight="bold" className="w-48 ml-1 mr-9">
                  Category
                </Typography>
                <DropDown
                  labelStyle="font-bold text-base"
                  defaultValue="item1"
                  items={categoryList}
                  onSelect={(_e, val) => {
                    handleChange('categoryName', val);
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
                  onChange={(e: any) => {
                    handleChange('shortDesc', e.target.value);
                    field.onChange(e);
                  }}
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
