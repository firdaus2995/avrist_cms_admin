import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery, useRoleHapusMutation } from '../../services/Roles/rolesApi';
import { useAppDispatch } from '../../store';
import { openToast } from '../../components/atoms/Toast/slice';
import ModalConfirmLeave from '../../components/molecules/ModalConfirm';

const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn px-6 btn-sm normal-case btn-primary">Create</button>
      </Link>
    </div>
  );
};

const EditButtons = (props: { id: number }) => {
  return (
    <div className="inline-block float-right">
      <Link to={`edit/${props.id}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </Link>
    </div>
  );
};
const DeleteButtons = (props: { action: () => void }) => {
  return (
    <div className="inline-block float-right cursor-pointer" onClick={props.action}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    </div>
  );
};
const DetailButtons = (props: { id: number }) => {
  return (
    <div className="inline-block float-right">
      <Link to={`detail/${props.id}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    </div>
  );
};

// const PaginationButtons = () => {
//   return (
//     <div className="btn-group">
//       <button className="btn">1</button>
//       <button className="btn btn-active">2</button>
//       <button className="btn">3</button>
//       <button className="btn">4</button>
//     </div>
//   );
// };

export default function RolesList() {
  const dispatch = useAppDispatch();
  const [showComfirm, setShowComfirm] = useState(false);
  const [messageConfirm, setmessageConfirm] = useState('');
  const [idDelete, setIdDelete] = useState(0);
  const fetchQuery = useGetRolesQuery({
    pageIndex: 0,
    limit: 100,
    direction: '',
    search: '',
    sortBy: '',
  });
  const { data } = fetchQuery;
  const [hapusRole, { isLoading: hapusLoading }] = useRoleHapusMutation();
  const onConfirm = (id: number, name: string) => {
    setIdDelete(id);
    setmessageConfirm(`ciyuss hapus roles ${name}?`);
    setShowComfirm(true);
  };

  const onDelete = () => {
    hapusRole({ id: idDelete })
      .unwrap()
      .then(async d => {
        setShowComfirm(false);
        dispatch(
          openToast({
            type: 'success',
            title: 'Success delete',
            message: d.roleDelete.message,
          }),
        );
        await fetchQuery.refetch();
      })
      .catch(err => {
        setShowComfirm(false);

        console.log(err);
        dispatch(
          openToast({
            type: 'error',
            title: 'Gagal delete',
            message: 'Oops gagal delete',
          }),
        );
      });
  };
  return (
    <>
      <ModalConfirmLeave
        open={showComfirm}
        cancelAction={() => {
          setShowComfirm(false);
        }}
        cancelTitle="Batal"
        message={messageConfirm}
        submitAction={onDelete}
        submitTitle="Hapus"
        loading={hapusLoading}
      />
      <TitleCard title="Roles" topMargin="mt-2" TopSideButtons={<CreateButton />}>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.roleList.roles.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.description}</td>
                  <td className="flex gap-2">
                    <DetailButtons id={d.id} />
                    <EditButtons id={d.id} />
                    <DeleteButtons
                      action={() => {
                        onConfirm(d.id, d.name);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}
