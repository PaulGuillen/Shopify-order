const API = "http://localhost:4000";

export const getUsers = async (shop: string) => {
  const res = await fetch(`${API}/users?shop=${shop}`);
  return res.json();
};

export const createUser = async (email: string, password: string, shop: string) => {
  const res = await fetch(`${API}/users/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      shop
    })
  });

  return res.json();
};

export const deleteUser = async (id: string) => {
  await fetch(`${API}/users/${id}`, {
    method: "DELETE"
  });
};