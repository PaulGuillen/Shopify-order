import { useState, useMemo } from "react";
import Layout from "../layout/Layout";
import { useUsers } from "../hooks/useUsers";
import UsersTable from "../components/customers/UsersTable";
import CreateUserModal from "../components/customers/CreateUserModal";
import SearchBar from "../components/customers/SearchBar";
import "../styles/pages/customerPage.css";

export default function CustomersPage() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const shop = currentUser.shop;
  const role = currentUser.role;

  const { users, loadUsers } = useUsers(shop);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <Layout>
      <div className="users-page">
        <div className="users-header">
          <div>
            <h1>Lista de usuarios</h1>
            <p>Administra los usuarios de tu tienda</p>
          </div>

          {role === "admin" && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Agregar usuario
            </button>
          )}
        </div>

        <SearchBar search={search} setSearch={setSearch} />

        <UsersTable
          users={filteredUsers}
          selectedUsers={selectedUsers}
          toggleUserSelection={toggleUserSelection}
          handleSelectUser={handleSelectUser}
        />

        <div className="pagination">{filteredUsers.length} usuarios</div>

        {showModal && (
          <CreateUserModal
            shop={shop}
            onClose={() => setShowModal(false)}
            onCreated={loadUsers}
          />
        )}
      </div>
    </Layout>
  );
}
