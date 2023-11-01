import { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import Typography from '@/components/atoms/Typography';
import FormList from '@/components/molecules/FormList';
import {
  useEditMenuMutation,
  useCreateMenuMutation,
  useGetMenuByIdQuery,
} from '@/services/Menu/menuApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { t } from 'i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import TakedownModal from './components/TakedownModal';

// OTHER GET DATA
import { useGetPageManagementListQuery } from '@/services/PageManagement/pageManagementApi';
// import { UniqueTypeNamesRule } from 'graphql';

const maxImageSize = 2 * 1024 * 1024;
const maxChar = 50;

export default function MenuNew() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const screenType = [
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
  ];
  const [selectedType, setSelectedType] = useState<any>(screenType[0]);
  const [selectedPageId, setSelectedPageId] = useState<any>(null);
  const [openTakedownModal, setOpenTakedownModal] = useState(false);

  const [listPage, setListPage] = useState<any>([]);
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(9999);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [filterBy] = useState('');
  const [startDate] = useState('');
  const [endDate] = useState('');

  const resetValue = () => {
    reset();
    setSelectedPageId(screenType[0]);
    setSelectedPageId(null);
    setOpenTakedownModal(false);
    navigate('/menu', { replace: true });
  };

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
          label: val.title,
        };

        return list;
      });
      setListPage(filteredListPageData);
    }
  }, [listPageData]);

  useEffect(() => {
    const defPageId = getValues('pageId');
    if (listPage && defPageId) {
      const selectedLabel = listPage?.find((item: any) => item.value === defPageId)?.label ?? null;
      setSelectedPageId(selectedLabel);
    }
  }, [listPage, getValues('pageId')]);

  // GET DEFAULT DATA
  const fetchDefaultData = useGetMenuByIdQuery(
    { id: parseInt(params.id ?? '') },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: defaultData } = fetchDefaultData;

  useEffect(() => {
    const data = defaultData?.menuById;
    if (data) {
      const defId = data.id || '';
      const defTitle = data.title || '';
      const defMenuType = data.menuType || '';
      const defExternalUrl = data.externalUrl || '';
      const defIsNewTab = data.isNewTab || false;
      const defPageId = data.pageId || null;

      const defShortDesc = data.shortDesc || '';
      const defIcon = data.icon || '';

      setValue('id', defId);
      setValue('title', defTitle);
      setSelectedType(screenType.find(item => item.value === defMenuType) ?? screenType[0]);
      setValue('externalUrl', defExternalUrl);
      setValue('isNewTab', defIsNewTab);
      setValue('pageId', defPageId);
      setValue('shortDesc', defShortDesc);
      setValue('icon', defIcon);
    }
  }, [defaultData]);

  // POST
  const onSubmit = (e: any) => {
    if (e.id) {
      onPostEdit(e);
    } else {
      onPostCreate(e);
    }
  };

  const [createMenu] = useCreateMenuMutation();
  const [editMenu] = useEditMenuMutation();

  const onPostCreate = (e: any) => {
    const payload = {
      title: e.title,
      menuType: selectedType.value,
      externalUrl: e.externalUrl || '',
      isNewTab: e.isNewTab || false,
      pageId: e.pageId || null,
      shortDesc: e.shortDesc || '',
      icon: e.menuIcon || '',
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

  const onPostEdit = (e: any) => {
    const payload = {
      id: e.id,
      title: e.title,
      menuType: selectedType.value,
      externalUrl: e.externalUrl || '',
      isNewTab: e.isNewTab || false,
      pageId: e.pageId || null,
      shortDesc: e.shortDesc || '',
      icon: e.menuIcon || '',
    };
    editMenu(payload)
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

  const isEditMode = location.pathname.includes('edit');

  useEffect(() => {
    const pageType = location?.state?.pageType;
    if (pageType) {
      setSelectedType(screenType.find(item => item.value === pageType) ?? screenType[0]);
    }
  }, [location?.state]);

  return (
    <>
      <TakedownModal
        open={openTakedownModal}
        onCancel={() => {
          setOpenTakedownModal(false);
        }}
        idDelete={params?.id}
      />
      <TitleCard title={isEditMode ? 'Edit Menu' : 'Create Menu'} border={true}>
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
                    items={screenType}
                    onChange={(e: any) => {
                      setSelectedType(e);
                    }}
                    inputWidth={350}
                  />
                </div>
              </div>
              {selectedType.value === 'PAGE' && (
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
                            defaultValue={selectedPageId}
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
              )}
              {selectedType.value === 'LINK' && (
                <div className="flex flex-row justify-start">
                  <Controller
                    name="externalUrl"
                    control={control}
                    rules={{
                      required: `URL is required`,
                      pattern: {
                        value:
                          /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
                        message: 'Invalid URL',
                      },
                    }}
                    render={({ field }) => (
                      <FormList.TextField
                        {...field}
                        labelTitle="URL Link"
                        labelRequired
                        placeholder="Input URL Link"
                        error={!!errors?.url?.message}
                        helperText={errors?.url?.message}
                        border={false}
                        inputWidth={350}
                      />
                    )}
                  />
                </div>
              )}
              {selectedType.value !== 'NO_LANDING_PAGE' && (
                <div className="w-40 ml-60">
                  <Controller
                    name="isNewTab"
                    control={control}
                    render={({ field }) => (
                      <CheckBox
                        {...field}
                        defaultValue={field.value || false}
                        updateFormValue={e => {
                          field.onChange(e.value);
                        }}
                        labelTitle={t('user.menu-list.menuList.openInNewTab')}
                        updateType={''}
                      />
                    )}
                  />
                </div>
              )}
              <div className="flex flex-row justify-start">
                <Controller
                  key="icon"
                  name="icon"
                  control={control}
                  render={({ field }) => {
                    const onChange = useCallback((e: any) => {
                      field.onChange({ target: { value: e } });
                    }, []);
                    return (
                      <FormList.FileUploaderV2
                        {...field}
                        key="icon"
                        labelTitle="Menu Icon"
                        isDocument={false}
                        multiple={false}
                        onChange={onChange}
                        border={false}
                        disabled={false}
                        maxSize={maxImageSize}
                        showMaxSize={true}
                        editMode={true}
                        inputWidth={350}
                        disabledAltText={true}
                        isOptional={true}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex flex-col justify-start">
                <Controller
                  name="shortDesc"
                  control={control}
                  render={({ field }) => (
                    <FormList.TextAreaField
                      {...field}
                      labelTitle="Sort Description"
                      placeholder="Input Short Description"
                      error={!!errors?.shortDesc?.message}
                      helperText={errors?.shortDesc?.message}
                      border={false}
                      inputWidth={350}
                      maxLength={maxChar}
                    />
                  )}
                />
                <div className="w-[35rem] flex justify-end">
                  <p className="text-body-text-3 text-xs mt-2">
                    {t('user.menu-list.menuList.maxDescription', { maxChar })}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-16 flex justify-end items-center">
              <div className="flex flex-row p-2 gap-2">
                <button
                  className="btn btn-outline text-xs btn-sm w-28 h-10"
                  onClick={e => {
                    e.preventDefault();
                    if (isEditMode) {
                      setOpenTakedownModal(true);
                    } else {
                      resetValue();
                    }
                  }}>
                  {isEditMode ? 'Takedown' : 'Cancel'}
                </button>
                <button className="btn btn-primary text-xs btn-sm w-28 h-10" type="submit">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </TitleCard>
    </>
  );
}
