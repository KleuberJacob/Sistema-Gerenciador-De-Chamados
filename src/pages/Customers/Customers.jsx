import './Customers.css'
import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Title from '../../components/Title/Title'
import firebase from '../../services/firebaseConnection'
import { FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Customers(){

    const [nomeEmpresa, setNomeEmpresa] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereço, setEndereço] = useState('')

    async function handleAdd(e){
        e.preventDefault()
        
        if(nomeEmpresa !== '' && cnpj !== '' && endereço !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeEmpresa: nomeEmpresa,
                cnpj: cnpj,
                endereço: endereço
            })
            .then(() => {
                setNomeEmpresa('')
                setCnpj('')
                setEndereço('')
                toast.success('Empresa cadastrada com Sucesso!')
            })
            .catch((error) => {
                console.log('Erro: ' + error)
                toast.error('Erro no cadastro da empresa!')
            })
        }else{
            toast.error('Todos os campos devem ser preenchidos corretamente!')
        }
    }

    return(
        <div>
            <Header></Header>

            <div className="content">
                <Title name='Clientes'>
                   <FiUser size={25}></FiUser> 
                </Title>

                <div className="container">
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label htmlFor="">Nome da Empresa:</label>
                            <input type="text" placeholder='Nome da sua Empresa' value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)}/>

                        <label htmlFor="">CNPJ:</label>
                            <input type="text" placeholder='CNPJ da Empresa' value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>

                        <label htmlFor="">Endereço:</label>
                            <input type="text" placeholder='Endereço da Empresa' value={endereço} onChange={(e) => setEndereço(e.target.value)}/>

                        <button type="submit">Cadastrar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

