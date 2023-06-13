import { 
  t,
} from "i18next";
import { 
  useEffect, 
  useState,
} from "react";
import { 
  useNavigate, 
  useParams,
} from "react-router-dom";
import dayjs from "dayjs";

import ModalConfirmLeave from "../../components/molecules/ModalConfirm";
import CancelIcon from "../../assets/cancel.png";
import AddProfilePicture from "../../assets/add-profile-picture.png";
import Radio from "../../components/molecules/Radio";
import DropDown from "../../components/molecules/DropDown";
import { 
  TitleCard,
} from "../../components/molecules/Cards/TitleCard";
import { 
  useAppDispatch,
} from "../../store";
import { 
  InputText,
} from "../../components/atoms/Input/InputText";
import { 
  InputPassword,
} from "../../components/atoms/Input/InputPassword";
import { 
  InputDate,
} from "../../components/atoms/Input/InputDate";
import { 
  useEditUserMutation, 
  useGetRoleQuery, 
  useGetUserDetailQuery,
} from "../../services/User/userApi";
import { 
  openToast,
} from "../../components/atoms/Toast/slice";

export default function UsersEdit () {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [roleData, setRoleData] = useState([]);
  // FORM STATE
  const [id] = useState<any>(Number(params.id));
  const [userId, setUserId] = useState<string>("");
  const [password] = useState<string>("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<any>("");
  const [gender, setGender] = useState<string | number | boolean>("");
  const [email, setEmail] = useState<string>("");
  const [company] = useState<string>("Avrist Life Insurance");
  const [roleId, setRoleId] = useState<string | number | boolean>(0);  
  // LEAVE MODAL
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [titleLeaveModalShow, setLeaveTitleModalShow] = useState<string | null>("");
  const [messageLeaveModalShow, setMessageLeaveModalShow] = useState<string | null>("");
  
  // RTK GET ROLE
  const fetchUserDetailQuery = useGetUserDetailQuery({id}, {
    refetchOnMountOrArgChange: true,
  });
  const fetchRoleQuery = useGetRoleQuery({});
  const { data } = fetchUserDetailQuery;
  const { data: fetchedRole } = fetchRoleQuery;  
  const [ editUser, {
    isLoading,
  }] = useEditUserMutation();

  useEffect(() => {
    if (fetchedRole) {
      const roleList = fetchedRole?.roleList?.roles.map((element: any) => {
        return {
          value: Number(element.id),
          label: element.name,
        }
      })
      setRoleData(roleList);
    };
  }, [fetchedRole])

  useEffect(() => {
    if (data) {
      const userDetail = data?.userById;
      setUserId(userDetail.userId);
      setFullName(userDetail.fullName);
      setDob(userDetail.dob);
      setGender(userDetail.gender);
      setEmail(userDetail.email);
      setRoleId(userDetail.role.id)
    };
  }, [data])

  const onSave = () => {
    const payload = {
      id,
      fullName,
      dob: dayjs(dob).format('YYYY-MM-DD'),
      gender: gender === "FEMALE" ? false : gender === "MALE" ? true : null,
      email,
      company,
      roleId,
    };    
    editUser(payload)
      .unwrap()
      .then((d: any) => {
        dispatch(
          openToast({
            type: 'success',
            title: t('toast-success'),
            message: t('user.edit.success-msg', { name: d.userUpdate.fullName }),
          }),
        );
        navigate('/user');
      })
      .catch(() => {
        dispatch(
          openToast({
            type: 'error',
            title: t('toast-failed'),
            message: t('roles.edit.failed-msg', { name: payload.fullName }),
          }),
        );
      });
  };

  const onLeave = () => {
    setShowLeaveModal(false);
    navigate('/user');
  };

  return (
    <TitleCard 
      title={t('user.edit.title')}
      topMargin="mt-2" 
    >
      <ModalConfirmLeave
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
        btnType='btn-warning'
      />
      <form className="flex flex-col w-100" >
        <img src={AddProfilePicture} className="mt-[35px] flex self-center" width={130}/>
        <div className="flex flex-col mt-[60px] gap-5">
          {/*  ROW 1 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText  
                labelTitle="User ID"
                labelStyle="font-bold	"
                value={userId}
                placeholder={t('user.edit.placeholder-user-id')}
                disabled
              />
            </div>
            <div className="flex flex-1">
              <InputPassword 
                labelTitle="Password"
                labelStyle="font-bold	"
                value={password}
                placeholder={t('user.edit.placeholder-user-password')}
                disabled
              />
            </div>
            <div className="flex flex-1">
              {/* SPACES */}
            </div>
          </div>
          {/*  ROW 2 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText 
                labelTitle="Fullname"
                labelStyle="font-bold	"
                labelRequired
                value={fullName}
                placeholder={t('user.edit.placeholder-user-fullname')}
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
                defaultSelected={gender}
              />
            </div>
          </div>
          {/* ROW 3 */}
          <div className="flex flex-row gap-14">
            <div className="flex flex-1">
              <InputText 
                labelTitle="User Email"
                labelStyle="font-bold	"
                labelRequired
                type="email"
                value={email}
                placeholder={t('user.edit.placeholder-user-email')}
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
                defaultValue={roleId}
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
      </form>
      <div className="mt-[200px] flex justify-end items-end gap-2">
        <button className="btn btn-outline btn-md" onClick={() => {
          setLeaveTitleModalShow(t('modal.confirmation'));
          setMessageLeaveModalShow(t('modal.leave-confirmation'));
          setShowLeaveModal(true);          
        }}>
          {isLoading ? 'Loading...' : t('btn.cancel')}
        </button>
        <button className="btn btn-success btn-md" onClick={() => {
          onSave();
        }}>
          {isLoading ? 'Loading...' : t('btn.save')}
        </button>
      </div>
    </TitleCard>
  );
};
