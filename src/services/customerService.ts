export async function getCustomers() {

  const res = await fetch("http://localhost:3000/customers");

  if (!res.ok) {
    throw new Error("Error obteniendo clientes");
  }

  return res.json();
}