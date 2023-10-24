import { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';
import {
  useCreateMenuMutation,
  // useDeleteMenuMutation,
  // useEditMenuMutation,
  // useGetMenuListQuery,
  // usePublishMenuMutation,
  // useUpdateMenuStructureMutation,
} from '../../services/Menu/menuApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

// OTHER GET DATA
import { useGetPageManagementListQuery } from '@/services/PageManagement/pageManagementApi';
const maxImageSize = 2 * 1024 * 1024;

export default function MenuNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedType, setSelectedType] = useState<any>({
    value: 'PAGE',
    label: 'Page',
  });

  const [listPage, setListPage] = useState([]);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(9999);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [filterBy] = useState('');
  const [startDate] = useState('');
  const [endDate] = useState('');

  // GET LIST DATA
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
      setListPage(filteredListPageData);
    }
  }, [listPageData]);

  // POST
  const onSubmit = (e: any) => {
    onCreate(e);
  };

  const [createMenu] = useCreateMenuMutation();

  const onCreate = (e: any) => {
    const payload = {
      title: e.title,
      menuType: selectedType.value,
      externalUrl: e.externalUrl || '',
      isNewTab: e.isNewTab || false,
      pageId: e.pageId,
    };
    createMenu(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
          }),
        );
        navigate('/menu', { replace: true });
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
          }),
        );
      });
  };

  return (
    <TitleCard title="Create Menu" border={true}>
      {/* MAIN CONTAINER */}
      <div className="flex flex-col mt-5 gap-5">
        {/* FORM SECTION */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    labelTitle="Page Title"
                    labelRequired
                    placeholder="Input Page Title"
                    error={!!errors?.title?.message}
                    helperText={errors?.title?.message}
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
                  defaultValue={selectedType.label}
                  labelTitle="Type"
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
                    setSelectedType(e);
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
                <Controller
                  name="pageId"
                  control={control}
                  rules={{ required: 'Page is required' }}
                  render={({ field }) => {
                    const onChange = useCallback((e: any) => {
                      field.onChange({ target: { value: e.value } });
                    }, []);
                    return (
                      <FormList.DropDown
                        {...field}
                        error={!!errors?.pageId?.message}
                        helperText={errors?.pageId?.message}
                        items={listPage}
                        onChange={onChange}
                        inputWidth={350}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <Controller
                key="menuIcon"
                name="menuIcon"
                control={control}
                rules={{
                  required: `${t('user.page-template-new.form.imagePreview.required-message')}`,
                  validate: value => {
                    if (value && value.length > 0) {
                      // Parse the input value as JSON
                      const parsedValue = JSON.parse(value);

                      // Check if parsedValue is an array and every item has imageUrl and altText properties
                      if (
                        Array.isArray(parsedValue) &&
                        parsedValue.every(item => item.imageUrl && item.altText)
                      ) {
                        return true; // Validation passed
                      } else {
                        return 'All items must have Image and Alt Text'; // Validation failed
                      }
                    } else {
                      return `${t('user.page-template-new.form.imagePreview.required-message')}`; // Validation failed for empty value
                    }
                  },
                }}
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
              <button className="btn btn-primary text-xs btn-sm w-28 h-10" type="submit">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </TitleCard>
  );
}
