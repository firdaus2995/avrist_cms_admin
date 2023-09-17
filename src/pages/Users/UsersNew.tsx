import { 
  t,
} from "i18next";
import { 
  useNavigate,
} from "react-router-dom";
import React, { 
  useEffect, 
  useState
} from "react";
import dayjs from "dayjs";

import UserOrange from "../../assets/user-orange.svg";
import AddProfilePicture from "../../assets/add-profile-picture.png";
import ModalConfirm from "../../components/molecules/ModalConfirm";
import DropDown from "../../components/molecules/DropDown";
import Radio from "../../components/molecules/Radio";
import CancelIcon from "../../assets/cancel.png";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  InputText,
} from "../../components/atoms/Input/InputText";
import { 
  InputPassword,
} from "../../components/atoms/Input/InputPassword";
import { 
  useCreateUserMutation, 
  useGetRoleQuery,
} from "../../services/User/userApi";
import { 
  InputDate,
} from "../../components/atoms/Input/InputDate";
import { 
  useAppDispatch,
} from "../../store";
import { 
  openToast,
} from "../../components/atoms/Toast/slice";

export default function UsersNew () {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [roleData, setRoleData] = useState([]);
  // FORM STATE
  const [isActive, setIsActive] = useState<any>(true);
  const [userId, setUserId] = useState<string>("");
  const [password] = useState<string>("Avrist01#");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<any>("");
  const [gender, setGender] = useState<string | number | boolean>("");
  const [email, setEmail] = useState<string>("");
  const [company] = useState<string>("Avrist Life Insurance");
  const [roleId, setRoleId] = useState<string | number | boolean>(0);
  // CHANGE STATUS MODAL
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");

  // RTK GET ROLE
  const fetchRoleQuery = useGetRoleQuery({});
  const { data } = fetchRoleQuery;  
  // RTK CREATE USER
  const [ createUser, {
    isLoading,
  }] = useCreateUserMutation();

  useEffect(() => {
    if (data) {
      const roleList = data?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        }
      });
      setRoleData(roleList);
    };
  }, [data]);

  const onSave = () => {
    const payload = {
      userId,
      password,
      fullName,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      gender: gender === "FEMALE" ? false : gender === "MALE" ? true : null,
      email,
      company,
      statusActive: isActive,
      roleId,
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
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('user.add.failed-msg', { name: payload.fullName }),
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
    <TitleCard 
      title={t('user.add.title')}
      topMargin="mt-2" 
    >
      <ModalConfirm
        open={showChangeStatusModal}
        cancelAction={() => {
          setShowChangeStatusModal(false);
          setIsActive(true);
        }}
        title="Inactive User"
        cancelTitle="Cancel"
        message="Do you want to inactive this user"
        submitAction={changeStatusSubmit}
        submitTitle="Yes"
        icon={UserOrange}
        btnSubmitStyle='btn-warning'
      />
      <ModalConfirm
        open={showLeaveModal}
        cancelAction={() => {
          setShowLeaveModal(false);
        }}
        title={titleLeaveModalShow ?? ''}
        cancelTitle="No"
        message={messageLeaveModalShow ?? ''}
        submitAction={onLeave}
        submitTitle="Yes"
        icon={CancelIcon}
        btnSubmitStyle='btn-warning'
      />
      <form className="flex flex-col w-100">
        <img src={AddProfilePicture} className="mt-[35px] flex self-center" width={130}/>
        <div className="flex flex-col mt-[60px] gap-5">
          {/* ROW 1 */}
          <Radio 
            labelTitle="Status"
            labelStyle="font-bold	"
            labelRequired
            defaultSelected={isActive}
            items={[
              {
                value: true,
                label: 'Active'
              },
              {
                value: false,
                label: 'Inactive',
              },
            ]}
            onSelect={(event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
              if (event) {
                setIsActive(value);
                if (value === false) {
                  setShowChangeStatusModal(true);
                };
              };
            }}
          />
          {/* ROW 2 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText
                labelTitle="User ID"
                labelStyle="font-bold	"
                labelRequired
                value={userId}
                placeholder={t('user.add.placeholder-user-id')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setUserId(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <InputPassword 
                labelTitle="Password"
                labelStyle="font-bold	"
                value={password}
                placeholder={t('user.add.placeholder-user-password')}
                disabled
              />
            </div>
            <div className="flex flex-1">
              {/* SPACES */}
            </div>
          </div>
          {/* ROW 3 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText 
                labelTitle="Fullname"
                labelStyle="font-bold	"
                labelRequired
                value={fullName}
                placeholder={t('user.add.placeholder-user-fullname')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFullName(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <InputDate
                labelTitle="Date of Birth"
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
                labelTitle="Gender"
                labelStyle="font-bold	"
                labelRequired
                items={[
                  {
                    value: "MALE",
                    label: 'Male'
                  },
                  {
                    value: "FEMALE",
                    label: 'Female',
                  },
                ]}
                onSelect={(event: React.ChangeEvent<HTMLInputElement>, value: string | number | boolean) => {
                  if (event) {
                    setGender(value);
                  }
                }}
              />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText 
                labelTitle="User Email"
                labelStyle="font-bold	"
                labelRequired
                type="email"
                value={email}
                placeholder={t('user.add.placeholder-user-email')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <InputText 
                labelTitle="Company"
                labelStyle="font-bold	"
                value={company}
                disabled
              />
            </div>
            <div className="flex flex-1">
              <DropDown
                labelTitle="Role"
                labelStyle="font-bold	"
                labelRequired
                defaultValue=""
                labelEmpty="Choose Your Role"
                items={roleData}
                onSelect={(event: React.SyntheticEvent, value: string | number | boolean) => {
                  if (event) {
                    setRoleId(value);
                  };
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-[200px] flex justify-end items-end gap-2">
          <button className="btn btn-outline btn-md" onClick={(event: any) => {
            event.preventDefault();
            setLeaveTitleModalShow(t('modal.confirmation'));
            setMessageLeaveModalShow(t('modal.leave-confirmation'));
            setShowLeaveModal(true);          
          }}>
            {isLoading ? 'Loading...' : t('btn.cancel')}
          </button>
          <button className="btn btn-success btn-md text-white" onClick={(event: any) => {
            event.preventDefault();
            onSave();
          }}>
            {isLoading ? 'Loading...' : t('btn.save')}
          </button>
        </div>
      </form>
    </TitleCard>
  );
};
