import { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';

// OTHER GET DATA
import { useGetPageManagementListQuery } from '@/services/PageManagement/pageManagementApi';
const maxImageSize = 2 * 1024 * 1024;

export default function MenuNew() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [listPage, setListPage] = useState([]);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(9999);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [filterBy] = useState('');
  const [startDate] = useState('');
  const [endDate] = useState('');

  const fetchPageListQuery = useGetPageManagementListQuery({
    pageIndex,
    limit: pageLimit,
    sortBy,
    direction,
    search,
    filterBy,
    startDate,
    endDate,
    isArchive: false,
  });
  const { data: listPageData } = fetchPageListQuery;

  useEffect(() => {
    const pagesTemp = listPageData?.pageList?.pages;
    if (pagesTemp) {
      const filteredListPageData = pagesTemp?.map((val: any) => {
        const list = {
          value: val.id,
          label: `${val.title} - ${val.status.toLowerCase()}`,
        };

        return list;
      });
      console.log(pagesTemp);
      setListPage(filteredListPageData);
    }
  }, [listPageData]);

  return (
    <TitleCard title="Create Menu" border={true}>
      {/* MAIN CONTAINER */}
      <div className="flex flex-col mt-5 gap-5">
        {/* FORM SECTION */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(() => {
            console.log('nothing form');
          })}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <Controller
                name="pageTitle"
                control={control}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle="Page Title"
                    labelRequired
                    placeholder="Input Page Title"
                    error={!!errors?.pageTitle?.message}
                    helperText={errors?.pageTitle?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
              <div className="flex flex-row items-center">
                <Typography type="body" size="m" weight="bold" className="w-40 ml-1">
                  Type
                </Typography>
                <FormList.DropDown
                  key="type"
                  labelTitle="Type"
                  error={!!errors?.type?.message}
                  helperText={errors?.type?.message}
                  // themeColor="primary"
                  items={[
                    {
                      value: 'PAGE',
                      label: 'Page',
                    },
                    {
                      value: 'LINK',
                      label: 'Link',
                    },
                    {
                      value: 'NO_LANDING_PAGE',
                      label: 'No Landing Page',
                    },
                  ]}
                  onChange={(e: any) => {
                    console.log(e);
                  }}
                  inputWidth={350}
                />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <div className="flex flex-row items-center">
                <Typography type="body" size="m" weight="bold" className="w-56 ml-1">
                  Page
                  <span className={'text-reddist text-lg'}>{`*`}</span>
                </Typography>
                <FormList.DropDown
                  key="page"
                  labelTitle="Type"
                  error={!!errors?.type?.message}
                  helperText={errors?.type?.message}
                  items={listPage}
                  onChange={(e: any) => {
                    console.log(e);
                  }}
                  inputWidth={350}
                />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                key="menuIcon"
                name="menuIcon"
                control={control}
                render={({ field }) => {
                  const onChange = useCallback((e: any) => {
                    field.onChange({ target: { value: e } });
                  }, []);
                  return (
                    <FormList.FileUploaderV2
                      {...field}
                      key="menuIcon"
                      labelTitle="Menu Icon"
                      isDocument={false}
                      multiple={false}
                      error={!!errors?.menuIcon?.message}
                      helperText={errors?.menuIcon?.message}
                      onChange={onChange}
                      border={false}
                      disabled={false}
                      maxSize={maxImageSize}
                      showMaxSize={true}
                      editMode={true}
                      inputWidth={350}
                    />
                  );
                }}
              />
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                name="shortDesc"
                control={control}
                render={({ field }) => (
                  <FormList.TextAreaField
                    {...field}
                    labelTitle="Sort Description"
                    // labelRequired
                    placeholder="Input Short Description"
                    error={!!errors?.shortDesc?.message}
                    helperText={errors?.shortDesc?.message}
                    border={false}
                    inputWidth={350}
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-16 flex justify-end items-center">
            <div className="flex flex-row p-2 gap-2">
              <button
                className="btn btn-outline text-xs btn-sm w-28 h-10"
                onClick={() => {
                  // setShowCancel(true);
                }}>
                Cancel
              </button>
              <button
                className="btn btn-primary text-xs btn-sm w-28 h-10"
                onClick={() => {
                  // handlerPublishMenu();
                }}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </TitleCard>
  );
}
