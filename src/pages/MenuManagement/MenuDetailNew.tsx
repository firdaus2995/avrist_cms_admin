import { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';

import FormList from '@/components/molecules/FormList';
import DropDown from '@/components/molecules/DropDown';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { useCreateMenuMutation } from '@/services/Menu/menuApi';
import { useAppDispatch } from '@/store';
import { openToast } from '@/components/atoms/Toast/slice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckBox } from '@/components/atoms/Input/CheckBox';
import { useGetPageManagementListQuery } from '@/services/PageManagement/pageManagementApi';
import { menuType } from './constants';
import { InputText } from '@/components/atoms/Input/InputText';
import { TextArea } from '@/components/atoms/Input/TextArea';

export default function MenuNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // BACKEND STATE
  const [listApprovedPage, setListApprovedPage] = useState<any>([]);
  // FORM STATE
  const [id] = useState<any>(Number(params.id));
  const [selectedType, setSelectedType] = useState<any>(menuType[0]);

  // RTK GET PAGE
  const fetchPageListQuery = useGetPageManagementListQuery({
    pageIndex: 0,
    limit: 9999,
    sortBy: 'id',
    direction: 'asc',
    search: '',
    filterBy: '',
    startDate: '',
    endDate: '',
    isArchive: false,
  });
  const { data: dataPage } = fetchPageListQuery;

  // RTK CREATE MENU
  const [createMenu] = useCreateMenuMutation();

  useEffect(() => {
    reset();
  }, [selectedType]);

  useEffect(() => {
    if (dataPage) {
      setListApprovedPage(dataPage?.pageList?.pages?.map((val: any) => {
        return {
          value: val.id,
          label: val.title,
        };
      }));
    };
  }, [dataPage]);

  useEffect(() => {
    const pageType = location?.state?.pageType;
    if (pageType) {
      setSelectedType(menuType.find((item) => {
        return item.value === pageType;
      })?.value);
    };
  }, [location]);

  const onSubmit = (data: any) => {
    const payload = {
      id,
      title: data?.title,
      menuType: selectedType,
      pageId: selectedType === 'PAGE' ? (data?.pageId ?? null) : null,
      externalUrl: selectedType === 'LINK' ? (data?.externalUrl ?? '') : '',
      isNewTab: (selectedType === 'PAGE' || selectedType === 'LINK') ? (data?.isNewTab ?? false) : false,
      shortDesc: data?.shortDesc,
      icon: data?.icon ?? '',
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
        navigate(`/menu/detail/${id}`);
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
    <TitleCard title='Create Menu' border={true}>
      <div className="flex flex-col mt-5 gap-5">
        <form className="flex flex-col w-100" onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col mt-[60px] gap-5'>
            {/* ROW */}
            <div className='flex flex-row gap-14'>
              <div className='flex flex-1'>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=''
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      direction="row"
                      inputWidth={400}
                      labelWidth={200}
                      labelTitle="Page Title"
                      labelStyle="font-bold"
                      labelRequired
                      roundStyle="xl"
                      placeholder="Input Page Title"
                      isError={!!errors?.title?.message}
                      helperText={errors?.title?.message}
                    />
                  )}
                />
              </div>
              <div className='flex flex-1'>
                <DropDown
                  direction='row'
                  inputWidth={400}
                  labelWidth={200}
                  labelTitle="Type"
                  labelStyle="font-bold"
                  labelEmpty="Choose Type"
                  items={menuType}
                  defaultValue={selectedType}
                  onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                    if (event) {
                      setSelectedType(value)
                    };
                  }}
                />
              </div>
            </div>
            {/* ROW */}
            {(selectedType === 'PAGE' || selectedType === 'LINK') && (
              <div className='flex flex-row gap-14'>
                <div className='flex flex-1'>
                  {
                    selectedType === 'PAGE' ? (
                      <Controller
                        name='pageId'
                        control={control}
                        defaultValue=''
                        rules={{ required: 'Page is required' }}
                        render={({ field }) => (
                          <DropDown
                            {...field}
                            direction='row'
                            inputWidth={400}
                            labelWidth={200}      
                            labelTitle="Page"
                            labelStyle="font-bold"
                            labelRequired
                            labelEmpty="Choose Page"
                            items={listApprovedPage}
                            error={!!errors?.pageId?.message}
                            helperText={errors?.roleId?.message}
                            onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                              if (event) {
                                setValue('pageId', value);
                                field.onChange(value);
                              };
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name="externalUrl"
                        control={control}
                        defaultValue=''
                          rules={{
                            required: `URL is required`,
                            pattern: {
                              value:
                                /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi,
                              message: 'Invalid URL',
                            },
                          }}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            direction="row"
                            inputWidth={400}
                            labelWidth={200}
                            labelTitle="URL Link"
                            labelStyle="font-bold"
                            labelRequired
                            roundStyle="xl"
                            placeholder="Input URL Link"
                            isError={!!errors?.externalUrl?.message}
                            helperText={errors?.externalUrl?.message}
                          />
                        )}
                      />
                    )
                  }
                </div>
                <div className='flex flex-1'>{/* SPACES */}</div>
              </div>
            )}
            {/* ROW */}
            {selectedType !== 'NO_LANDING_PAGE' && (
              <div className='flex flex-row gap-14'>
                <div className='flex flex-1'>
                  <Controller
                    name="isNewTab"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <CheckBox
                        {...field}
                        containerStyle="ml-[200px]"
                        labelTitle={t('user.menu-list.menuList.openInNewTab')}
                        defaultValue={field.value}
                        updateFormValue={e => {
                          field.onChange(e.value);
                        }}
                      />
                    )}
                  />
                </div>
                <div className='flex flex-1'>{/* SPACES */}</div>
              </div>
            )}
            {/* ROW */}
            <div className="flex flex-row gap-14">
              <div className='flex flex-1'>
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
                        inputWidth={400}
                        labelWidth={200}
                        labelTitle="Menu Icon"
                        onChange={onChange}
                        maxSize={2*1024*1024}
                        isDocument={false}
                        multiple={false}
                        border={false}
                        disabled={false}
                        showMaxSize={true}
                        editMode={true}
                        disabledAltText={true}
                        isOptional={true}
                      />
                    );
                  }}
                />
              </div>
              <div className='flex flex-1'>{/* SPACES */}</div>
            </div>
            {/* ROW */}
            <div className="flex flex-row gap-14">
              <div className='flex flex-col flex-1'>
                <Controller
                  name="shortDesc"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea
                      inputWidth={400}
                      labelWidth={200}
                      labelTitle="Short Description"
                      labelStyle="font-bold"
                      direction="row"
                      placeholder="Input Short Description"
                      maxLength={50}
                      {...field}
                    />
                  )}
                />
                <div className="w-full flex justify-end">
                  <p className="text-body-text-3 text-xs mt-2 mr-4">
                    {t('user.menu-list.menuList.maxDescription', { maxChar: 50 })}
                  </p>
                </div>
              </div>
              <div className='flex flex-1'>{/* SPACES */}</div>
            </div>
          </div>

          <div className="mt-[200px] flex justify-end items-end gap-2">
            <button
              className="btn btn-outline text-xs btn-sm w-28 h-10"
              onClick={e => {
                e.preventDefault();
                navigate(`/menu/detail/${id}`, { replace: true });
              }}>
              Cancel
            </button>
            <button className="btn btn-primary text-xs btn-sm w-28 h-10" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </TitleCard>
  );
}
