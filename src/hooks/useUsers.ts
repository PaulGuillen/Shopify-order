import { useEffect, useState, useRef } from "react";

export const useUsers = (shop: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const loaded = useRef(false);

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
    if (!shop || loaded.current) return;

    loaded.current = true;

    loadUsers();
  }, [shop]);

  return {
    users,
    loadUsers,
    setUsers,
  };
};