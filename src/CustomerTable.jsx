import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  console.log("customers", customers)

  useEffect(() => {
    axios.get('http://localhost:4000/customers')
      .then(response => {
        // setCustomers(response.rows);
        console.log("innerCustomer", response)
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [customers]);

  return (
    <div>
      <h2>Customer List</h2>
      {customers && customers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.sno}>
                <td>{customer.customer_name}</td>
                <td>{customer.age}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{customer.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CustomerTable;
