import { useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import DropDown from '@/components/molecules/DropDown';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import {
  useGetPostTypeDetailQuery,
  useCreateContentDataMutation,
} from '@/services/ContentType/contentTypeApi';
import { useNavigate, useParams } from 'react-router-dom';
import FormList from './components/FormList';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import Plus from '@/assets/plus-purple.svg';

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

  const [contentTempData, setContentTempData] = useState<any[]>([]);
  const handleFormChange = (id: string | number, value: any, fieldType: string) => {
    setContentTempData((prevFormValues: any[]) => {
      const existingIndex = prevFormValues.findIndex(
        (item: { id: string | number }) => item.id === id,
      );

      if (existingIndex !== -1) {
        const updatedFormValues = [...prevFormValues];
        updatedFormValues[existingIndex] = { id, value, fieldType };
        return updatedFormValues;
      } else {
        return [...prevFormValues, { id, value, fieldType }];
      }
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
      console.log(postTypeDetailData?.postTypeDetail);
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
  const payload = {
    title: mainForm.title,
    shortDesc: mainForm.shortDesc,
    isDraft: false,
    postTypeId: id,
    categoryName: postTypeDetail?.isUseCategory ? mainForm.categoryName : '',
    contentData: contentTempData,
  };

  function onSubmitData() {
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
      const defaultFormData = attributeList.map(({ id, fieldType }) => ({
        id,
        value: '',
        fieldType,
      }));
      setContentTempData(defaultFormData);
    }

    return postTypeDetail?.attributeList.map(({ id, name, fieldType, attributeList }: any) => {
      switch (fieldType) {
        case 'EMAIL':
          return (
            <FormList.Email
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleFormChange(id, e.target.value, fieldType);
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
            <FormList.TextAreaField
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleFormChange(id, e.target.value, fieldType);
              }}
            />
          );
        case 'TEXT_EDITOR':
          return <FormList.TextEditor key={id} name={name} />;
        case 'PHONE_NUMBER':
          return (
            <FormList.PhoneNumber
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleFormChange(id, e.target.value, fieldType);
              }}
            />
          );
        case 'TEXT_FIELD':
          return (
            <FormList.TextField
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleFormChange(id, e.target.value, fieldType);
              }}
            />
          );
        case 'YOUTUBE_URL':
          return (
            <FormList.YoutubeURL
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleFormChange(id, e.target.value, fieldType);
              }}
            />
          );
        case 'LOOPING':
          return (
            <div key={id} className="">
              <Typography type="body" size="m" weight="bold" className="w-48 my-5 ml-1 mr-9">
                {name}
              </Typography>
              <div className="card w-full shadow-md p-5">
                {attributeList?.map(({ idx, name, fieldType }: any) => {
                  switch (fieldType) {
                    case 'EMAIL':
                    case 'DOCUMENT':
                    case 'IMAGE':
                    case 'TEXT_AREA':
                    case 'TEXT_EDITOR':
                    case 'PHONE_NUMBER':
                    case 'TEXT_FIELD':
                    case 'YOUTUBE_URL':
                      return (
                        <FormList.Email
                          key={idx}
                          name={name}
                          onChange={(e: { target: { value: string } }) => {
                            handleFormChange(id, e.target.value, fieldType);
                          }}
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

  const Footer = () => {
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
          <button
            onClick={() => {
              onSubmitData();
            }}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <TitleCard title={`New ${postTypeDetail?.name ?? ''}`} border={true}>
      <div className="ml-2 mt-6">
        {/* DEFAULT FORM */}
        <div className="grid grid-cols-1 gap-5">
          <InputText
            name="title"
            labelTitle="Title"
            placeholder="Title"
            labelStyle="font-bold text-base w-48"
            direction="row"
            roundStyle="xl"
            onChange={e => {
              handleChange(e.target.name, e.target.value);
            }}
          />
          {postTypeDetail?.isUseCategory && (
            <div className="flex flex-row items-center">
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
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
          <div className="flex flex-row">
            <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
              Short Description
            </Typography>
            <TextArea
              name="shortDesc"
              labelTitle=""
              placeholder={'Enter description'}
              containerStyle="rounded-3xl"
              onChange={e => {
                handleChange(e.target.name, e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="border border-primary my-10" />

      {/* DYNAMIC FORM */}
      {renderFormList()}
      <Footer />
    </TitleCard>
  );
}
