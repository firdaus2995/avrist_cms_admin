import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

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
import { useEditUserMutation, useGetRoleQuery, useGetUserDetailQuery } from '../../services/User/userApi';
import { openToast } from '../../components/atoms/Toast/slice';
import { useGetDepartmentQuery } from '@/services/Department/departmentApi';
import { errorMessageTypeConverter } from '@/utils/logicHelper';

export default function UsersEdit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  // BACKEND STATE
  const [roleData, setRoleData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  // FORM STATE
  const [id] = useState<any>(Number(params.id));
  const [isActive, setIsActive] = useState<any>(true);
  const [avatar, setAvatar] = useState('');
  const now = dayjs().format('YYYY-MM-DD');
  // CHANGE STATUS MODAL
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');

  // RTK GET USER DETAIL
  const fetchUserDetailQuery = useGetUserDetailQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data } = fetchUserDetailQuery;

  // RTK GET ROLE
  const fetchRoleQuery = useGetRoleQuery({});
  const { data: dataRole } = fetchRoleQuery;

  // RTK GET DEPARTMENT
  const fetchDepartmentQuery = useGetDepartmentQuery({});
  const { data: dataDepartment } = fetchDepartmentQuery;  

  // RTK EDIT USER
  const [editUser, { isLoading }] = useEditUserMutation();

  useEffect(() => {
    if (dataRole) {
      const roleList = dataRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setRoleData(roleList);
    };
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

      setIsActive(userDetail.statusActive);

      const defaultValues: any = {};

      defaultValues.userId= userDetail.userId;
      defaultValues.fullName= userDetail.fullName;
      defaultValues.dob= userDetail.dob;
      defaultValues.gender= userDetail.gender;
      defaultValues.email= userDetail.email;
      defaultValues.departmentId = userDetail.department.id;
      defaultValues.roleId = userDetail.role.id;

      reset({ ...defaultValues });
    };
  }, [data]);

  const onSubmit = (data: any) => {
    const payload = {
      id,
      fullName: data?.fullName,
      dob: dayjs(data?.dob).format('YYYY-MM-DD'),
      gender: data?.gender === 'FEMALE' ? false : data?.gender === 'MALE' ? true : null,
      email: data?.email,
      company: data?.company,
      profilePicture: avatar,
      statusActive: isActive,
      roleId: data?.roleId,
      departmentId: data?.departmentId,
    };

    editUser(payload)
      .unwrap()
      .then(() => {
        dispatch(
          openToast({
            type: 'success',
            title: t('user.users-edit.user.toast-success'),
            message: t('user.users-edit.user.success-msg'),
          }),
        );
        navigate('/user');
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('user.users-edit.user.toast-failed'),
            message: t(`errors.user.${errorMessageTypeConverter(error.message)}`),
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
        title={t('user.users-edit.user.edit.modal.inactive-user')}
        cancelTitle={t('user.users-edit.user.edit.btn.cancel')}
        message={t('user.users-edit.user.edit.modal.inactive-user-message') ?? ''}
        submitAction={changeStatusSubmit}
        submitTitle={t('user.users-edit.user.edit.btn.save')}
        icon={UserOrange}
        btnSubmitStyle="btn-warning"
      />
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('user.users-edit.user.edit.btn.cancel')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('user.users-edit.user.edit.btn.save')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form className="flex flex-col w-100" onSubmit={handleSubmit(onSubmit)}>
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
            <div className='flex flex-1'>
              <Controller
                name='userId'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    labelTitle={t('user.users-new.user.add.user-id')}
                    labelStyle="font-semibold"
                    roundStyle="xl"
                    disabled
                    placeholder={t('user.add.placeholder-user-id')}
                    isError={!!errors?.userId}
                  />
                )}
              />
            </div>
            <div className="flex flex-1">
              <Controller
                name='password'
                control={control}
                defaultValue='Avrist01#'
                render={({ field }) => (
                  <InputPassword
                    {...field}
                    labelTitle={t('user.users-new.user.add.password')}
                    labelStyle="font-semibold"
                    placeholder={t('user.add.placeholder-user-password')}
                    roundStyle="xl"
                    disabled
                  />
                )}
              />
            </div>
            <div className="flex flex-1">{/* SPACES */}</div>
          </div>
          {/* ROW 3 */}
          <div className="flex flex-row gap-14">
            <div className='flex flex-1'>
              <Controller
                name='fullName'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    labelTitle={t('user.users-new.user.add.fullname')}
                    labelStyle="font-semibold"
                    labelRequired
                    roundStyle="xl"
                    placeholder={t('user.add.placeholder-user-fullname')}
                    isError={!!errors?.userId}
                  />
                )}
              />
            </div>
            <div className='flex flex-1'>
              <Controller
                name='dob'
                control={control}
                rules={{ 
                  required: t('components.atoms.required') ?? '',
                  validate: (value) => {
                    if (value === 'DD-MM-YYYY') {
                      return t('components.atoms.required') ?? '';
                    };
                  },
                }}
                render={({ field }) => (
                  <InputDate
                    {...field}
                    labelTitle={t('user.users-new.user.add.date-of-birth')}
                    labelStyle="font-semibold"
                    labelRequired
                    roundStyle='xl'
                    error={!!errors?.dob?.message}
                    helperText={errors?.dob?.message ?? t('components.atoms.required')}
                    max={now}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(event.target.value);
                      if (event.target.value === '') {
                        setValue("dob", "DD-MM-YYYY");
                      } else {
                        setValue("dob", event.target.value);
                      };
                    }}
                  />
                )}
              />
            </div>
            <div className='flex flex-1'>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <Radio
                    {...field}
                    labelTitle={t('user.users-new.user.add.gender') ?? ''}
                    labelStyle="font-semibold"
                    labelRequired
                    error={!!errors?.gender?.message}
                    helperText={errors?.gender?.message}
                    defaultSelected={field.value}
                    items={[
                      {
                        value: 'MALE',
                        label: t('user.users-new.user.add.male'),
                      },
                      {
                        value: 'FEMALE',
                        label: t('user.users-new.user.add.female'),
                      },
                    ]}
                    onSelect={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      value: string | number | boolean,
                    ) => {
                      if (event) {
                        setValue('gender', value);
                        field.onChange(value);
                      };
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="flex flex-row gap-14">
            <div className='flex flex-1'>
              <Controller
                name='email'
                control={control}
                defaultValue=''
                rules={{
                  required: t('components.atoms.required') ?? '',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    labelTitle={t('user.users-new.user.add.user-email')}
                    labelStyle="font-semibold"
                    labelRequired
                    roundStyle="xl"
                    placeholder={t('user.add.placeholder-user-email')}
                    isError={!!errors?.email}
                    helperText={errors?.email?.message}
                  />
                )}
              />
            </div>
            <div className='flex flex-1'>
              <Controller
                name='company'
                control={control}
                defaultValue='Avrist Life Insurance'
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    labelTitle={t('user.users-new.user.add.company')}
                    labelStyle="font-semibold"
                    roundStyle="xl"
                    disabled
                  />
                )}
              />
            </div>
            <div className='flex flex-1'>
              <Controller
                name='roleId'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <DropDown
                    {...field}
                    labelTitle={t('user.users-new.user.add.role') ?? ''}
                    labelStyle="font-semibold"
                    labelRequired
                    labelEmpty={t('user.users-new.user.add.choose-role') ?? ''}
                    defaultValue={field.value}
                    items={roleData}
                    error={!!errors?.roleId?.message}
                    helperText={errors?.roleId?.message}
                    onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                      if (event) {
                        setValue('roleId', value);
                        field.onChange(value);
                      };
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* ROW 5 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <Controller
                name='departmentId'
                control={control}
                defaultValue=''
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <DropDown
                    {...field}
                    labelTitle={t('user.users-new.user.add.department') ?? ''}
                    labelStyle="font-semibold"
                    labelRequired
                    labelEmpty={t('user.users-new.user.add.choose-department') ?? ''}
                    defaultValue={field.value}
                    items={departmentData}
                    error={!!errors?.departmentId?.message}
                    helperText={errors?.departmentId?.message}
                    onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                      if (event) {
                        setValue('departmentId', value);
                        field.onChange(value);
                      };
                    }}
                  />
                )}
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
              setLeaveTitleModalShow(t('user.users-edit.user.edit.modal.confirmation'));
              setMessageLeaveModalShow(
                t('user.users-edit.user.edit.modal.leave-message'),
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
