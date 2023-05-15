import { InputText } from '../../atoms/Input/InputText';
import { TextArea } from '../../atoms/Input/TextArea';
import { useTranslation } from 'react-i18next';
import { setName, setDescription } from '../../../services/Roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../../store';
export default function PermissionForm() {
  const dispatch = useAppDispatch();
  const { name, description } = useAppSelector(state => state.rolesSlice);
  const { t } = useTranslation();

  return (
    <div className="w-[500px] mb-16">
      <InputText
        labelTitle={t('roles.role-name')}
        updateType="roleName"
        updateFormValue={({ value }) => dispatch(setName(value))}
        containerStyle="mb-[22px] flex flex-row"
        labelStyle="font-bold w-[200px]"
        defaultValue={name}
      />

      <TextArea
        labelTitle={t('roles.role-description')}
        updateType="roleDescription"
        updateFormValue={({ value }) => dispatch(setDescription(value))}
        containerStyle=" flex flex-row"
        labelStyle="font-bold w-[200px]"
        defaultValue={description}
      />
    </div>
  );
}
