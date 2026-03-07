import { useCustomers } from "../../hooks/useCustomers";

export default function CustomersTable() {

  const { customers, loading } = useCustomers();

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  return (
    <div className="card">

      <table className="table">

        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Pedidos</th>
            <th>Total gastado</th>
            <th>Fecha registro</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer: any) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.orders}</td>
              <td>${customer.totalSpent}</td>
              <td>{customer.createdAt}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}