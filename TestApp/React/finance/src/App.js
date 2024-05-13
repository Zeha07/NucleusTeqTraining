// import logo from './logo.svg';
import './App.css';

import React , {useState , useEffect} from 'react';

import api from "./Api.js";

const App =() => {
  const [transactions , settransactions] = useState ([]);
  const [formdata , setformdata] = useState({
    amount : '',
    category :'',
    description :'',
    is_income:false,
    date :''
  });

  const[data , setData] = useState('');

  // const fetchTransactions = async() => {
  //   const response = await api.get('/transactions');
  //   settransactions(response.data)
  // };

  useEffect(() => {
   fetch("http://localhost:8000/transactions?skip=0&limit=100")
   .then(resp => {
    return resp.json();
   })
   .then(results =>{
    console.log(results)
    settransactions(results)
   })

    })


    // const handleInputChange = (event) =>{
    //   const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    //   setformdata ({
    //     ...formdata,
    //     [event.target.name] : value,
    //   });
    // };

    // const handleformsubmit = async (event) => {
    //   event.preventDefault();
    // event.api.post('/transactions' , formdata);
    // fetchTransactions();
    // setformdata({
    //   amount : '',
    // category :'',
    // description :'',
    // is_income:false,
    // date :''
    // });

    // };

   return(
    <div>
      <nav className='navbar navbar-dark bg-primary'></nav>
      <div className='container-fluid'>
        <a className='navbar-brand' href ="a">
          Finance App
        </a>
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income?</th>
              <th>Date</th>
            </tr>

          </thead>
          <tbody>
            {transactions.map((transaction)=> (
              <tr key ={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? 'Yes' :'No'}</td>
                <td>{transaction.date}</td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
   )


  // const fetchTransactions = async() => {
  //     const response = await api.get('/trial');
  //     console.log(response.data);
  //   };


  //  return(
  //   <div>
  //     <nav className='navbar navbar-dark bg-primary'></nav>
  //     <div className='container-fluid'>
  //       <a className='navbar-brand' href ="a">
  //         Finance App
  //       </a>
  //       <p ></p>
  //     </div>
  //   </div>
  //  )



  }

export default App;
