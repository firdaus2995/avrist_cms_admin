import { useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import DropDown from '@/components/molecules/DropDown';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import CkEditor from '@/components/atoms/Ckeditor';
import {
  useGetPostTypeDetailQuery,
  useCreateContentDataMutation,
} from '@/services/ContentType/contentTypeApi';
import { useParams } from 'react-router-dom';
import FormList from './components/FormList';

import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';

export default function ContentManagerNew() {
  const dispatch = useAppDispatch();
  const [postTypeDetail, setPostTypeDetail] = useState({
    id: null,
    name: '',
    postTypeGroup: '',
    slug: '',
    isUseCategory: '',
    total: null,
    attributeList: [],
  });

  const [formValues, setFormValues] = useState<any>({});

  const handleChange = (id: string | number, value: string) => {
    setFormValues((prevFormValues: any) => ({
      ...prevFormValues,
      [id]: value,
    }));
  };

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

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

  const payload = {
    title: formValues.title,
    shortDesc: formValues.shortDesc,
    isDraft: false,
    postTypeId: id,
    categoryName: 'test1',
    contentData: [],
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
    return postTypeDetail?.attributeList.map(({ id, name, fieldType }) => {
      switch (fieldType) {
        case 'EMAIL':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Email
              </Typography>
              <InputText
                labelTitle={name}
                labelStyle="font-bold text-base w-48"
                direction="row"
                roundStyle="xl"
                onChange={e => {
                  handleChange(id, e.target.value);
                }}
              />
              <div className="border my-10" />
            </div>
          );
        case 'DOCUMENT':
        case 'IMAGE':
          return (
            <div id={id}>
              <FormList.FileUploader
                name={name}
                fieldType={fieldType}
                multiple={true}
                onFilesChange={() => {}}
              />
            </div>
          );
        case 'TEXT_AREA':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Text Area
              </Typography>
              <div className="flex flex-row">
                <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                  {name}
                </Typography>
                <TextArea
                  name={id}
                  labelTitle=""
                  placeholder={'Enter description'}
                  containerStyle="rounded-3xl"
                  onChange={e => {
                    handleChange(id, e.target.value);
                  }}
                />
              </div>
              <div className="border my-10" />
            </div>
          );
        case 'TEXT_EDITOR':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
                Text Editor
              </Typography>
              <div className="flex flex-row mt-5">
                <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
                  {name}
                </Typography>
                <CkEditor />
              </div>
              <div className="border my-10" />
            </div>
          );
        case 'PHONE_NUMBER':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Phone Number
              </Typography>
              <InputText
                name={id}
                labelTitle={name}
                labelStyle="font-bold text-base w-48"
                direction="row"
                roundStyle="xl"
                onChange={e => {
                  handleChange(id, e.target.value);
                }}
              />
              <div className="border my-10" />
            </div>
          );
        case 'TEXT_FIELD':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Text Field
              </Typography>
              <InputText
                labelTitle={name}
                labelStyle="font-bold text-base w-48"
                direction="row"
                roundStyle="xl"
                onChange={e => {
                  handleChange(id, e.target.value);
                }}
              />
              <div className="border my-10" />
            </div>
          );
        case 'YOUTUBE_URL':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Youtube URL
              </Typography>
              <InputText
                labelTitle={name}
                labelStyle="font-bold text-base w-48"
                direction="row"
                roundStyle="xl"
                onChange={e => {
                  handleChange(id, e.target.value);
                }}
              />
              <div className="border my-10" />
            </div>
          );
        case 'LOOPING':
          return (
            <div key={id}>
              <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                Looping
              </Typography>
              <InputText
                labelTitle={name}
                labelStyle="font-bold text-base w-48"
                direction="row"
                roundStyle="xl"
                onChange={() => {}}
              />
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
    <TitleCard title={`New ${postTypeDetail?.name ?? ''}`} border={true}>
      <div className="ml-2 mt-6">
        <div className="grid grid-cols-1 gap-5">
          <InputText
            name="title"
            labelTitle="Title"
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
              // value={description}
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
