import { useTranslation } from 'react-i18next';
export default function Dashboard() {
  const { t } = useTranslation();

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
