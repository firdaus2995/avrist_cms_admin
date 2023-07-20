import { ChangeEvent, useEffect, useState } from 'react';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import DropDown from '@/components/molecules/DropDown';
import { useGetCategoryListQuery } from '@/services/ContentManager/contentManagerApi';
import TestForm from './components/Form/TestForm';
import CkEditor from '@/components/atoms/Ckeditor';

export default function ContentManagerNew() {
  // FORM
  const [bannerForm, setBannerForm] = useState([{ textField: '', textArea: '', textEditor: '' }]);
  useEffect(() => {
    console.log(bannerForm);
  }, [bannerForm]);

  const handleAddBannerForm = () => {
    const values = [...bannerForm];
    values.push({
      textField: '',
      textArea: '',
      textEditor: '',
    });
    setBannerForm(values);
  };

  // const handleRemoveBannerForm = index => {
  //   const values = [...bannerForm];
  //   values.splice(index, 1);
  //   setBannerForm(values);
  // };

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const values = [...bannerForm];
    const updatedValue = event.target.name;
    (values[index] as any)[updatedValue] = event.target.value;
    setBannerForm(values);
  };

  // TABLE PAGINATION STATE
  const [categoryList, setCategoryList] = useState<any>([]);
  const [postTypeId] = useState(1);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(5);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');

  // RTK GET DATA
  const fetchQuery = useGetCategoryListQuery({
    postTypeId,
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
  });
  const { data } = fetchQuery;

  useEffect(() => {
    if (data) {
      const tempCategoryList = data?.categoryList?.categoryList.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setCategoryList(tempCategoryList);
    }
  }, [data]);

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
            onClick={() => {}}
            className="btn btn-success text-xs text-white btn-sm w-28 h-10">
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <TitleCard title="New Homepage Avrist Life" border={true}>
      <div className="ml-2 mt-6">
        <div className="grid grid-cols-1 gap-5">
          <InputText
            labelTitle="ID"
            labelStyle="font-bold text-base w-48"
            direction="row"
            roundStyle="xl"
            onChange={() => {}}
          />
          <InputText
            labelTitle="Title"
            labelStyle="font-bold text-base w-48"
            direction="row"
            roundStyle="xl"
            onChange={() => {}}
          />
          <div className="flex flex-row items-center">
            <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
              Category
            </Typography>
            <DropDown labelStyle="font-bold text-base" defaultValue="item1" items={categoryList} />
          </div>
          <div className="flex flex-row">
            <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
              Short Description
            </Typography>
            <TextArea
              labelTitle=""
              placeholder={'Enter description'}
              // value={description}
              containerStyle="rounded-3xl"
              onChange={() => {
                // setDescription(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="border border-primary my-10" />

      {/* LOOPING BANNER FORM */}
      <div>
        <Typography type="body" size="m" weight="bold" className="my-5 ml-1">
          Looping Banner
        </Typography>
        {bannerForm.map((_formData, index) => {
          return (
            <div key={index}>
              <div className="rounded-xl shadow-md p-5 mb-10">
                <InputText
                  labelTitle="Text Field"
                  labelStyle="font-bold text-base w-48"
                  direction="row"
                  roundStyle="xl"
                  name="name"
                  onChange={event => {
                    handleInputChange(index, event);
                  }}
                />
                <div className="flex flex-row">
                  <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1 mr-9">
                    Text Area
                  </Typography>
                  <TextArea
                    labelTitle=""
                    placeholder={'Enter description'}
                    containerStyle="rounded-3xl"
                    onChange={event => {
                      handleInputChange(index, event);
                    }}
                  />
                </div>
                <div className="flex flex-row mt-5">
                  <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
                    Text Editor
                  </Typography>
                  <CkEditor />
                </div>
                <div className="flex flex-row mt-5">
                  <Typography type="body" size="m" weight="bold" className="w-48 mt-5 ml-1">
                    Image Banner
                  </Typography>
                  <div className="w-1/3 rounded-lg h-24 bg-red-50"></div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <button
            onClick={handleAddBannerForm}
            className="btn btn-outline border-primary text-xs text-primary btn-sm h-10 w-52">
            <div className="flex flex-row gap-2 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Data
            </div>
          </button>
        </div>
      </div>

      <div className="border border-primary my-10" />
      <TestForm />
      <Footer />
    </TitleCard>
  );
}
