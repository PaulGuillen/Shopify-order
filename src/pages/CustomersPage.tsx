import { useState, useMemo, useEffect, useRef } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/customerPage.css";

export default function CustomersPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const users = [
    {
      username: "juan.perez",
      name: "Juan Pérez",
      email: "juan@email.com",
      phone: "+51 987654321",
      status: "activo",
      role: "Administrador",
    },
    {
      username: "maria.lopez",
      name: "Maria Lopez",
      email: "maria@email.com",
      phone: "+51 912345678",
      status: "suspendido",
      role: "Manager",
    },
    {
      username: "carlos.vega",
      name: "Carlos Vega",
      email: "carlos@email.com",
      phone: "+51 955123456",
      status: "invitado",
      role: "Cajero",
    },
  ];

  /* ==========================
     CERRAR DROPDOWN AL HACER CLICK FUERA
  ========================== */

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setActiveDropdown(null);
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  }, [search, selectedStatus, selectedRole]);

  return (
    <Layout>
      <div className="users-page" ref={dropdownRef}>
        {/* HEADER */}

        <div className="users-header">
          <div>
            <h1>Lista de usuarios</h1>
            <p>Administra los usuarios y sus roles</p>
          </div>

          <div className="header-actions">
            <button className="btn-secondary">Invitar usuario</button>

            <button className="btn-primary">+ Agregar usuario</button>
          </div>
        </div>

        {/* FILTROS */}

        <div className="filters-bar">
          <div className="filters-left">
            <input
              className="search-input"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* ESTADO */}

            <div className="dropdown">
              <button
                className="filter-btn"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "status" ? null : "status",
                  )
                }
              >
                + Estado
              </button>

              {activeDropdown === "status" && (
                <div className="dropdown-menu">
                  <div
                    onClick={() => {
                      setSelectedStatus("activo");
                      setActiveDropdown(null);
                    }}
                  >
                    Activo
                  </div>

                  <div
                    onClick={() => {
                      setSelectedStatus("suspendido");
                      setActiveDropdown(null);
                    }}
                  >
                    Suspendido
                  </div>

                  <div
                    onClick={() => {
                      setSelectedStatus("invitado");
                      setActiveDropdown(null);
                    }}
                  >
                    Invitado
                  </div>

                  <div
                    className="clear-filter"
                    onClick={() => {
                      setSelectedStatus(null);
                      setActiveDropdown(null);
                    }}
                  >
                    Limpiar
                  </div>
                </div>
              )}
            </div>

            {/* ROL */}

            <div className="dropdown">
              <button
                className="filter-btn"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "role" ? null : "role")
                }
              >
                + Rol
              </button>

              {activeDropdown === "role" && (
                <div className="dropdown-menu">
                  <div
                    onClick={() => {
                      setSelectedRole("Administrador");
                      setActiveDropdown(null);
                    }}
                  >
                    Administrador
                  </div>

                  <div
                    onClick={() => {
                      setSelectedRole("Manager");
                      setActiveDropdown(null);
                    }}
                  >
                    Manager
                  </div>

                  <div
                    onClick={() => {
                      setSelectedRole("Cajero");
                      setActiveDropdown(null);
                    }}
                  >
                    Cajero
                  </div>

                  <div
                    className="clear-filter"
                    onClick={() => {
                      setSelectedRole(null);
                      setActiveDropdown(null);
                    }}
                  >
                    Limpiar
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VIEW */}

          <div className="filters-right dropdown">
            <button
              className="filter-btn"
              onClick={() =>
                setActiveDropdown(activeDropdown === "view" ? null : "view")
              }
            >
              Ver
            </button>

            {activeDropdown === "view" && (
              <div className="dropdown-menu">
                <label>
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={() => setShowEmail(!showEmail)}
                  />
                  Email
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={() => setShowPhone(!showPhone)}
                  />
                  Teléfono
                </label>
              </div>
            )}
          </div>
        </div>

        {/* CHIPS DE FILTROS */}

        {(selectedStatus || selectedRole) && (
          <div className="active-filters">
            {selectedStatus && (
              <span className="filter-chip">
                {selectedStatus}

                <button onClick={() => setSelectedStatus(null)}>✕</button>
              </span>
            )}

            {selectedRole && (
              <span className="filter-chip">
                {selectedRole}

                <button onClick={() => setSelectedRole(null)}>✕</button>
              </span>
            )}
          </div>
        )}

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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
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

                  <td className="actions">
                    <button
                      className="dots-btn"
                      onClick={() =>
                        setOpenMenu(openMenu === index ? null : index)
                      }
                    >
                      ⋯
                    </button>

                    {openMenu === index && (
                      <div className="actions-menu">
                        <div className="menu-item">✏️ Editar</div>

                        <div className="menu-item delete">🗑 Eliminar</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACION */}

        <div className="pagination">
          <div className="rows-select">{filteredUsers.length} usuarios</div>

          <div className="pages">
            <button>{"<"}</button>

            <button className="active">1</button>

            <button>{">"}</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
