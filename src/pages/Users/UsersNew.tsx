import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import UserOrange from '../../assets/user-orange.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import Radio from '../../components/molecules/Radio';
import CancelIcon from '../../assets/cancel.png';
import FileUploaderAvatar from '@/components/molecules/FileUploaderAvatar';
import DropDown from '@/components/molecules/DropDown';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputText } from '../../components/atoms/Input/InputText';
import { InputPassword } from '../../components/atoms/Input/InputPassword';
import { useCreateUserMutation, useGetRoleQuery } from '../../services/User/userApi';
import { InputDate } from '../../components/atoms/Input/InputDate';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import { useForm, Controller } from 'react-hook-form';
import { useGetDepartmentQuery } from '@/services/Department/departmentApi';

export default function UsersNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // FORM STATE
  const now = dayjs().format('YYYY-MM-DD');
  const [isActive, setIsActive] = useState<any>(true);
  const [avatar, setAvatar] = useState('');
  // CHANGE STATUS MODAL
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>('');
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>('');  

  // RTK GET ROLE
  const fetchRoleQuery = useGetRoleQuery({});
  const { data: dataRole } = fetchRoleQuery;

  // RTK GET DEPARTMENT
  const fetchDepartmentQuery = useGetDepartmentQuery({});
  const { data: dataDepartment } = fetchDepartmentQuery;  

  // RTK CREATE USER
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    watch(['roleData', 'departmentData']);
  }, [watch]);

  useEffect(() => {
    if (dataRole) {
      const roleList = dataRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setValue('roleData', roleList);
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
      setValue('departmentData', departmentList);
    };
  }, [dataDepartment]);

  function onSubmit(data: any) {
    const payload = {
      userId: data?.userId,
      password: data?.password,
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
    
    createUser(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('user.add.success-msg', { name: d.userCreate.fullName }),
          }),
        );
        navigate('/user');
      })
      .catch((error: any) => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t(`errors.${errorMessageTypeConverter(error.message)}`),
          }),
        );
      });
  }

  const changeStatusSubmit = () => {
    setIsActive(false);
    setShowChangeStatusModal(false);
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/user');
  };

  return (
    <TitleCard title={t('user.add.title')} topMargin="mt-2">
      <ModalConfirm
        open={showChangeStatusModal}
        cancelAction={() => {
          setShowChangeStatusModal(false);
          setIsActive(true);
        }}
        title={t('user.users-new.user.modal.inactive-user')}
        cancelTitle={t('user.users-new.user.btn.cancel')}
        message={t('user.users-new.user.modal.inactive-user-message') ?? ''}
        submitAction={changeStatusSubmit}
        submitTitle={t('user.users-new.user.btn.yes')}
        icon={UserOrange}
        btnSubmitStyle="btn-warning"
      />
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle={t('user.users-new.user.btn.no')}
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle={t('user.users-new.user.btn.yes')}
        icon={CancelIcon}
        btnSubmitStyle="btn-warning"
      />
      <form
        className="flex flex-col w-100"
        onSubmit={handleSubmit((data: any) => {
          onSubmit(data);
        })}>
        <div className="flex items-center justify-center">
          <FileUploaderAvatar
            id={'add_profile_picture'}
            image={avatar}
            imageChanged={(image: any) => {
              setAvatar(image);
            }}
          />
        </div>
        <div className="flex flex-col mt-[60px] gap-5">
          {/* ROW 1 */}
          <Radio
            labelTitle={t('user.users-new.user.add.status') ?? ''}
            labelStyle="font-bold	"
            labelRequired
            defaultSelected={isActive}
            items={[
              {
                value: true,
                label: t('user.users-new.user.add.active'),
              },
              {
                value: false,
                label: t('user.users-new.user.add.inactive'),
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
                    labelRequired
                    roundStyle="xl"
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
                    visible
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
                    items={getValues('roleData') ?? []}
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
                    items={getValues('departmentData') ?? []}
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
              setLeaveTitleModalShow(t('user.users-new.user.modal.confirmation'));
              setMessageLeaveModalShow(t('user.users-new.user.modal.leave-confirmation'));
              setShowLeaveModal(true);
            }}>
            {isLoading ? t('loading') : t('btn.cancel')}
          </button>
          <button className="btn btn-success btn-md text-white" type="submit">
            {isLoading ? t('loading') : t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
}
