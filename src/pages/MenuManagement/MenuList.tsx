import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { t } from 'i18next';

import SortableTreeComponent from '../../components/atoms/SortableTree';
import LifeInsurance from '../../assets/lifeInsurance.png';
import RoleRenderer from '../../components/atoms/RoleRenderer';
import StatusBadge from '@/components/atoms/StatusBadge';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import PaperIcon from '../../assets/paper.svg';
import TimelineLog from '@/assets/timeline-log.svg';
import ModalLog from './components/ModalLog';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate, useParams } from 'react-router-dom';
import { TextArea } from '@/components/atoms/Input/TextArea';
import { TitleCard } from '@/components/molecules/Cards/TitleCard';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import {
  useDeleteMenuMutation,
  useGetMenuListQuery,
  usePublishMenuMutation,
  useUpdateMenuStructureMutation,
} from '../../services/Menu/menuApi';

export default function MenuList () {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const {
    getValues,
    setValue,
    watch,
  }: any = useForm();

  // MENU STATE
  const [groupMenuId] = useState<any>(Number(params.id));
  const [groupMenuName, setGroupMenuName] = useState<string>("");
  const [dataScructure, setDataStructure] = useState<any>([]);
  // ADD MENU STATE
  const [isAddClick, setIsAddClicked] = useState(false);
  // TAKEDOWN MODAL
  const [showTakedownMenuModal, setShowTakedownMenuModal] = useState(false);
  const [noteTakedownModal, setNoteTakedownModal] = useState('');
  const [idTakedownModal, setIdTakedownModal] = useState(0);
  // MENU LOG MODAL
  const [showMenuLogModal, setShowMenuLogModal] = useState(false);

  // RTK GET MENU
  const fetchQuery = useGetMenuListQuery(
    { groupMenuId },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchQuery;

  // RTK UPDATE STRUCTURE
  const [updateStructure] = useUpdateMenuStructureMutation();

  // RTK DELETE MENU
  const [deleteMenu] = useDeleteMenuMutation();

  // RTK PUBLISH MENU
  const [publishMenu] = usePublishMenuMutation();
  
  useEffect(() => {
    watch(['status', 'lastPublishedBy', 'lastPublishedAt']);
  }, [watch]);

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

      setGroupMenuName(data?.menuList?.groupMenuName);
      setDataStructure(recursiveMenuGet(data?.menuList?.menus));

      setValue('status', data?.menuList?.status);
      setValue('lastPublishedBy', data?.menuList?.lastPublishedBy);
      setValue('lastPublishedAt', data?.menuList?.lastPublishedAt);
    }
  }, [data]);

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

    updateStructure({ groupMenuId, menuList: payloadMenuList, menu: payloadMenu })
      .unwrap()
      .then((res: any) => {
        setValue('status', res.menuStructureUpdate.status);
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            message: t(`errors.menu.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const handlerActionMenu = (data: any, action: string | undefined) => {
    if (action === 'EDIT') {
      navigate(`edit/${data?.node?.id}`);
    } else if (action === 'TAKEDOWN') {
      setIdTakedownModal(data?.node?.id);
      setShowTakedownMenuModal(true);
    };
  };

  const handlerTakedownMenu = () => {
    deleteMenu({ groupMenuId, menuId: idTakedownModal, takedownNote: noteTakedownModal })
      .unwrap()
      .then(async (res: any) => {
        setShowTakedownMenuModal(false);
        setNoteTakedownModal('');
        dispatch(
          openToast({
            type: 'success',
            title: t('user.menu-list.menuList.successDelete'),
            message: res.roleDelete?.message ?? '',
          }),
        );
        await fetchQuery.refetch();
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.menu-list.menuList.failedDelete'),
            message: !noteTakedownModal
              ? t('user.menu-list.menuList.toastTakedownRequired')
              : t(`errors.menu.${errorMessageTypeConverter(error.message)}`)
          }),
        );
      });
  };

  const handlerPublishMenu = () => {
    publishMenu({ groupMenuId })
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
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.menu.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  };

  const renderAddButtons = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-4">
        {!isAddClick ? (
          <div
            role="button"
            onClick={() => {
              setIsAddClicked(true);
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
                navigate('new', { state: { pageType: 'PAGE' } });
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.page')}
            </div>
            <div
              role="button"
              onClick={() => {
                navigate('new', { state: { pageType: 'LINK' } });
              }}
              className="py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white">
              {t('user.menu-list.menuList.link')}
            </div>
            <div
              role="button"
              onClick={() => {
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

  return (
    <>
      <RoleRenderer allowedRoles={['MENU_READ']}>
        <TitleCard title="">
          <ModalConfirm
            open={showTakedownMenuModal}
            cancelAction={() => {
              setShowTakedownMenuModal(false);
              setNoteTakedownModal('');
            }}
            modalWidth={600}
            modalHeight={'100%'}
            title={t('user.menu-list.menuList.takedownTitle')}
            titleSize={18}
            cancelTitle={t('user.menu-list.menuList.cancel')}
            submitAction={() => {
              if (noteTakedownModal.length > 0) {
                handlerTakedownMenu();
              } else {
                dispatch(
                  openToast({
                    type: 'error',
                    title: t('user.menu-list.menuList.failedDelete'),
                    message: t('user.menu-list.menuList.toastTakedownRequired'),
                  }),
                );
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
                value={noteTakedownModal}
                containerStyle="rounded-3xl"
                isError={!noteTakedownModal}
                helperText={
                  !noteTakedownModal ? t('user.menu-list.menuList.takedownRequired') ?? '' : ''
                }
                onChange={e => {
                  setNoteTakedownModal(e.target.value);
                }}
              />
            </div>
          </ModalConfirm>
          <ModalLog
            id={groupMenuId}
            open={showMenuLogModal}
            toggle={() => {
              setShowMenuLogModal(!showMenuLogModal);
            }}
            title={'Activity Log - Menu Management'}
          />

          <div className="flex flex-col gap-10">
            <div className="text-2xl font-bold gap-2 text-primary flex flex-row">
              <img src={LifeInsurance} className="w-8" />
              {t('user.menu-list.menuList.avristLifeInsurance')}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center">
                <div className="text-2xl font-semibold ">
                  {groupMenuName}
                </div>
                <div
                  className="cursor-pointer tooltip"
                  data-tip="Log"
                  onClick={() => {
                    setShowMenuLogModal(true);
                  }}>
                  <img src={TimelineLog} className="w-6 h-6" />
                </div>
                <StatusBadge status={getValues('status') ?? ''} />
              </div>
              <hr />
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
            </div>
            {dataScructure?.length > 0 && (
              <SortableTreeComponent
                data={dataScructure}
                onClick={(data: any, action: string | undefined) => {
                  handlerActionMenu(data, action);
                }}
                onChange={function (node: any, data: any): void {
                  handlerUpdateMenuStructure(node, data);
                }}
              />
            )}
            {renderAddButtons()}
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
          </div>
        </TitleCard>
      </RoleRenderer>
    </>
  );
}
