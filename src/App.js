import './App.css';
import { auth } from './config/firebase';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Main from './components/Main.js';
import { Container } from 'reactstrap';
import React, { useState, useEffect } from 'react';

function App() {

  const [user, setUser] = useState(null);

  const [form, setForm] = useState('login');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    
    auth.onAuthStateChanged(user => {
      if(!user) { 
        setLoading(false)
      } else {
        setUser(user);
        setLoading(false)
      }
      
    })
  }, []);

  return (
    <div className="App">
      {loading === true ? 
      null
      : user !== null ? 
      <Main user={user} />
      : form === 'login' ? 
      <div style={{paddingTop:'10%'}}>
        <Container style={{display:'flex',justifyContent:'center'}}>
          <Login />
        </Container>
        <p style={{textAlign:'center',fontSize:'16px',cursor:'pointer'}} onClick={() => {setForm('register')}}>Don't have an account yet? Register here!</p>
      </div> :
      <div style={{paddingTop:'10%'}}>
        <Container style={{display:'flex',justifyContent:'center'}}>
          <Register /> 
        </Container>
        <p style={{textAlign:'center',fontSize:'16px',cursor:'pointer'}} onClick={() => {setForm('login')}}>Already have an account? Login here!</p>
      </div>
      }

    </div>
  );
}

export default App;
