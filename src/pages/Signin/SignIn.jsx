import './Signin.css'
import React from 'react';
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn, loadingAuth } = useContext(AuthContext)

  function handleSubmit(e){
    e.preventDefault()

    if(email !== '' && password !== ''){
      signIn(email, password)
    }else{
      toast.error('Os dados de E-mail e Senha devem ser preenchidos obrigatoriamente!')
    }
  }

  return (
    <div className="container-center">
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt="Logomarca" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder='email@email.com' value={email} onChange={ (e) => setEmail(e.target.value) }/>
          <input type="password" placeholder='*********' value={password} onChange={ (e) => setPassword(e.target.value) }/>
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Entrar'}</button>
        </form>

        <Link to='/register'>Criar Conta</Link>

      </div>     
    </div>
  );
}

export default SignIn;