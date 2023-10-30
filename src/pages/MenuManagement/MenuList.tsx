import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import { t } from 'i18next';

import SortableTreeComponent from '../../components/atoms/SortableTree';
import FormList from '@/components/molecules/FormList';
import LifeInsurance from '../../assets/lifeInsurance.png';
import DropDown from '../../components/molecules/DropDown';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import StatusBadge from '@/components/atoms/StatusBadge';
// import Modal from '../../components/atoms/Modal';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import PaperIcon from '../../assets/paper.svg';
import TimelineLog from '@/assets/timeline-log.svg';
import ModalLog from './components/ModalLog';
import { InputText } from '../../components/atoms/Input/InputText';
import { CheckBox } from '../../components/atoms/Input/CheckBox';
import { useForm, Controller } from 'react-hook-form';
import {
  useCreateMenuMutation,
  useDeleteMenuMutation,
  useEditMenuMutation,
  useGetMenuListQuery,
  usePublishMenuMutation,
  useUpdateMenuStructureMutation,
} from '../../services/Menu/menuApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { useGetPageManagementListQuery } from '../../services/PageManagement/pageManagementApi';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';

export default function MenuList() {
  // const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const now = dayjs().format('YYYY-MM-DD');

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  }: any = useForm();

  const maxImageSize = 2 * 1024 * 1024;
  const maxChar = 50;

  const [isAddClick, setIsAddClicked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openTakedownModal, setOpenTakedownModal] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [idDelete, setIdDelete] = useState(0);

  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [page, setPage] = useState<any | null>('');
  const [type, setType] = useState<any | null>('');
  const [isOpenTab, setIsOpenTab] = useState(false);
  const [urlLink, setUrlLink] = useState('');
  const [, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [takedownNote, setTakedownNote] = useState('');
  const [isTakedown, setIsTakedown] = useState(false);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [dataScructure, setDataStructure] = useState<any>([]);

  // PAGE TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [listPage, setListPage] = useState([]);
  const [filterBy] = useState('CREATED_AT');
  const [startDate] = useState(now);
  const [endDate] = useState(now);

  // RTK GET MENU
  const fetchQuery = useGetMenuListQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchQuery;

  // RTK GET PAGE
  const fetchQueryPage = useGetPageManagementListQuery({
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

  // RTK CREATE MENU
  const [createMenu] = useCreateMenuMutation();

  // RTK EDIT MENU
  const [editMenu] = useEditMenuMutation();

  // RTK DELETE MENU
  const [deleteMenu] = useDeleteMenuMutation();

  // RTK UPDATE STRUCTURE
  const [updateStructure] = useUpdateMenuStructureMutation();

  // RTK PUBLISH MENU
  const [publishMenu] = usePublishMenuMutation();

  useEffect(() => {
    watch(['status', 'lastPublishedBy', 'lastPublishedAt']);
  }, [watch]);

  useEffect(() => {
    const data = fetchQueryPage?.data?.pageList?.pages;
    const listData = data?.map((val: { id: any; title: any }) => {
      const list = {
        value: val.id,
        label: val.title,
      };

      return list;
    });
    setListPage(listData);
  }, [fetchQueryPage]);

  useEffect(() => {
    void fetchQuery.refetch();
  }, []);

  useEffect(() => {
    if (data) {
      function recursiveMenuGet(recurData: any) {
        const masterPayload: any = [];

        for (let i = 0; i < recurData.length; i++) {
          masterPayload.push({
            ...recurData[i],
            ...(recurData[i].child
              ? {
                  child: recursiveMenuGet(recurData[i].child),
                  children: recursiveMenuGet(recurData[i].child),
                  expanded: true,
                }
              : {
                  child: null,
                  children: null,
                  expanded: false,
                }),
          });
        }

        return masterPayload;
      }

      const listData = data?.menuList?.menus;

      setDataStructure(recursiveMenuGet(listData));

      setValue('status', data?.menuList.status);
      setValue('lastPublishedBy', data?.menuList?.lastPublishedBy);
      setValue('lastPublishedAt', data?.menuList?.lastPublishedAt);
    }
  }, [data]);

  const onDelete = () => {
    deleteMenu({ id: idDelete, takedownNote })
      .unwrap()
      .then(async d => {
        setOpenTakedownModal(false);
        setTakedownNote('');
        setIsEdit(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.menu-list.menuList.successDelete'),
            message: d.roleDelete?.message || '',
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(_err => {
        // console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: t('user.menu-list.menuList.failedDelete'),
            message: !takedownNote
              ? t('user.menu-list.menuList.toastTakedownRequired')
              : t('user.menu-list.menuList.toastFailed'),
          }),
        );
      });
  };

  function clearForm() {
    setTitle('');
    setPage('');
    setType('');
    setIsOpenTab(false);
  }

  const onEdit = (data: any, action: string | undefined) => {
    setTitle(data?.node?.title);
    setEditedTitle(data?.node?.title);
    setType(data?.node?.menuType);
    setUrlLink(data?.node?.externalUrl);
    setPage(data?.node?.pageId);
    setIsOpenTab(data?.node?.isNewTab);
    setIdDelete(data?.node?.id);

    if (action === 'EDIT') {
      navigate(`edit/${data?.node?.id}`);
      setIsEdit(true);
      setIsOpenForm(true);
    }
    if (action === 'TAKEDOWN') {
      setOpenTakedownModal(true);
    }
  };

  const onCreate = () => {
    const payload = {
      title,
      menuType: type,
      externalUrl: urlLink,
      isNewTab: isOpenTab,
      pageId: page,
    };
    createMenu(payload)
      .unwrap()
      .then(() => {
        // console.log('edited');
        setIsOpenForm(false);
        setIsAddClicked(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
          }),
        );
        navigate(0);
      })
      .catch(() => {
        setIsOpenForm(false);
        setIsAddClicked(false);
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
          }),
        );
      });
  };

  function onEditMenu() {
    if (!isTakedown) {
      const payload = {
        title,
        editedTitle,
        menuType: type,
        externalUrl: urlLink,
        isNewTab: isOpenTab,
        pageId: page,
      };
      editMenu(payload)
        .unwrap()
        .then(async () => {
          // console.log('edited');
          setIsEdit(false);
          dispatch(
            openToast({
              type: 'success',
              title: t('toast-success'),
            }),
          );
          navigate(0);
        })
        .catch(() => {
          setIsEdit(false);
          dispatch(
            openToast({
              type: 'error',
              title: t('toast-failed'),
            }),
          );
        });
    } else {
      onDelete();
    }
  }

  const renderAddButtons = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-4">
        {!isAddClick ? (
          <div
            role="button"
            onClick={() => {
              setIsAddClicked(true);
              clearForm();
            }}
            className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('user.menu-list.menuList.addPages')}
          </div>
        ) : (
          <>
            <div
              role="button"
              onClick={() => {
                // setFormData({...formData, type: 'Page'});
                // setType('PAGE');
                // setIsOpenForm(true);
                navigate('new', { state: { pageType: 'PAGE' } });
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.page')}
            </div>
            <div
              role="button"
              onClick={() => {
                // setFormData({...formData, type: 'Link'});
                // setType('LINK');
                // setIsOpenForm(true);
                navigate('new', { state: { pageType: 'LINK' } });
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.link')}
            </div>
            <div
              role="button"
              onClick={() => {
                // setFormData({...formData, type: 'No Landing Page'});
                // setType('NO_LANDING_PAGE');
                // setIsOpenForm(true);
                navigate('new', { state: { pageType: 'NO_LANDING_PAGE' } });
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.noLandingPage')}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="grid grid-cols-2 gap-10 p-4 border-b-2">
        <div className="flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold">
          <span className={`label-text text-base-content`}>
            {t('user.menu-list.menuList.pageTitle')}
            <span className={'text-reddist text-lg'}>*</span>
          </span>
          <InputText
            labelTitle=""
            value={title}
            inputStyle="rounded-3xl"
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold">
          {t('user.menu-list.menuList.type')}
          <DropDown
            defaultValue={type}
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
            onSelect={(_e, val) => {
              setType(val);
            }}
          />
        </div>
        {type === 'PAGE' ? (
          <div className="flex flex-row whitespace-nowrap items-center gap-20 text-lg font-bold">
            <span className={`label-text text-base-content`}>
              {t('user.menu-list.menuList.page')}
              <span className={'text-reddist text-lg'}>*</span>
            </span>
            <DropDown
              defaultValue={page}
              items={listPage}
              onSelect={(_e, val) => {
                setPage(val);
              }}
            />
          </div>
        ) : type === 'LINK' ? (
          <div>
            <div className="flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold">
              {t('user.menu-list.menuList.urlLink')}
              <InputText
                labelTitle=""
                value={urlLink}
                inputStyle="rounded-3xl"
                onChange={e => {
                  setUrlLink(e.target.value);
                }}
              />
            </div>
            <div className="w-40 ml-28">
              <CheckBox
                defaultValue={isOpenTab}
                updateFormValue={e => {
                  setIsOpenTab(e.value);
                }}
                labelTitle={t('user.menu-list.menuList.openInNewTab')}
                updateType={''}
              />
            </div>
          </div>
        ) : (
          <span></span>
        )}
        <span></span>
        <div className={`w-full mb-32 ${type === 'No Landing Page' ? '-mt-5' : ''}`}>
          <div className="flex flex-row whitespace-nowrap justify-between gap-6">
            <span className="flex flex-col gap-1">
              <span className="text-lg font-bold">{t('user.menu-list.menuList.menuIcon')}</span>
              <span className="font-normal">({t('user.menu-list.menuList.optional')})</span>
            </span>
            <div className="w-full h-full">
              <Controller
                key="imagePreview"
                name="imagePreview"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: false,
                    message: t('user.page-template-new.form.imagePreview.required-message'),
                  },
                }}
                render={({ field }) => {
                  const onChange = useCallback((e: any) => {
                    setImageUrl(e.replace(/"/g, '\\"'));
                    field.onChange({ target: { value: e } });
                  }, []);
                  return (
                    <FormList.FileUploaderV2
                      {...field}
                      key="imagePreview"
                      isDocument={false}
                      multiple={false}
                      error={!!errors?.imagePreview?.message}
                      helperText={errors?.imagePreview?.message}
                      onChange={onChange}
                      border={false}
                      disabled={false}
                      maxSize={maxImageSize}
                      showMaxSize={true}
                      editMode={true}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between mt-10">
            <span className="flex flex-col gap-1 pt-3">
              <span className="text-lg font-bold">{t('user.menu-list.menuList.description')}</span>
            </span>
            <div className="w-full">
              <TextArea
                name="shortDesc"
                labelTitle={''}
                value={description}
                placeholder={t('user.menu-list.menuList.descriptionPlaceholder') ?? ''}
                containerStyle="rounded-3xl"
                onChange={e => {
                  e.target.value.length <= maxChar
                    ? setDescription(e.target.value)
                    : e.preventDefault();
                }}
              />
              <div className="w-full flex justify-end">
                <p className="text-body-text-3 text-xs mt-2">
                  {t('user.menu-list.menuList.maxDescription', { maxChar })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end my-10">
          <div className="flex flex-row gap-2">
            {isEdit ? (
              <div
                role="button"
                aria-disabled
                onClick={() => {
                  setOpenTakedownModal(true);
                  setIsTakedown(false);
                }}
                className="py-4 w-30 h-[55px] place-self-end transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-white rounded-xl flex flex-row gap-2 font-semibold text-primary border border-primary">
                {t('user.menu-list.menuList.takedown')}
              </div>
            ) : null}

            <div
              role="button"
              aria-disabled
              onClick={() => {
                isEdit ? onEditMenu() : onCreate();
              }}
              className="py-4 w-28 h-[55px] place-self-end transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.save')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlerUpdateMenuStructure = (node: any, data: any) => {
    function recursiveMenuGenerator(recurData: any, recurParentId: any): any {
      const masterPayload: any = [];

      for (let i = 0; i < recurData.length; i++) {
        if (payloadMenu.id === recurData[i].id) {
          payloadMenu.order = i;
          payloadMenu.parentId = recurParentId;
        }

        masterPayload.push({
          id: recurData[i].id,
          title: recurData[i].title ?? null,
          menuType: recurData[i].menuType ?? null,
          externalUrl: recurData[i].externalUrl ?? null,
          isNewTab: recurData[i].isNewTab ?? false,
          pageId: recurData[i].pageId ?? null,
          order: i,
          parentId: recurParentId,
          child:
            recurData[i]?.children?.length > 0
              ? recursiveMenuGenerator(recurData[i].children, recurData[i].id)
              : null,
        });
      }

      return masterPayload;
    }

    const payloadMenu: any = {
      id: node.id,
      title: node.title ?? null,
      menuType: node.menuType ?? null,
      externalUrl: node.externalUrl ?? null,
    };

    const payloadMenuList: any = recursiveMenuGenerator(data, null);

    updateStructure({ menuList: payloadMenuList, menu: payloadMenu })
      .unwrap()
      .then((res: any) => {
        setValue('status', res.menuStructureUpdate.status);
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

  const handlerPublishMenu = () => {
    publishMenu({})
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
          }),
        );
        setValue('status', 'PUBLISHED');
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
    <>
      <RoleRenderer allowedRoles={['MENU_READ']}>
        <TitleCard title="">
          <ModalConfirm
            open={showCancel}
            cancelAction={() => {
              setShowCancel(false);
            }}
            title={t('user.menu-list.menuList.confirmCancelTitle')}
            cancelTitle={t('user.menu-list.menuList.no')}
            message={t('user.menu-list.menuList.confirmCancelMessage') ?? ''}
            submitAction={() => {
              navigate(0);
            }}
            submitTitle={t('user.menu-list.menuList.yes')}
            icon={CancelIcon}
            btnSubmitStyle={'btn-warning'}
          />

          <div className="flex flex-col gap-10">
            {!isEdit ? (
              <div className="text-2xl font-bold gap-2 text-primary flex flex-row">
                <img src={LifeInsurance} className="w-8" />
                {t('user.menu-list.menuList.avristLifeInsurance')}
              </div>
            ) : null}
            <div className="flex flex-col gap-4">
              {!isEdit ? (
                <div className="flex flex-row gap-3 items-center">
                  <div className="text-2xl font-semibold ">
                    {t('user.menu-list.menuList.menuStructure')}
                  </div>
                  <div
                    className="cursor-pointer tooltip"
                    data-tip="Log"
                    onClick={() => {
                      setOpenLogModal(true);
                    }}>
                    <img src={TimelineLog} className="w-6 h-6" />
                  </div>
                  <StatusBadge status={getValues('status') ?? ''} />
                </div>
              ) : (
                <div className="text-2xl font-semibold ">
                  {t('user.menu-list.menuList.menuEdit')}
                </div>
              )}

              <hr />
              {!isEdit ? (
                <div className="flex">
                  <div className="text-sm">
                    <span>{`Last Published by `}</span>
                    <span className="font-bold">{getValues('lastPublishedBy')}</span>
                    <span>{` at `}</span>
                    <span className="font-bold">
                      {dayjs(getValues('lastPublishedAt')).format('DD/MM/YYYY')} -{' '}
                      {dayjs(getValues('lastPublishedAt')).format('HH:mm')}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            {isOpenForm && renderForm()}
            {!isOpenForm && (
              <>
                {dataScructure?.length > 0 && (
                  <SortableTreeComponent
                    data={dataScructure}
                    onClick={(data: any, action: string | undefined) => {
                      onEdit(data, action);
                    }}
                    onChange={function (node: any, data: any): void {
                      handlerUpdateMenuStructure(node, data);
                    }}
                  />
                )}
                {renderAddButtons()}
              </>
            )}
            <div className="mt-[200px] flex justify-end items-center">
              <div className="flex flex-row p-2 gap-2">
                <button
                  className="btn btn-success text-xs btn-sm w-28 h-10"
                  onClick={() => {
                    handlerPublishMenu();
                  }}
                  disabled={getValues('status') === 'PUBLISHED' && true}>
                  {t('user.menu-list.menuList.submit')}
                </button>
              </div>
            </div>
            {/* {modalEdit()} */}
            <ModalConfirm
              open={openTakedownModal}
              cancelAction={() => {
                setOpenTakedownModal(false);
                setIsTakedown(false);
                setTakedownNote('');
              }}
              modalWidth={600}
              modalHeight={'100%'}
              title={t('user.menu-list.menuList.takedownTitle')}
              titleSize={18}
              cancelTitle={t('user.menu-list.menuList.cancel')}
              submitAction={() => {
                if (takedownNote.length > 0) {
                  if (isEdit) {
                    setIsTakedown(true);
                    setOpenTakedownModal(false);
                  } else {
                    onDelete();
                  }
                } else {
                  dispatch(
                    openToast({
                      type: 'error',
                      title: t('user.menu-list.menuList.failedDelete'),
                      message: t('user.menu-list.menuList.toastTakedownRequired'),
                    }),
                  );
                  setIsTakedown(false);
                }
              }}
              submitTitle={t('user.menu-list.menuList.submit')}
              icon={PaperIcon}
              iconSize={26}
              btnSubmitStyle={'bg-secondary-warning border border-tertiary-warning'}>
              <div className="w-full px-10">
                <TextArea
                  name="TakedownComment"
                  labelTitle={t('user.menu-list.menuList.takedownComment')}
                  labelRequired
                  value={takedownNote}
                  containerStyle="rounded-3xl"
                  isError={!takedownNote}
                  helperText={
                    !takedownNote ? t('user.menu-list.menuList.takedownRequired') ?? '' : ''
                  }
                  onChange={e => {
                    setTakedownNote(e.target.value);
                  }}
                />
              </div>
            </ModalConfirm>
          </div>
          <ModalLog
            id={0}
            open={openLogModal}
            toggle={() => {
              setOpenLogModal(!openLogModal);
            }}
            title={'Activity Log - Menu Management'}
          />
        </TitleCard>
      </RoleRenderer>
    </>
  );
}
