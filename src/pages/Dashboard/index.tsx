import { useTranslation } from 'react-i18next';
import { useGetRolesQuery } from '../../services/Roles/rolesApi';
export default function Dashboard() {
  const { data } = useGetRolesQuery({
    pageIndex: 0,
    limit: 2,
    direction: '',
    search: '',
    sortBy: '',
  });
  const { t } = useTranslation();
  console.log(data);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <br />
      <button className="btn btn-primary btn-sm ">This button made with daisyui</button>
      <br />
      <h1 className="my-10"> {t('dashboard.sample') ?? ''}</h1>
    </div>
  );
}
