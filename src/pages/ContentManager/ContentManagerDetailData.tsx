import { Key, useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import DropDown from '@/components/molecules/DropDown';
import {
  useGetCategoryListQuery,
  useGetContentDataDetailQuery,
} from '@/services/ContentManager/contentManagerApi';
import { useCreateContentDataMutation } from '@/services/ContentType/contentTypeApi';
import { useNavigate, useParams } from 'react-router-dom';
import FormList from './components/FormList';

import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import StatusBadge from './components/StatusBadge';

export default function ContentManagerDetailData() {
  const dispatch = useAppDispatch();
  const [contentDataDetailList, setContentDataDetail] = useState({
    id: null,
    title: '',
    shortDesc: '',
    categoryName: '',
    status: '',
    contentData: [],
  });

  const [formValues, setFormValues] = useState<any>({});

  const handleChange = (id: string | number, value: string) => {
    console.log('value ', value);
    setFormValues((prevFormValues: any) => ({
      ...prevFormValues,
      [id]: value,
    }));
  };

  // GO BACK
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const params = useParams();
  const [id] = useState<any>(Number(params.dataId));

  // TABLE PAGINATION STATE
  const [categoryList, setCategoryList] = useState<any>([]);
  const [postTypeId] = useState(1);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(5);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');

  // RTK GET DATA
  const fetchGetContentDataDetail = useGetContentDataDetailQuery({ id });
  const { data: contentDataDetail } = fetchGetContentDataDetail;

  useEffect(() => {
    if (contentDataDetail) {
      setContentDataDetail(contentDataDetail?.contentDataDetail);
      console.log(contentDataDetailList);
    }
  }, [contentDataDetail]);

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
  const { title, shortDesc, ...contentData } = formValues;
  const payload = {
    title: formValues.title,
    shortDesc: formValues.shortDesc,
    isDraft: false,
    postTypeId: id,
    categoryName: 'test1',
    contentData,
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

  const renderFormList = () => {
    return contentDataDetailList?.contentData.map(({ id, name, fieldType, contentData }: any) => {
      switch (fieldType) {
        case 'EMAIL':
          return (
            <FormList.Email
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleChange(id, e.target.value);
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
              onFilesChange={() => {}}
            />
          );
        case 'TEXT_AREA':
          return (
            <FormList.TextAreaField
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleChange(id, e.target.value);
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
                handleChange(id, e.target.value);
              }}
            />
          );
        case 'TEXT_FIELD':
          return (
            <FormList.TextField
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleChange(id, e.target.value);
              }}
            />
          );
        case 'YOUTUBE_URL':
          return (
            <FormList.YoutubeURL
              key={id}
              name={name}
              onChange={(e: { target: { value: string } }) => {
                handleChange(id, e.target.value);
              }}
            />
          );
        case 'LOOPING':
          return (
            <div key={id} className="">
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Looping
              </Typography>
              {contentData?.map((_data: any, idx: Key | null | undefined) => {
                return <p key={idx}>Nested Form</p>;
              })}
              <div className="border my-10" />
            </div>
          );
        default:
          return <div>err</div>;
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
    <TitleCard
      onBackClick={goBack}
      hasBack={true}
      title={`${contentDataDetailList?.title ?? ''}`}>
      <div className="ml-2 mt-6">
        <div className="grid grid-cols-1 gap-5">
          <div className='absolute left-56 top-20'>
            <StatusBadge status={contentDataDetailList?.status} />
          </div>
          <InputText
            name="title"
            value={contentDataDetailList?.title}
            labelTitle="Title"
            labelStyle="font-bold text-base w-48"
            direction="row"
            roundStyle="xl"
            onChange={e => {
              handleChange(e.target.name, e.target.value);
            }}
          />
          {contentDataDetailList?.categoryName && (
            <div className="flex flex-row items-center">
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Category
              </Typography>
              <DropDown
                labelStyle="font-bold text-base"
                defaultValue="item1"
                items={categoryList}
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
              value={contentDataDetailList?.shortDesc}
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

      {renderFormList()}
      <Footer />
    </TitleCard>
  );
}
