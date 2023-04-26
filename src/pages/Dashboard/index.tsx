import { useGetListCharactersQuery } from '../../services/characters/characters.generated';
export default function Dashboard() {
  const { data } = useGetListCharactersQuery({ page: 1 });

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {data ? (
        data.characters?.results?.map(d => <li key={d?.id}>{d?.name}</li>)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
