import "./../../styles/components/customers/userTable.css";
interface Props {
  users: any[];
  selectedUsers: string[];
  toggleUserSelection: (id: string) => void;
  handleSelectUser: (user: any) => void;
}

export default function UsersTable({
  users,
  selectedUsers,
  toggleUserSelection,
  handleSelectUser,
}: Props) {
  return (
    <div className="table-card">
      <table className="users-table">
        <thead>
          <tr>
            <th></th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => {
                    toggleUserSelection(user.id);
                    handleSelectUser(user);
                  }}
                />
              </td>

              <td>{user.username}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.phone}</td>

              <td>
                <span className={`status ${user.status}`}>{user.status}</span>
              </td>

              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
