import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import { auth } from '../config/firebase';
import logo from '../assets/logo.png';

const Register = (props) => {

    const [displayName, setDisplayName] = useState('');
    const [displayNameError, setDisplayNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleDisplayName = e => {
      setDisplayName(e.target.value)
      setDisplayNameError('')
    }

    const handleEmail = e => {
      setEmail(e.target.value)
      setEmailError('')
    }

    const handlePassword = e => {
      setPassword(e.target.value)
      setPasswordError('')
    }

    const handleSubmit = e => {
      e.preventDefault();
      var validation = 0;

      if(displayName === '') {
        setDisplayNameError('First Name is required.')
      } else {
        validation++
      }

      if(email === '') {
        setEmailError('Email is required.')
      } else {
        validation++
      }

      if(password === '') {
        setPasswordError('Password is required.')
      } else if(password.length < 8) {
        setPasswordError('Password must be at least 8 characters.')
      } else {
        validation++
      }

      if(validation === 3) {
        auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          var currentUser = auth.currentUser;
          currentUser.updateProfile({
            displayName: displayName
          })
          window.location.reload()
        })
        .catch((error) => {
          console.log(error.message)
          if(error.message === 'The email address is already in use by another account.') {
            setEmailError(error.message)
          }
        });
      }
      
    }

  return (
    <Form style={{maxWidth:'400px',width:'400px',flexDirection:'column'}} onSubmit={handleSubmit}>
      <div style={{display:'flex',justifyContent:'center'}}>
        <img src={logo} style={{width:'300px',textAlign:'center'}} />
      </div>
      <FormGroup style={{marginBottom:'10px'}}>
        <Label for="exampleEmail">Your First Name</Label>
        <Input type="text" name="name" id="exampleName" style={{width:'100%'}} value={displayName} onChange={handleDisplayName} invalid={displayNameError === '' ? false : true} />
        <FormFeedback>{displayNameError}</FormFeedback>
      </FormGroup>
      <FormGroup style={{marginBottom:'10px'}}>
        <Label for="exampleEmail">Email</Label>
        <Input type="email" name="email" id="exampleEmail" style={{width:'100%'}} value={email} onChange={handleEmail} invalid={emailError === '' ? false : true} />
        <FormFeedback>{emailError}</FormFeedback>
      </FormGroup>
      <FormGroup style={{marginBottom:'10px'}}>
        <Label for="examplePassword">Password</Label>
        <Input type="password" name="password" id="examplePassword" value={password} onChange={handlePassword} invalid={passwordError === '' ? false : true} />
        <FormFeedback>{passwordError}</FormFeedback>
        <FormText color='muted'>Must be at least 8 characters</FormText>
      </FormGroup>
      <Button color='primary' style={{marginTop:'15px',marginBottom:'5px',width:'100%'}} type='submit'>Register</Button>
    </Form>
  );
}

export default Register;