import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import UserOrange from '../../assets/user-orange.svg';
import ModalConfirm from '../../components/molecules/ModalConfirm';
import Radio from '../../components/molecules/Radio';
import CancelIcon from '../../assets/cancel.png';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputText } from '../../components/atoms/Input/InputText';
import { InputPassword } from '../../components/atoms/Input/InputPassword';
import { useCreateUserMutation, useGetRoleQuery } from '../../services/User/userApi';
import { InputDate } from '../../components/atoms/Input/InputDate';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import { errorMessageTypeConverter } from '@/utils/logicHelper';
import FormList from '../../components/molecules/FormList';
import Typography from '../../components/atoms/Typography';
import FileUploaderAvatar from '@/components/molecules/FileUploaderAvatar';
import { useForm, Controller } from 'react-hook-form';

export default function UsersNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState([]);
  // FORM STATE
  const now = dayjs().format('YYYY-MM-DD');
  const [isActive, setIsActive] = useState<any>(true);
  const [password] = useState<string>('Avrist01#');
  const [dob, setDob] = useState<any>('DD-MM-YYYY');
  const [gender, setGender] = useState<string | number | boolean>('');
  const [company] = useState<string>('Avrist Life Insurance');
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
  const fetchRoleQuery = useGetRoleQuery({});
  const { data } = fetchRoleQuery;

  // RTK CREATE USER
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (data) {
      const roleList = data?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        };
      });
      setRoleData(roleList);
    }
  }, [data]);

  function onSubmit(data: { userId: any; fullName: any; email: any; role: any }) {
    const payload = {
      userId: data?.userId,
      password,
      fullName: data?.fullName,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      gender: gender === 'FEMALE' ? false : gender === 'MALE' ? true : null,
      email: data?.email,
      company,
      profilePicture: avatar,
      statusActive: isActive,
      roleId: data?.role,
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
            <div className="max-w-[340px]">
              <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
                {t('user.users-new.user.add.user-id')}
                <span className={'text-reddist text-lg'}>{`*`}</span>
              </Typography>
              <Controller
                name="userId"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    key="userId"
                    inputWidth={340}
                    placeholder={t('user.add.placeholder-user-id')}
                    error={!!errors?.userId?.message}
                    helperText={errors?.userId?.message}
                    roundStyle="3xl"
                    border={false}
                    value={field.value}
                    onChange={(e: { target: { value: any } }) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-1">
              <InputPassword
                labelTitle={t('user.users-new.user.add.password')}
                labelStyle="font-bold"
                value={password}
                placeholder={t('user.add.placeholder-user-password')}
                disabled
                visible
              />
            </div>
            <div className="flex flex-1">{/* SPACES */}</div>
          </div>
          {/* ROW 3 */}
          <div className="flex flex-row gap-14">
            <div className="max-w-[340px]">
              <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
                {t('user.users-new.user.add.fullname')}
                <span className={'text-reddist text-lg'}>{`*`}</span>
              </Typography>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <FormList.TextField
                    {...field}
                    key="fullName"
                    inputWidth={340}
                    placeholder={t('user.add.placeholder-user-fullname')}
                    error={!!errors?.fullName?.message}
                    helperText={errors?.fullName?.message}
                    roundStyle="3xl"
                    border={false}
                    value={field.value}
                    onChange={(e: { target: { value: any } }) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="max-w-[340px]">
              <Controller
                name="dob"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <InputDate
                    {...field}
                    labelTitle={t('user.users-new.user.add.date-of-birth')}
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
                    labelTitle={t('user.users-new.user.add.gender') ?? ''}
                    labelStyle="font-bold"
                    labelRequired
                    error={!!errors?.gender?.message && gender === ''}
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
                {t('user.users-new.user.add.user-email')}
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
                    placeholder={t('user.add.placeholder-user-email')}
                    border={false}
                    value={field.value}
                    onChange={(e: { target: { value: any } }) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-1">
              <InputText
                labelTitle={t('user.users-new.user.add.company')}
                labelStyle="font-bold"
                value={company}
                disabled
              />
            </div>
            <div className="max-w-[340px]">
              <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
                {t('user.users-new.user.add.role')}
                <span className={'text-reddist text-lg'}>{`*`}</span>
              </Typography>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                rules={{ required: t('components.atoms.required') ?? '' }}
                render={({ field }) => (
                  <FormList.DropDown
                    {...field}
                    key="role"
                    labelTitle={t('user.page-template-new.category')}
                    defaultValue=""
                    inputWidth={340}
                    error={!!errors?.role?.message}
                    helperText={errors?.role?.message}
                    themeColor="primary"
                    items={roleData}
                    onChange={(e: any) => {
                      field.onChange(e.value);
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* ROW 5 */}
          <div className="max-w-[365px]">
            <Typography type="body" size="s" weight="bold" className="w-56 ml-1 mb-2">
              Department
              <span className={'text-reddist text-lg'}>{`*`}</span>
            </Typography>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              rules={{ required: t('components.atoms.required') ?? '' }}
              render={({ field }) => (
                <FormList.DropDown
                  {...field}
                  key="department"
                  labelTitle="Department"
                  defaultValue=""
                  inputWidth={340}
                  error={!!errors?.department?.message}
                  helperText={errors?.department?.message}
                  themeColor="primary"
                  items={listAttributes}
                  onChange={(e: any) => {
                    field.onChange(e.value);
                  }}
                />
              )}
            />
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
