import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../../components/atoms/BreadCrumbs';
import { TitleCard } from '../../components/molecules/Cards/TitleCard';
import { useGetRolesQuery } from '../../services/Roles/rolesApi';
const CreateButton = () => {
  return (
    <div className="inline-block float-right">
      <Link to="new">
        <button className="btn px-6 btn-sm normal-case btn-primary">Create</button>
      </Link>
    </div>
  );
};

const EditButtons = () => {
  return (
    <div className="inline-block float-right">
      <Link to="edit">
        <button className="btn px-6 btn-sm normal-case btn-info">Edit</button>
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
  const { data } = useGetRolesQuery({
    pageIndex: 0,
    limit: 2,
    direction: '',
    search: '',
    sortBy: '',
  });
  console.log(data);

  const dummyData = [
    {
      displayName: 'Admin',
      roleName: 'Administrator',
      type: 'System',
      users: ['user1', 'user2', 'user3'],
      capabilities: ['cap1', 'cap2', 'cap3'],
    },
    {
      displayName: 'Manager',
      roleName: 'Manager',
      type: 'Organizational',
      users: ['user4', 'user5'],
      capabilities: ['cap2', 'cap3'],
    },
    {
      displayName: 'Employee',
      roleName: 'Employee',
      type: 'Departmental',
      users: ['user6', 'user7', 'user8'],
      capabilities: ['cap1', 'cap3'],
    },
  ];

  return (
    <>
      <BreadCrumbs />
      <TitleCard title="Roles" topMargin="mt-2" TopSideButtons={<CreateButton />}>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Role Name</th>
                <th>Type</th>
                <th>Users</th>
                <th>Capabilities</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{data.displayName}</td>
                    <td>{data.roleName}</td>
                    <td>{data.type}</td>
                    <td>{data.users.length}</td>
                    <td>{data.capabilities.length}</td>
                    <td>
                      <EditButtons />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}
