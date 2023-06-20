// import { useParams } from 'react-router-dom';
// import { TitleCard } from '../../components/molecules/Cards/TitleCard';
// import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { InputText } from '../../components/atoms/Input/InputText';
import DropDown from '../../components/molecules/DropDown';
import { CheckBox } from '../../components/atoms/Input/CheckBox';
import LifeInsurance from '../../assets/lifeInsurance.png';
import SortableTreeComponent from '../../components/atoms/SortableTree';
import { useCreateMenuMutation, useDeleteMenuMutation, useEditMenuMutation, useGetMenuListQuery, useUpdateMenuStructureMutation } from '../../services/Menu/menuApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { useNavigate } from 'react-router-dom';
import { 
    t,
  } from "i18next";
import Modal from '../../components/atoms/Modal';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';
import WarningIcon from "../../assets/warning.png";
import CancelIcon from "../../assets/cancel.png";
import { useGetPageManagementListQuery } from '../../services/PageManagement/pageManagementApi';

export default function MenuList() {
  // const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isAddClick, setIsAddClicked] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [showComfirm, setShowComfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState('');
  const [messageConfirm, setmessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState('');

  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [page, setPage] = useState<any | null>('');
  const [type, setType] = useState<any | null>('');
  const [isOpenTab, setIsOpenTab] = useState(false);
  const [urlLink, setUrlLink] = useState('');

  const fetchQuery = useGetMenuListQuery({}, {
    refetchOnMountOrArgChange: true,
  });
  const {data} = fetchQuery;
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [dataScructure, setDataStructure] = useState<any>([]);
  const [dataScructureInit, setDataStructureInit] = useState<any>([]);

  const [ createMenu ] = useCreateMenuMutation();
  const [ editMenu ] = useEditMenuMutation();
  const [ deleteMenu ] = useDeleteMenuMutation();
  const [ updateStructure ] = useUpdateMenuStructureMutation();

  // TABLE PAGINATION STATE
  const [pageIndex] = useState(0);
  const [pageLimit] = useState(5);
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

    const listData = data?.map((val: { id: any; title: any; }) => {
      const list = {
        'value': val.id,
        'label': val.title
      }

      return list;
    })

    setListPage(listData)
  }, [fetchQueryPage])
  
  useEffect(() => {
    void fetchQuery.refetch()
  }, [])

  useEffect(() => {
    if(data){
      const listData = data?.menuList?.menus;

      const result = listData.map((e: any, i: any) => ({...e, "children":listData[i].child}));

      setDataStructure(result)
      setDataStructureInit(result)
    }
  }, [data])

  const onConfirm = (id: string) => {
    setIdDelete(id);
    setTitleConfirm('Are you sure?');
    setmessageConfirm(`Do you want to delete menu ${id}? \n Once you delete this menu, this menu won't be recovered`);
    setShowComfirm(true);
  };

  const onDelete = () => {
    deleteMenu({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowComfirm(false);
        setIsOpenModal(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success delete',
            message: d.roleDelete.message,
          }),
        );
        navigate(0);
      })
      .catch(err => {
        setShowComfirm(false);
        setIsOpenModal(false);

        console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: 'Gagal delete',
            message: 'Oops gagal delete',
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

    setIsOpenModal(true);
    modalEdit()
  }

  const modalEdit = () => {
    return (
        <Modal open={isOpenModal} toggle={() => null} title="" width={840} height={480}>
            <div className='grid grid-cols-2 gap-10 p-4 border-b-2'>
                <div className='p-2 absolute right-5 top-5'>
                    <svg 
                        role='button'
                        onClick={() => { setIsOpenModal(false); }}
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
                Page Title
                <InputText 
                    labelTitle='' 
                    value={title}
                    inputStyle='rounded-3xl' 
                    onChange={(e) => { setTitle(e.target.value); }} />
                </div>
                <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
                Type
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
                    ]}
                    onSelect={(_e, val) => { setType(val); }}
                />
                </div>
                {type === 'PAGE' ? (
                <div className='flex flex-row whitespace-nowrap items-center gap-20 text-lg font-bold'>
                    Page
                    <DropDown
                    defaultValue={page}
                    items={listPage}
                    onSelect={(_e, val) => { setPage(val); }}
                    />
                </div>
                ) : (
                <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
                    URL Link
                    <InputText 
                    labelTitle='' 
                    value={urlLink}
                    inputStyle='rounded-3xl' 
                    onChange={(e) => { setUrlLink(e.target.value); }} />
                </div>
                )}
                <p></p>
                <div className='w-40 ml-28'>
                <CheckBox
                    defaultValue={isOpenTab}
                    updateFormValue={(e) => { setIsOpenTab(e.value); } }
                    labelTitle='Open in New Tab' updateType={''} />
                </div>
                <div className='place-self-end flex flex-row items-center gap-5 transition ease-in-out hover:-translate-y-1 delay-150'>
                    <svg 
                        role='button'
                        onClick={() => {onConfirm(editedTitle)}}
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6 text-red-500">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>

                    <div 
                        role='button'
                        aria-disabled
                        onClick={() => {
                            onEditMenu();
                        }}
                        className='py-2 w-28  px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
                        Save
                    </div>
                </div>
            </div>
        </Modal>
    )
  }

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
        console.log('edited')
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
          console.log('edited')
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
  }

  const renderAddButtons = () => {
    return (
      <div className='flex flex-row items-center justify-center gap-4 mb-10'>
        {!isAddClick ? (
          <div 
            role='button'
            onClick={() => { 
              setIsAddClicked(true); 
              clearForm();
            }}
            className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Pages
          </div>
        ): (
          <>
            <div 
              role='button'
              onClick={() => { 
                // setFormData({...formData, type: 'Page'});
                setType('Page');
                setIsOpenForm(true);
               }}
              className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
              Pages
            </div>
            <div 
              role='button'
              onClick={() => { 
                // setFormData({...formData, type: 'Link'});
                setType('Link');
                setIsOpenForm(true);
              }}
              className='py-4 transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
              Links
            </div>
          </>
        )}
      </div>
    )
  }

  const renderForm = () => {
    return (
      <div className='grid grid-cols-2 gap-10 p-4 border-b-2'>
        <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
          <span className={`label-text text-base-content`}>Page Title<span className={'text-reddist text-lg'}>*</span></span>
          <InputText 
            labelTitle='' 
            value={title}
            inputStyle='rounded-3xl' 
            onChange={(e) => { setTitle(e.target.value); }} />
        </div>
        <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
          Type
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
            ]}
            onSelect={(_e, val) => { setType(val); }}
          />
        </div>
        {type === 'Page' ? (
          <div className='flex flex-row whitespace-nowrap items-center gap-20 text-lg font-bold'>
            <span className={`label-text text-base-content`}>Page<span className={'text-reddist text-lg'}>*</span></span>
            <DropDown
              defaultValue={page}
              items={listPage}
              onSelect={(_e, val) => { setPage(val); }}
            />
          </div>
        ) : (
          <div className='flex flex-row whitespace-nowrap items-center gap-10 text-lg font-bold'>
            URL Link
            <InputText 
              labelTitle='' 
              value={urlLink}
              inputStyle='rounded-3xl' 
              onChange={(e) => { setUrlLink(e.target.value); }} />
          </div>
        )}
        <p></p>
        <div className='w-40 ml-28'>
          <CheckBox
            defaultValue={isOpenTab}
            updateFormValue={(e) => { setIsOpenTab(e.value); } }
            labelTitle='Open in New Tab' updateType={''} />
        </div>
        <div 
          role='button'
          aria-disabled
          onClick={() => {
            onCreate();
          }}
          className='py-4 w-28 place-self-end transition ease-in-out hover:-translate-y-1 delay-150 px-10 bg-primary rounded-xl flex flex-row gap-2 font-semibold text-white'>
          Save
        </div>
      </div>
    )
  }

  const onUpdateDataStructure = () => {
    const data = dataScructure;

    data.forEach(function(obj: {
        [x: string]: any; child: any; children: any; 
    }) {
        if (obj.children) {
            obj.child = obj.children;
            delete obj.children;
        }
        delete obj.expanded;
    });

    // console.log(JSON.stringify(data)); return

  updateStructure({menuList: data})
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
      {/* <TitleCard title='Avrist Life Insurance' topMargin="mt-2">
      </TitleCard> */}
      <div className='p-5 text-2xl font-bold mb-5 gap-2 text-primary flex flex-row'>
        <img src={LifeInsurance} className='w-8' />
        Avrist Life Insurance
      </div>
      <div className='p-5 text-2xl font-semibold border-b-2 mb-10'>
        Menu Structure
      </div>
      {isOpenForm && renderForm()}
      {!isOpenForm && (
        <>
          {dataScructure?.length > 0 && (
            <SortableTreeComponent 
                data={dataScructure} 
                onClick={(data: any) => { onEdit(data); }} 
                onChange={function (_data: any): void {
                    setDataStructure(_data)
                } } 
            />
          )}
          {renderAddButtons()}
        </>
      )}

      {dataScructure !== dataScructureInit && (
        <div className='flex justify-end absolute bottom-10 right-10'>
          <div className='flex flex-row p-2 gap-2'>
            <button
              onClick={() => {
                setShowCancel(true);
              }}
              className="btn btn-outline text-xs btn-sm w-28 h-10">
              Cancel
            </button>
            <button
              onClick={() => {
                onUpdateDataStructure();
              }}
              className="btn btn-success text-xs btn-sm w-28 h-10">
              Submit
            </button>
          </div>
        </div>
      )}
      {modalEdit()}
      <ModalConfirmLeave
        open={showComfirm}
        cancelAction={() => {
          setShowComfirm(false);
        } }
        title={titleConfirm}
        cancelTitle="Cancel"
        message={messageConfirm}
        submitAction={onDelete}
        submitTitle="Yes"
        icon={WarningIcon} btnType={''}      />
      <ModalConfirmLeave
        open={showCancel}
        cancelAction={() => {
          setShowCancel(false);
        } }
        title={"Are you sure?"}
        cancelTitle="Cancel"
        message={"Do you want to cancel all of the process?"}
        submitAction={() => {navigate(0);}}
        submitTitle="Yes"
        icon={CancelIcon} btnType={'btn-warning'}      />
    </>
  );
}
