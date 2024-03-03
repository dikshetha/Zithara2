// App.js

import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import './App.css';
// import 

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [page,setPage] = useState(1)
  const [sort,setSort] = useState("asc")
  const [total,setToal] = useState("")
  const [limit,setLimit] = useState("");
  const [sortKey,setSortKey] = useState("");
  // desc


  console.log('costomer',customers)

  const handlePagination=(e,page)=>{
    setPage(page)
  }

  const handleSortByDate=(e)=>{
    console.log('sdfsdfdsf',e.target.value)
    setSortKey(e.target.value)
  }

  const handleSortByTime=(e)=>{
    const timeKey = e.target.value;
    if (timeKey === 'asc') {
        return customers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (timeKey === 'desc') {
        return customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
        return customers;
    }
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/customers?page=${page}&sort=${sortKey}`)
      .then(response => {
        setCustomers(response?.data?.data);      
        setToal(response?.data?.total)
        setLimit(response?.data?.limit)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [page,sortKey]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = type => {
    setSort(type);
  };

  const filteredCustomers = customers.filter(customer => {
    return (
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedCustomers = sortType ?
    [...filteredCustomers].sort((a, b) => {
      if (sortType === 'date') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortType === 'time') {
        return a.created_at.localeCompare(b.created_at);
      }
      return 0;
    }) :
    filteredCustomers;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Customer List</h1>
      <div className="search-wrapper mb-3"> {/* Added new class name */}
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or location"
          onChange={handleSearch}
        />
      </div>
      {/* <div className="sort-wrapper mb-3">
        <label className="me-2">Sort by:</label>
        <button className="btn btn-secondary me-2" onClick={() => handleSort('date')}>
          Sort By Asc
        </button>
        <button className="btn btn-secondary" onClick={() => handleSort('time')}>
          Sort By Desc
        </button>
      </div> */}

      <select onChange={handleSortByDate}>
        <option value={""}>Sort By Date & Time</option>
        <option value={"aesc"}>ASC</option>
        <option value={"desc"}>DESC</option>
      </select>
      {/* <select onChange={handleSortByTime}>
        <option value={""}>Sort By Time</option>
        <option value={"aesc"}>ASC</option>
        <option value={"desc"}>DESC</option>
      </select> */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map(customer => (
            <tr key={customer.sno}>
              <td>{customer.customer_name}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <nav>
        <ul className="pagination">
          {[...Array(Math.ceil(filteredCustomers.length / customersPerPage)).keys()].map(number => (
            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <a onClick={() => paginate(number + 1)} href="#" className="page-link">
                {number + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}
      <Pagination count={Math.ceil(total/limit)} color="primary" onChange={handlePagination} />
    </div>
  );
};

export default App;
