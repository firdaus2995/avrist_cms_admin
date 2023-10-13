import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import UserOrange from '../../assets/user-orange.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import CancelIcon from '../../assets/cancel.png';
import Radio from '../../components/molecules/Radio';
import DropDown from '../../components/molecules/DropDown';
import FileUploaderAvatar from '@/components/molecules/FileUploaderAvatar';
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
import { useGetDepartmentQuery } from '@/services/Department/departmentApi';
import Typography from '@/components/atoms/Typography';
import { useForm, Controller } from 'react-hook-form';
import FormList from '@/components/molecules/FormList';

export default function UsersEdit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();

  // BACKEND STATE
  const [roleData, setRoleData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
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
  const [departmentId, setDepartmentId] = useState<string | number | boolean>(0);
  const [avatar, setAvatar] = useState('');
  const now = dayjs().format('YYYY-MM-DD');
  // CHANGE STATUS MODAL
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK GET ROLE
  const fetchUserDetailQuery = useGetUserDetailQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  
  // RTK GET ROLE
  const fetchRoleQuery = useGetRoleQuery({});
  const { data: dataRole } = fetchRoleQuery;

  // RTK GET DEPARTMENT
  const fetchDepartmentQuery = useGetDepartmentQuery({});
  const { data: dataDepartment } = fetchDepartmentQuery;  

  // RTK USER DETAIL
  const { data } = fetchUserDetailQuery;

  // RTK EDIT USER
  const [editUser, { isLoading }] = useEditUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (dataRole) {
      const roleList = dataRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setRoleData(roleList);
    }
  }, [dataRole]);

  useEffect(() => {
    if (dataDepartment) {
      const departmentList = dataDepartment?.departmentList?.departments.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setDepartmentData(departmentList);
    };
  }, [dataDepartment]);

  useEffect(() => {
    if (data) {
      const userDetail = data?.userById;
      setUserId(userDetail.userId);
      setFullName(userDetail.fullName);
      setDob(userDetail.dob);
      setGender(userDetail.gender);
      setEmail(userDetail.email);
      setRoleId(userDetail.role.id);
      setDepartmentId(userDetail.department.id);
      setIsActive(userDetail.statusActive);

      const defaultValues = {
        fullName: '',
        dob: '',
        email: '',
        gender: '',
        role: '',
      };
      defaultValues.fullName= userDetail.fullName;
      defaultValues.dob= userDetail.dob;
      defaultValues.email= userDetail.email;
      defaultValues.gender= userDetail.gender;
      defaultValues.role= userDetail.role.id;
      reset({ ...defaultValues });
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
      departmentId,
    };

    editUser(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.users-edit.user.toast-success'),
            message: t('user.users-edit.user.success-msg', {
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
            title: t('user.users-edit.user.toast-failed'),
            message: t('user.users-edit.user.failed-msg', { name: payload.fullName }),
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
    <TitleCard title={t('user.users-edit.user.edit.title')} topMargin="mt-2">
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
      <form className="flex flex-col w-100" onSubmit={handleSubmit((_data: any) => {
          onSave();
        })}>
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
            <div className="max-w-[340px]">
              <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
                {t('user.users-edit.user.edit.fullName')}
                <span className={'text-reddist text-lg'}>{`*`}</span>
              </Typography>
              <Controller
                name="fullName"
                control={control}
                defaultValue={data?.userById?.fullName ?? ""}
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    key="fullName"
                    inputWidth={340}
                    placeholder={t('user.users-edit.user.edit.placeholder-user-fullname')}
                    error={!!errors?.fullName?.message}
                    helperText={errors?.fullName?.message}
                    roundStyle="3xl"
                    border={false}
                    value={fullName}
                    onChange={(e: { target: { value: any } }) => {
                      field.onChange(e.target.value);
                      setFullName(e.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="max-w-[340px]">
              <Controller
                name="dob"
                control={control}
                defaultValue={dob}
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputDate
                    {...field}
                    labelTitle={t('user.users-edit.user.edit.dateOfBirth')}
                    labelStyle="font-bold"
                    labelRequired
                    containerStyle="w-[340px]"
                    error={!!errors?.dob?.message && dob === 'DD-MM-YYYY'}
                    helperText={errors?.dob?.message}
                    max={now}
                    value={dob}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.target.value === '') {
                        setDob("DD-MM-YYYY")
                      }else{
                        setDob(event.target.value);
                      }
                      field.onChange(event.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="max-w-[340px]">
              <Controller
                name="gender"
                control={control}
                defaultValue={gender}
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <Radio
                    {...field}
                    labelTitle={t('user.users-edit.user.edit.gender') ?? ''}
                    labelStyle="font-bold"
                    labelRequired
                    defaultSelected={gender}
                    error={!!errors?.gender?.message && gender === ''}
                    helperText={errors?.gender?.message}
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
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="flex flex-row gap-14">
          <div className="max-w-[340px]">
              <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
                {t('user.users-edit.user.edit.email')}
                <span className={'text-reddist text-lg'}>{`*`}</span>
              </Typography>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: t('components.atoms.required') ?? '',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    key="email"
                    inputWidth={340}
                    error={!!errors?.email?.message}
                    helperText={errors?.email?.message}
                    roundStyle="3xl"
                    placeholder={t('user.users-edit.user.edit.placeholder-user-email')}
                    border={false}
                    value={email}
                    onChange={(e: { target: { value: any } }) => {
                      field.onChange(e.target.value);
                      setEmail(e.target.value);
                    }}
                  />
                )}
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
            <div className="max-w-[340px]">
              <Controller
                name="role"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <DropDown
                    {...field}
                    labelTitle={t('user.users-edit.user.edit.role') ?? ''}
                    labelStyle="font-bold	"
                    labelRequired
                    defaultValue={roleId}
                    items={roleData}
                    onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                      if (event) {
                        field.onChange(value);
                        setRoleId(value);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* ROW 5 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <DropDown
                labelTitle={t('user.users-new.user.add.department') ?? ''}
                labelStyle="font-bold"
                labelRequired
                defaultValue={departmentId}
                labelEmpty={t('user.users-new.user.add.choose-department') ?? ''}
                items={departmentData}
                onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                  if (event) {
                    setDepartmentId(value);
                  }
                }}
              />
            </div>
            <div className="flex flex-1">{/* SPACES */}</div>
            <div className="flex flex-1">{/* SPACES */}</div>
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
              ? t('user.users-edit.user.edit.btn.loading')
              : t('user.users-edit.user.edit.btn.cancel')}
          </button>
          <button
            className="btn btn-success btn-md text-white"
            type='submit'>
            {isLoading
              ? t('user.users-edit.user.edit.btn.loading')
              : t('user.users-edit.user.edit.btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
