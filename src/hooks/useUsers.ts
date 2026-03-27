import { useEffect, useState, useRef } from "react";

export const useUsers = (shop: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const loaded = useRef(false);

  const STORAGE_KEY = `users_${shop}`;

  /* =========================
     🔥 LOAD DESDE API
  ========================= */
  const loadUsers = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API}/users?shop=${shop}`);
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

      /* 🔥 GUARDAR EN LOCAL STORAGE */
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUsers));

    } catch (error) {
      console.error("Error loading users", error);

      /* 🔥 FALLBACK: USAR LOCAL STORAGE */
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setUsers(JSON.parse(cached));
      }
    }
  };

  /* =========================
     🔥 INIT (CACHE FIRST)
  ========================= */
  useEffect(() => {
    if (!shop || loaded.current) return;

    loaded.current = true;

    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      console.log("⚡ Users desde cache");
      setUsers(JSON.parse(cached));
    }

    /* 🔥 SIEMPRE intenta refrescar */
    loadUsers();

  }, [shop]);

  /* =========================
     🔥 UPDATE USERS + SYNC CACHE
  ========================= */
  const updateUsers = (newUsers: any[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  };

  return {
    users,
    loadUsers,
    setUsers: updateUsers,
  };
};