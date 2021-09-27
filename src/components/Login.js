import React, { useState } from 'react';
import { Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { auth } from '../config/firebase';
import logo from '../assets/logo.png';

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmail = e => {
      setEmail(e.target.value);
      setEmailError('');
    }

    const handlePassword = e => {
      setPassword(e.target.value);
      setPasswordError('');
    }

    const handleSubmit = e => {
      var validation = 0;
      e.preventDefault();
      if(email === '') {
        setEmailError('Email is required')
      } else {
        validation++
      }

      if(password === '') {
        setPasswordError('Password is required')
      } else {
        validation++
      }

      if(validation === 2) {
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.reload()
        })
        .catch((error) => {
          console.log(error.code)
          if(error.code === 'auth/wrong-password') {
            setPasswordError('That password is not correct. Try again.')
          }
          if(error.code === 'auth/user-not-found') {
            setEmailError('A user with that email does not exist.')
            setPasswordError(' ')
          }
        })
      }
        
    }

  return (
    <Form style={{maxWidth:'400px',width:'400px',flexDirection:'column'}} onSubmit={handleSubmit}>
      <div style={{display:'flex',justifyContent:'center'}}>
        <img src={logo} style={{width:'300px',textAlign:'center'}} />
      </div>
      <FormGroup style={{marginBottom:'10px'}}>
        <Label for="exampleEmail">Email</Label>
        <Input type="email" name="email" id="exampleEmail" style={{width:'100%'}} value={email} onChange={handleEmail} invalid={emailError === '' ? false : true} />
        <FormFeedback>{emailError}</FormFeedback>
      </FormGroup>
      <FormGroup style={{marginBottom:'10px'}}>
        <Label for="examplePassword">Password</Label>
        <Input type="password" name="password" id="examplePassword" value={password} onChange={handlePassword} invalid={passwordError === '' ? false : true} />
        <FormFeedback>{passwordError}</FormFeedback>
      </FormGroup>
      <Button color='primary' style={{marginTop:'15px',marginBottom:'5px',width:'100%'}} type='submit'>Login</Button>
    </Form>
  );
}

export default Login;