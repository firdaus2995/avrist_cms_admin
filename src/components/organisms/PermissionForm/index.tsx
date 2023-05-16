import { InputText } from '../../atoms/Input/InputText';
import { TextArea } from '../../atoms/Input/TextArea';
import { useTranslation } from 'react-i18next';
import { setName, setDescription } from '../../../services/Roles/rolesSlice';
import { useAppDispatch, useAppSelector } from '../../../store';
import { IPermissionForm } from './types';
export default function PermissionForm(props: IPermissionForm) {
  const dispatch = useAppDispatch();
  const { name, description } = useAppSelector(state => state.rolesSlice);
  const { disabled } = props;
  const { t } = useTranslation();

  return (
    <div className="w-[500px] mb-16">
      <InputText
        labelTitle={t('roles.role-name')}
        onChange={e => dispatch(setName(e.target.value))}
        containerStyle="mb-[22px] flex flex-row"
        labelStyle="font-bold w-[200px]"
        value={name}
        disabled={disabled}
      />

      <TextArea
        labelTitle={t('roles.role-description')}
        onChange={e => dispatch(setDescription(e.target.value))}
        containerStyle=" flex flex-row"
        labelStyle="font-bold w-[200px]"
        value={description}
        disabled={disabled}
      />
    </div>
  );
}
