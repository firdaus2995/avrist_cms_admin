// import { useParams } from 'react-router-dom';
// import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useEffect, useState, useCallback } from 'react';
import { InputText } from '../../components/atoms/Input/InputText';
import DropDown from '../../components/molecules/DropDown';
import { CheckBox } from '../../components/atoms/Input/CheckBox';
import { useForm, Controller } from 'react-hook-form';
import FormList from '@/components/molecules/FormList';
import LifeInsurance from '../../assets/lifeInsurance.png';
import SortableTreeComponent from '../../components/atoms/SortableTree';
import {
  useCreateMenuMutation,
  useDeleteMenuMutation,
  useEditMenuMutation,
  useGetMenuListQuery,
  useUpdateMenuStructureMutation,
} from '../../services/Menu/menuApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import Modal from '../../components/atoms/Modal';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import PaperIcon from '../../assets/paper.svg';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { useGetPageManagementListQuery } from '../../services/PageManagement/pageManagementApi';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import RoleRenderer from '../../components/atoms/RoleRenderer';

export default function MenuList() {
  // const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    control,
    formState: { errors },
  } = useForm();

  const maxImageSize = 2 * 1024 * 1024;
  const maxChar = 70;

  const [isAddClick, setIsAddClicked] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openTakedownModal, setOpenTakedownModal] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [idDelete, setIdDelete] = useState('');

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

  const fetchQuery = useGetMenuListQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchQuery;
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [dataScructure, setDataStructure] = useState<any>([]);
  const [dataScructureInit, setDataStructureInit] = useState<any>([]);

  const [createMenu] = useCreateMenuMutation();
  const [editMenu] = useEditMenuMutation();
  const [deleteMenu] = useDeleteMenuMutation();
  const [updateStructure] = useUpdateMenuStructureMutation();

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(10);
  const [direction] = useState('asc');
  const [search] = useState('');
  const [sortBy] = useState('id');
  const [listPage, setListPage] = useState([]);

  // RTK GET DATA
  const fetchQueryPage = useGetPageManagementListQuery({
    pageIndex,
    limit: pageLimit,
    direction,
    search,
    sortBy,
    isArchive: false,
  });

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
      const listData = data?.menuList?.menus;

      const result = listData.map((e: any, i: any) => ({ ...e, children: listData[i].child }));

      setDataStructure(result);
      setDataStructureInit(result);
    }
  }, [data]);

  const onDelete = () => {
    deleteMenu({ id: idDelete, takedownNote })
      .unwrap()
      .then(async d => {
        setOpenTakedownModal(false);
        setTakedownNote('');
        setIsOpenModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: t('user.menu-list.menuList.successDelete'),
            message: d.roleDelete.message,
          }),
        );
        navigate(0);
      })
      .catch(err => {
        console.log(err);
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

  const onEdit = (data: any) => {
    setTitle(data.node.title);
    setEditedTitle(data.node.title);
    setType(data.node.menuType);
    setUrlLink(data.node.externalUrl);
    setPage(data.node.pageId);
    setIsOpenTab(data.node.isNewTab);
    setIdDelete(data.node.pageId);

    setIsOpenModal(true);
    modalEdit();
  };

  const modalEdit = () => {
    return (
      <Modal open={isOpenModal} toggle={() => null} title="" width={840} height={480}>
        <div className="grid grid-cols-2 gap-10 p-4 border-b-2">
          <div className="p-2 absolute right-5 top-5">
            <svg
              role="button"
              onClick={() => {
                setIsOpenModal(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold">
            {t('user.menu-list.menuList.pageTitle')}
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
              {t('user.menu-list.menuList.page')}
              <DropDown
                defaultValue={page}
                items={listPage}
                onSelect={(_e, val) => {
                  setPage(val);
                }}
              />
            </div>
          ) : (
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
          )}
          <p></p>
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
          <div className="place-self-end flex flex-row items-center gap-5">
            <div
              role="button"
              aria-disabled
              onClick={() => {
                setOpenTakedownModal(true);
                setIsTakedown(false);
              }}
              className="py-2 w-30 px-10 bg-white border border-primary rounded-xl flex flex-row gap-2 font-semibold text-primary transition ease-in-out hover:-translate-y-1 delay-150">
              {t('user.menu-list.menuList.takedown')}
            </div>
            <div
              role="button"
              aria-disabled
              onClick={() => {
                onEditMenu();
              }}
              className="py-2 w-28 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white transition ease-in-out hover:-translate-y-1 delay-150">
              {t('user.menu-list.menuList.save')}
            </div>
          </div>
        </div>
      </Modal>
    );
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
        console.log('edited');
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
          console.log('edited');
          setIsOpenModal(false);
          dispatch(
            openToast({
              type: 'success',
              title: t('toast-success'),
            }),
          );
          navigate(0);
        })
        .catch(() => {
          setIsOpenModal(false);
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
      <div className="flex flex-row items-center justify-center gap-4 mb-10">
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
                setType('Page');
                setIsOpenForm(true);
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.page')}
            </div>
            <div
              role="button"
              onClick={() => {
                // setFormData({...formData, type: 'Link'});
                setType('Link');
                setIsOpenForm(true);
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.link')}
            </div>
            <div
              role="button"
              onClick={() => {
                // setFormData({...formData, type: 'No Landing Page'});
                setType('No Landing Page');
                setIsOpenForm(true);
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
                value: 'Page',
                label: 'Page',
              },
              {
                value: 'Link',
                label: 'Link',
              },
              {
                value: 'No Landing Page',
                label: 'No Landing Page',
              },
            ]}
            onSelect={(_e, val) => {
              setType(val);
            }}
          />
        </div>
        {type === 'Page' ? (
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
        ) : type === 'Link' ? (
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
            <div
              role="button"
              aria-disabled
              onClick={() => {
                onCreate();
              }}
              className="py-4 w-28 h-[55px] place-self-end transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.save')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onUpdateDataStructure = () => {
    const data = dataScructure;

    data.forEach(function (obj: { [x: string]: any; child: any; children: any }) {
      if (obj.children) {
        obj.child = obj.children;
        delete obj.children;
      }
      delete obj.expanded;
    });

    // console.log(JSON.stringify(data)); return

    updateStructure({ menuList: data })
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
          }),
        );
        navigate('/menu');
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
          <div className="p-5 text-2xl font-bold mb-5 gap-2 text-primary flex flex-row">
            <img src={LifeInsurance} className="w-8" />
            {t('user.menu-list.menuList.avristLifeInsurance')}
          </div>
          <div className="p-5 text-2xl font-semibold border-b-2 mb-10">
            {t('user.menu-list.menuList.menuStructure')}
          </div>
          {isOpenForm && renderForm()}
          {!isOpenForm && (
            <>
              {dataScructure?.length > 0 && (
                <SortableTreeComponent
                  data={dataScructure}
                  onClick={(data: any) => {
                    onEdit(data);
                  }}
                  onChange={function (_data: any): void {
                    setDataStructure(_data);
                  }}
                />
              )}
              {renderAddButtons()}
            </>
          )}

          <div className="flex justify-end absolute bottom-10 right-10">
            <div className="flex flex-row p-2 gap-2">
              <button
                onClick={() => {
                  setShowCancel(true);
                }}
                className="btn btn-outline text-xs btn-sm w-28 h-10">
                {t('user.menu-list.menuList.cancel')}
              </button>
              <button
                disabled={dataScructure === dataScructureInit}
                onClick={() => {
                  onUpdateDataStructure();
                }}
                className="btn btn-success text-xs btn-sm w-28 h-10">
                {t('user.menu-list.menuList.submit')}
              </button>
            </div>
          </div>
          {modalEdit()}
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
                setIsTakedown(true);
                setOpenTakedownModal(false);
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
                errorText={!takedownNote ? t('user.menu-list.menuList.takedownRequired') || '' : ''}
                onChange={e => {
                  setTakedownNote(e.target.value);
                }}
              />
            </div>
          </ModalConfirm>
        </TitleCard>
      </RoleRenderer>
    </>
  );
}
