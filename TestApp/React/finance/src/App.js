// import logo from './logo.svg';
import './App.css';

import React , {useState , useEffect} from 'react';
import axios from 'axios';
import api from "./Api.js";

const App =() => {
  const [transactions , settransactions] = useState ([]);
  const [formdata , setformdata] = useState({
    amount : 0,
    category :"",
    description :"",
    is_income:false,
    date :""
  });

  const[data , setData] = useState('');

  const fetchTransactions = async() => {
    const response = await axios.get('http://localhost:8000/transactions?skip=0&limit=100');
    settransactions(response.data)
  };
  //  useEffect(() => {
  //   // fetch("http://localhost:8000/transactions?skip=0&limit=100")
  //   // .then(resp => {
  //   //  return resp.json();
  //   // })
  //   // .then(results =>{
  //   //  console.log(results)
  //   //  settransactions(results)
  //   // })
 
  //   //  }
  // fetchTransactions();
  
  
  // },[]
  // );
 

 

    const handleInputChange = (event) =>{
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setformdata ({
        ...formdata,
        [event.target.name] : event.target.value,
      });
    };

    const handleformsubmit = async (event) => {
      console.log(formdata.amount)
      event.preventDefault();
      const data = new FormData();
      data.append("amount" ,formdata.amount);
      data.append("category" , formdata.category);
      data.append("description", formdata.description);
      data.append("is_income" , formdata.is_income);
      data.append("date" , formdata.date)
      console.log(data);
      try{
   const response = await fetch("http://localhost:8000/transactions/",{
      method : "POST",
     body : data,});
     if(!response.ok){
      throw new Error('network was not');
     }

     const result = await response.json();
     console.log('Success' , result);

     
     
     
     
    }catch(error){
      console.log(error);
    }
    fetchTransactions();
    // setformdata({
    //   amount : '',
    // category :'',
    // description :'',
    // is_income:false,
    // date :''
    // });

    };

   return(
    <div>
      <nav className='navbar navbar-dark bg-primary'></nav>
      <div className='container-fluid'>
        <a className='navbar-brand' href ="a">
          Finance App
        </a>
        <form onSubmit={handleformsubmit}>
          <div>
          <label htmlFor='amount' className='form-label'>Amount</label>
          <input  type='text' className='form-control' id='amount' name = 'amount' onChange={handleInputChange} value={formdata.amount}/>
      </div>
      <div>
          <label htmlFor='category' className='form-label'>category</label>
          <input  type='text' className='form-control' id='category' name = 'category' onChange={handleInputChange} value={formdata.category}/>
      </div>
      <div>
          <label htmlFor='description' className='form-label'>Description</label>
          <input  type='text' className='form-control' id='description' name = 'description' onChange={handleInputChange} value={formdata.description}/>
      </div>
      <div>
          <label htmlFor='is_income' className='form-label'>Income?</label>
          <input  type='checkbox' className='form-control' id='is_income' name = 'is_income' onChange={handleInputChange} value={formdata.is_income}/>
      </div>
      <div>
          <label htmlFor='date' className='form-label'>Date</label>
          <input  type='text' className='form-control' id='date' name = 'date' onChange={handleInputChange} value={formdata.date}/>
      </div>
      <button type='Submit' className='button button-primary'>Submit</button>
        </form>
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
