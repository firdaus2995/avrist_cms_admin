import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import UserOrange from '../../assets/user-orange.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import Radio from '../../components/molecules/Radio';
import DropDown from '../../components/molecules/DropDown';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useAppDispatch } from '../../store';
import { InputText } from '../../components/atoms/Input/InputText';
import { InputPassword } from '../../components/atoms/Input/InputPassword';
import { InputDate } from '../../components/atoms/Input/InputDate';
import {
  useEditUserMutation,
  useGetRoleQuery,
  useGetUserDetailQuery,
} from '../../services/User/userApi';
import { openToast } from '../../components/atoms/Toast/slice';
import FileUploaderAvatar from '@/components/molecules/FileUploaderAvatar';
import Typography from '../../components/atoms/Typography';
import FormList from '../../components/molecules/FormList';

export default function UsersEdit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [roleData, setRoleData] = useState([]);
  // FORM STATE
  const [id] = useState<any>(Number(params.id));
  const [isActive, setIsActive] = useState<any>(true);
  const [userId, setUserId] = useState<string>('');
  const [password] = useState<string>('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<any>('');
  const [gender, setGender] = useState<string | number | boolean>('');
  const [email, setEmail] = useState<string>('');
  const [company] = useState<string>('Avrist Life Insurance');
  const [roleId, setRoleId] = useState<string | number | boolean>(0);
  const [avatar, setAvatar] = useState('');
  // CHANGE STATUS MODAL
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');
  // LIST STATE
  const [listAttributes] = useState<any>([
    { value: '1', label: 'CMC' },
    { value: '2', label: 'DPLK/Pension' },
    { value: '3', label: 'Syariah' },
    { value: '4', label: 'HR' },
  ]);
  // RTK GET ROLE
  const fetchUserDetailQuery = useGetUserDetailQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const fetchRoleQuery = useGetRoleQuery({});

  // RTK USER DETAIL
  const { data } = fetchUserDetailQuery;
  const { data: fetchedRole } = fetchRoleQuery;

  // RTK EDIT USER
  const [editUser, { isLoading }] = useEditUserMutation();

  useEffect(() => {
    if (fetchedRole) {
      const roleList = fetchedRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setRoleData(roleList);
    }
  }, [fetchedRole]);

  useEffect(() => {
    if (data) {
      const userDetail = data?.userById;
      setUserId(userDetail.userId);
      setFullName(userDetail.fullName);
      setDob(userDetail.dob);
      setGender(userDetail.gender);
      setEmail(userDetail.email);
      setRoleId(userDetail.role.id);
      setIsActive(userDetail.statusActive);
    }
  }, [data]);

  const onSave = () => {
    const payload = {
      id,
      fullName,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      gender: gender === 'FEMALE' ? false : gender === 'MALE' ? true : null,
      email,
      company,
      profilePicture: avatar,
      statusActive: isActive,
      roleId,
    };
    editUser(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.users-edit.users.toast-success'),
            message: t('user.users-edit.user.edit.edit.success-msg', {
              name: d.userUpdate.fullName,
            }),
          }),
        );
        navigate('/user');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.users-edit.users.toast-failed'),
            message: t('roles.edit.failed-msg', { name: payload.fullName }),
          }),
        );
      });
  };

  const changeStatusSubmit = () => {
    setIsActive(false);
    setShowChangeStatusModal(false);
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/user');
  };

  return (
    <TitleCard title={t('user.users-edit.user.edit.edit.title')} topMargin="mt-2">
      <ModalConfirm
        open={showChangeStatusModal}
        cancelAction={() => {
          setShowChangeStatusModal(false);
          setIsActive(true);
        }}
        title={t('user.users-edit.user.edit.edit.modal.inactive-user')}
        cancelTitle={t('user.users-edit.user.edit.edit.btn.cancel')}
        message={t('user.users-edit.user.edit.edit.modal.leave-message') ?? ''}
        submitAction={changeStatusSubmit}
        submitTitle={t('user.users-edit.user.edit.edit.btn.save')}
        icon={UserOrange}
        btnSubmitStyle="btn-warning"
      />
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('user.users-edit.user.edit.edit.btn.cancel')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('user.users-edit.user.edit.edit.btn.save')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form className="flex flex-col w-100">
        <div className="flex items-center justify-center">
          <FileUploaderAvatar
            id={'edit_profile_picture'}
            image={avatar}
            imageChanged={(image: any) => {
              setAvatar(image);
            }}
          />
        </div>
        <div className="flex flex-col mt-[60px] gap-5">
          {/* ROW 1 */}
          <Radio
            labelTitle={t('user.users-edit.user.edit.status') ?? ''}
            labelStyle="font-bold	"
            labelRequired
            defaultSelected={isActive}
            items={[
              {
                value: true,
                label: t('user.users-edit.user.edit.active'),
              },
              {
                value: false,
                label: t('user.users-edit.user.edit.inactive'),
              },
            ]}
            onSelect={(
              event: React.ChangeEvent<HTMLInputElement>,
              value: string | number | boolean,
            ) => {
              if (event) {
                setIsActive(value);
                if (value === false) {
                  setShowChangeStatusModal(true);
                }
              }
            }}
          />
          {/* ROW 2 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText
                labelTitle={t('user.users-edit.user.edit.userId')}
                labelStyle="font-bold	"
                value={userId}
                placeholder={t('user.users-edit.user.edit.placeholder-user-id')}
                disabled
              />
            </div>
            <div className="flex flex-1">
              <InputPassword
                labelTitle={t('user.users-edit.user.edit.password')}
                labelStyle="font-bold	"
                value={password}
                placeholder={t('user.users-edit.user.edit.placeholder-user-password')}
                disabled
              />
            </div>
            <div className="flex flex-1">{/* SPACES */}</div>
          </div>
          {/* ROW 3 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText
                labelTitle={t('user.users-edit.user.edit.fullName')}
                labelStyle="font-bold	"
                labelRequired
                value={fullName}
                placeholder={t('user.users-edit.user.edit.placeholder-user-fullname')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFullName(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <InputDate
                labelTitle={t('user.users-edit.user.edit.dateOfBirth')}
                labelStyle="font-bold	"
                labelRequired
                value={dob}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDob(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <Radio
                labelTitle={t('user.users-edit.user.edit.gender') ?? ''}
                labelStyle="font-bold	"
                labelRequired
                items={[
                  {
                    value: 'MALE',
                    label: t('user.users-edit.user.edit.male'),
                  },
                  {
                    value: 'FEMALE',
                    label: t('user.users-edit.user.edit.female'),
                  },
                ]}
                onSelect={(
                  event: React.ChangeEvent<HTMLInputElement>,
                  value: string | number | boolean,
                ) => {
                  if (event) {
                    setGender(value);
                  }
                }}
                defaultSelected={gender}
              />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText
                labelTitle={t('user.users-edit.user.edit.email')}
                labelStyle="font-bold	"
                labelRequired
                type="email"
                value={email}
                placeholder={t('user.users-edit.user.edit.placeholder-user-email')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <InputText
                labelTitle={t('user.users-edit.user.edit.company')}
                labelStyle="font-bold	"
                value={company}
                disabled
              />
            </div>
            <div className="flex flex-1">
              <DropDown
                labelTitle={t('user.users-edit.user.edit.role') ?? ''}
                labelStyle="font-bold	"
                labelRequired
                defaultValue={roleId}
                items={roleData}
                onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                  if (event) {
                    setRoleId(value);
                  }
                }}
              />
            </div>
          </div>
          {/* ROW 5 */}
          <div className="max-w-[365px]">
            <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
              Department
              <span className={'text-reddist text-lg'}>{`*`}</span>
            </Typography>
            <FormList.DropDown
              key="department"
              labelTitle="Department"
              // defaultValue={}
              // resetValue={}
              // error={}
              // helperText={}
              themeColor="primary"
              items={listAttributes}
              onChange={(e: any) => {
                console.log(e);
              }}
            />
          </div>
        </div>
        <div className="mt-[200px] flex justify-end items-end gap-2">
          <button
            className="btn btn-outline btn-md"
            onClick={(event: any) => {
              event.preventDefault();
              setLeaveTitleModalShow(t('user.users-edit.user.edit.edit.modal.confirmation'));
              setMessageLeaveModalShow(
                t('user.users-edit.user.edit.edit.modal.leave-confirmation'),
              );
              setShowLeaveModal(true);
            }}>
            {isLoading
              ? t('user.users-edit.user.edit.edit.btn.loading')
              : t('user.users-edit.user.edit.edit.btn.cancel')}
          </button>
          <button
            className="btn btn-success btn-md text-white"
            onClick={(event: any) => {
              event.preventDefault();
              onSave();
            }}>
            {isLoading
              ? t('user.users-edit.user.edit.edit.btn.loading')
              : t('user.users-edit.user.edit.edit.btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
