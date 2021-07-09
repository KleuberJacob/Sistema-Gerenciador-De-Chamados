import './New.css'
import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

import firebase from '../../services/firebaseConnection'

import Header from '../../components/Header/Header'
import Title from '../../components/Title/Title'

import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function New(){

    const { id } = useParams()
    const history = useHistory()//Utilizado para realizar ação de navegação para um determindao endereço

    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customersSelected, setCustomersSelected] = useState(0)

    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [complemento, setComplemento] = useState('')

    const [idCustomer, setIdCustomer] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeEmpresa: doc.data().nomeEmpresa
                    })
                })

                if(lista.length === 0){
                    console.log('Nenhuma empresa cadastrada!')
                    setCustomers([ {id: '1', nomeEmpresa: ''} ])
                    setLoadCustomers(false)
                    return
                }

                setCustomers(lista)
                setLoadCustomers(false)

                if(id){
                    loadId(lista)
                }

            })
            .catch((error) => {
                console.log('Erro: ' + error)
                setLoadCustomers(false)
                setCustomers([ {id: '1', nomeEmpresa: ''} ])
            })
        }

        loadCustomers()

    }, [])

    async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomersSelected(index)
            setIdCustomer(true)
        })
        .catch((error) => {
            console.log('Erro: ' + error)
            setIdCustomer(false)
        })
    }

    async function handleRegister(e){
        e.preventDefault()

        if(idCustomer){//Se (idCustomer) estiver como true
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customersSelected].nomeEmpresa,
                clienteId: customers[customersSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.id
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!')
                setCustomersSelected(0)
                setComplemento('')
                history.push('/dashboard')
            })
            .catch((error) => {
                console.log('Erro: ' + error)
            })

            return //Para parar execução do código
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customersSelected].nomeEmpresa,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.id
        })
        .then(() => {
            toast.success('Chamado cadastrado com sucesso!')
            setCustomersSelected([0])
            setComplemento('')

        })
        .catch((error) => {
            toast.error('Ops. Erro ao realizar o cadastro do chamado!')
            console.log('Erro: ' + error)
        })        
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }

    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeCustomers(e){
        setCustomersSelected(e.target.value)
    }

    return(
        <div>
            <Header></Header>

            <div className='content'>
                <Title name='Novo Chamado'>
                    <FiPlusCircle size={25}></FiPlusCircle>
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Cliente:</label>

                            {loadCustomers ? (
                                <input type="text" value='Carregando Clientes...' disabled={true}/>
                            ) : (
                                <select value={customersSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.nomeEmpresa}
                                        </option>
                                    )
                                })} 
                                </select>
                            )}

                        <label>Assunto:</label>
                            <select value={assunto} onChange={handleChangeSelect}>
                                <option value='Suporte'>Suporte Técnico</option>
                                <option value='Visita Técnica'>Visita Técnica</option>
                                <option value='Financeiro'>Financeiro</option>                                
                            </select>

                        <label>Status:</label> 
                            <div className="status">

                                <input type="radio" 
                                       name='radio'
                                       value='Aberto'
                                       onChange={handleOptionChange}
                                       checked={ status === 'Aberto' }/> 
                                    <span>Em Aberto</span>

                                <input type="radio"
                                       name='radio'
                                       value='Progresso'
                                       onChange={handleOptionChange}
                                       checked={ status === 'Progresso' }/> 
                                    <span>Em Atendimento</span>

                                <input type="radio"
                                       name='radio'
                                       value='Atendido'
                                       onChange={handleOptionChange}
                                       checked={ status === 'Atendido' }/> 
                                    <span>Encerrado</span>
                            </div>

                        <label>Complemento:</label>
                            <textarea type='text' 
                                      placeholder='Descreva maiores informações sobre o problema(opcional).'
                                      value={complemento}
                                      onChange={(e) => setComplemento(e.target.value)}></textarea>    
                        
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}