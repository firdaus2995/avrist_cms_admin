import Typography from '@/components/atoms/Typography';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import PreviewEye from '../../assets/preview-eye.svg';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';
import CkEditor from '@/components/atoms/Ckeditor';
import { InputSearch } from '@/components/atoms/Input/InputSearch';
import { useEffect, useState } from 'react';
import DropDown from '@/components/molecules/DropDown';
import PaginationComponent from '@/components/molecules/Pagination';
import { useGetPostTypeListQuery } from '@/services/ContentType/contentTypeApi';

export default function PageManagementNew() {
  const {
    control,
    handleSubmit,
    // eslint-disable-next-line no-empty-pattern
    formState: {},
  } = useForm();

  const [search, setSearch] = useState<any>(''); //eslint-disable-line
  const [total, setTotal] = useState<number>(60); //eslint-disable-line
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit] = useState(6);
  // PAGE TEMPLACE SELECTION STATE
  const [pageTemplates, setPageTemplates] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null);
  // CONTENT SELECTION STATE
  const [listContents, setListContents] = useState<any>([]);
  const [setContentTypeId] = useState<any>(null);

  // RTK GET CONTENT
  const fetchQuery = useGetPostTypeListQuery({
    pageIndex: 0,
    limit: 999999,
    sortBy: "name",
    direction: "asc",
    search: "",
  }, {
    refetchOnMountOrArgChange: true,
  });
  const { data: dataContents } = fetchQuery;

  useEffect(() => {
    setTimeout(() => {
      if (dataContents) {
        setListContents(dataContents?.postTypeList?.postTypeList.map((element: any) => {
          return {
            value: element.id,
            label: element.name,
          };
        }));
      };

      setPageTemplates([
        {
          id: 1,
          name: 'Image 1',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 2,
          name: 'Image 2',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 3,
          name: 'Image 3',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 4,
          name: 'Image 4',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 5,
          name: 'Image 5',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
        {
          id: 6,
          name: 'Image 6',
          image:
            'https://w0.peakpx.com/wallpaper/677/326/HD-wallpaper-blue-landscape-aesthetic-blue-flowers-landscape-nature-trees-thumbnail.jpg',
        },
      ]);
    }, 50);
  }, [dataContents]);

  const handlerSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <TitleCard title="Create Page Management" border={true}>
      <div className="flex flex-col mt-5 gap-5">
        <div>
          <button className="w-[160px] !min-h-[45px] h-[45px] btn btn-outline btn-primary flex flex-row justify-center items-center gap-2">
            <img src={PreviewEye} className="h-[30px] w-[30px]" />
            Preview
          </button>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(handlerSubmit)}>
          {/* FORM SECTION */}
          <div className="flex flex-col gap-3">
            <Typography weight="bold" size="l">
              General Information
            </Typography>
            <div className="flex flex-row justify-between">
              <Controller
                name="pageName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle="Page Name"
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder="Enter new page name"
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
              <Controller
                name="metaTitle"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle="Metatitle"
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder="Enter metatitle here"
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Controller
                name="slug"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle="Slug"
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder="Enter slug name"
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
              <Controller
                name="metaDescription"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    labelTitle="Metadescription"
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    roundStyle="xl"
                    placeholder="Enter metadescription here"
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                name="shortDesc"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextArea
                    labelTitle="Short Description"
                    labelStyle="font-semibold"
                    labelWidth={150}
                    labelRequired
                    direction="row"
                    placeholder="Enter description"
                    inputWidth={350}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-start gap-3">
              <Typography size="m" weight="semi">
                Content
              </Typography>
              <CkEditor />
            </div>
          </div>
          {/* DIVIDER */}
          <div className="w-full my-4 border-[1px] border-lavender" />
          {/* PAGE TEMPLATE SECTION */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between">
              <Typography size="m" weight="bold">
                Choose Your Template<span className='text-reddist'>*</span>
              </Typography>
              <InputSearch
                onBlur={(e: any) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search"
              />
            </div>
            <div className="flex flex-wrap">
              {pageTemplates.length > 0 &&
                pageTemplates.length < 7 &&
                pageTemplates.map((element: any) => (
                  <div key={element.id} className="px-[5%] py-5 flex flex-col basis-2/6 gap-3">
                    <img
                      src={element.image}
                      className={`h-[450px] object-cover	cursor-pointer rounded-xl ${
                        selected === element.id
                          ? 'border-[#5A4180] border-4'
                          : 'border-[#828282] border-2'
                      }`}
                      onClick={() => {
                        setSelected(element.id);
                      }}
                    />
                    <Typography size="l" weight="medium" alignment="center">
                      {element.name}
                    </Typography>
                  </div>
                ))}
            </div>
            <div className='w-full flex justify-center'>
              <PaginationComponent
                total={total}
                page={pageIndex}
                pageSize={pageLimit}
                setPageOnly={true}
                setPage={(page: number) => {
                  setPageIndex(page);
                }}
              />
            </div>
          </div>
          {/* CONTENT TYPE SECTION */}
          <div className="flex justify-center mt-5">
            <div className="w-[50%]">
              <DropDown
                labelTitle="Choose Content Type"
                labelStyle="font-bold	"
                labelWidth={175}
                direction='row'
                defaultValue=""
                labelEmpty=""
                items={listContents}
                onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                  if (event) {
                    setContentTypeId(value);
                  }
                }}
              />
            </div>
          </div>
          {/* BUTTONS SECTION */}
          <div className="mt-[25%] flex justify-end items-end gap-2">
            <button className="btn btn-outline btn-md">Cancel</button>
            <button className="btn btn-outline btn-warning btn-md">Save as Draft</button>
            <button className="btn btn-success btn-md">Submit</button>
          </div>
        </form>
      </div>
    </TitleCard>
  );
}
