import './SignUp.css'
import React from 'react';
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';

function SignUp() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signUp, loadingAuth } = useContext(AuthContext)

  function handleSubmit(e){
    e.preventDefault()
    
    if(nome !== '' && email !== '' && password !== ''){
      signUp(email, password, nome)
    }else{
      toast.error('Os dados de Nome, E-mail e Senha devem ser preenchidos corretamente!')
    }
  }
  
  return (
    <div className="container-center">
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt="Logomarca" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder='Informe seu nome' value={nome} onChange={(e) => setNome(e.target.value)}/>
          <input type="text" placeholder='email@email.com' value={email} onChange={ (e) => setEmail(e.target.value) }/>
          <input type="password" placeholder='*********' value={password} onChange={ (e) => setPassword(e.target.value) }/>
          <button type="submit">{loadingAuth ? ' Carregando...' : 'Cadastrar'}</button>
        </form>

        <Link to='/'>Já possuo conta. Desejo entrar!</Link>

      </div>     
    </div>
  );
}

export default SignUp;