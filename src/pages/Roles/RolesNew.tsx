// import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../../components/molecules/BreadCrumbs';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { InputText } from '../../components/molecules/Input/InputText';
import { CheckBox } from '../../components/molecules/Input/CheckBox';

export default function RolesNew() {
  const updateFormValue = ({ updateType, value }) => {
    console.log(updateType);
  };
  return (
    <>
      <BreadCrumbs />
      <TitleCard title="New Roles" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            labelTitle="Display Name"
            updateType="displayName"
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="Role Name"
            updateType="roleName"
            updateFormValue={updateFormValue}
          />
          <InputText labelTitle="Type" updateType="type" updateFormValue={updateFormValue} />
          <InputText labelTitle="Users" updateType="users" updateFormValue={updateFormValue} />
          <InputText
            labelTitle="Capabilities"
            updateType="capabilities"
            updateFormValue={updateFormValue}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CheckBox
            updateType="syncData"
            labelTitle="Sync Data"
            defaultValue={true}
            updateFormValue={updateFormValue}
          />
          <CheckBox
            updateType="syncData"
            labelTitle="Sync Data"
            defaultValue={true}
            updateFormValue={updateFormValue}
          />
          <CheckBox
            updateType="syncData"
            labelTitle="Sync Data"
            defaultValue={true}
            updateFormValue={updateFormValue}
          />
        </div>
        <div className="mt-16">
          <button className="btn btn-primary float-right" onClick={() => updateProfile()}>
            Save
          </button>
        </div>
      </TitleCard>
    </>
  );
}
