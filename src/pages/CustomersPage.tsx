import { useState, useMemo, useEffect, useRef } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/customerPage.css";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const [showEmail] = useState(true);
  const [showPhone] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  /* ==========================
     USUARIO ACTUAL
  ========================== */

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const shop = currentUser.shop;
  const role = currentUser.role;

  /* ==========================
     CARGAR USUARIOS
  ========================== */

  const loadUsers = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users?shop=${shop}`);

      const data = await response.json();

      const mappedUsers = data.map((u: any) => ({
        id: u.id,
        username: u.email.split("@")[0],
        name: u.email.split("@")[0],
        email: u.email,
        phone: "-",
        status: u.active ? "activo" : "suspendido",
        role: u.role === "admin" ? "Administrador" : "Asesora",
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error loading users", error);
    }
  };

  useEffect(() => {
    if (shop) loadUsers();
  }, [shop]);

  /* ==========================
     CREAR USUARIO
  ========================== */

  const createUser = async () => {
    try {
      const email = `${username}@${shop}`;

      const response = await fetch("http://localhost:4000/users/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shop,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error);

        return;
      }

      setShowModal(false);

      setUsername("");

      setPassword("");

      setErrorMessage("");

      loadUsers();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  /* ==========================
     SELECCIONAR USUARIO
  ========================== */

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);

    setShowActionModal(true);
  };

  /* ==========================
     ELIMINAR USUARIO
  ========================== */

  const deleteUser = async () => {
    try {
      if (!selectedUser) return;

      await fetch(`http://localhost:4000/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      setShowActionModal(false);
      setSelectedUsers([]);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  /* ==========================
     FILTRADO
  ========================== */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase());

      const matchStatus = selectedStatus
        ? user.status === selectedStatus
        : true;

      const matchRole = selectedRole ? user.role === selectedRole : true;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, selectedStatus, selectedRole]);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((userId) => userId !== id);
      }

      return [...prev, id];
    });
  };

  /* ==========================
     UI
  ========================== */

  return (
    <Layout>
      <div className="users-page" ref={dropdownRef}>
        {/* HEADER */}

        <div className="users-header">
          <div>
            <h1>Lista de usuarios</h1>

            <p>Administra los usuarios de tu tienda</p>
          </div>

          {role === "admin" && (
            <div className="header-actions">
              <button
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Agregar usuario
              </button>
            </div>
          )}
        </div>

        {/* BUSCADOR */}

        <div className="filters-bar">
          <div className="filters-left">
            <input
              className="search-input"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}

        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th></th>

                <th>Usuario</th>

                <th>Nombre</th>

                {showEmail && <th>Email</th>}

                {showPhone && <th>Teléfono</th>}

                <th>Estado</th>

                <th>Rol</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
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

                  {showEmail && <td>{user.email}</td>}

                  {showPhone && <td>{user.phone}</td>}

                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACION */}

        <div className="pagination">
          <div className="rows-select">{filteredUsers.length} usuarios</div>
        </div>

        {/* MODAL CREAR USUARIO */}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Crear usuario</h2>

              <div className="input-domain">
                <input
                  type="text"
                  placeholder="usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <span>@{shop}</span>
              </div>

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMessage && <div className="form-error">{errorMessage}</div>}

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button className="btn-primary" onClick={createUser}>
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ACCIONES */}

        {showActionModal && selectedUser && (
          <div className="modal-overlay">
            <div className="user-modal">
              {/* HEADER */}

              <div className="user-modal-header">
                <h2>Información del usuario</h2>

                <button
                  className="close-btn"
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedUsers([]);
                  }}
                >
                  ✕
                </button>
              </div>

              {/* USER INFO */}

              <div className="user-info">
                <div className="user-avatar">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>

                <div className="user-main">
                  <h3>{selectedUser.username}</h3>

                  <p>{selectedUser.email}</p>
                </div>
              </div>

              {/* DETAILS */}

              <div className="user-details">
                <div className="detail-item">
                  <span>Nombre</span>
                  <strong>{selectedUser.name}</strong>
                </div>

                <div className="detail-item">
                  <span>Teléfono</span>
                  <strong>{selectedUser.phone}</strong>
                </div>

                <div className="detail-item">
                  <span>Estado</span>
                  <strong className={`status ${selectedUser.status}`}>
                    {selectedUser.status}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Rol</span>
                  <strong>{selectedUser.role}</strong>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="user-actions">
                <button
                  className="btn-primary"
                  onClick={() => alert("Editar usuario")}
                >
                  ✏️ Editar
                </button>

                <button className="btn-danger" onClick={deleteUser}>
                  🗑 Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
