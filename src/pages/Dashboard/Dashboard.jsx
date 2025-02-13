import './Dashboard.css'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../../services/firebaseConnection'

import Header from '../../components/Header/Header'
import Title from '../../components/Title/Title'
import Modal from '../../components/Modal/Modal'

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'

export default function Dashboard(){

    const [chamados, setChamados] = useState([]) 
    const [loading, setLoading] = useState(true) 
    const [loadingMore, setLoadingMore] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(() => {

        async function loadChamados(){
            await firebase.firestore().collection('chamados')
            .orderBy('created', 'desc').limit(3)
            .get()
            .then((snapshot) => {
                updateState(snapshot)
            })
            .catch((error) => {
                console.log('Erro: ' + error)
                setLoadingMore(false)
            })
    
            setLoading(false)
    
        }

        loadChamados()

        return () => {

        }
    }, [])

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0

        if(!isCollectionEmpty){
            let lista = []

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1] //Pegando o último documento buscado

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc)
            
        } else {
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    async function handleMore(){
        setLoadingMore(true)

        await firebase.firestore().collection('chamados')
        .orderBy('created', 'desc')
        .startAfter(lastDocs).limit(3)
        .get()
        .then((snapshot) => {
            updateState(snapshot)
        })
        .catch((error) => {
            console.log('Erro: ' + error)
        })
    }

    function toglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if(loading){
        return(
            <div>
                <Header></Header>

                <div className='content'>
                    <Title name='Chamados'>
                        <FiMessageSquare size={25}></FiMessageSquare>
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                    </div>
                </div>    
            </div>
        )
    }

    return(        
        <div>
            <Header></Header>

            <div className='content'>
                <Title name='Chamados'>
                    <FiMessageSquare size={25}></FiMessageSquare>
                </Title>
            
                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado registrado até o momento...</span>

                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#fff'></FiPlus>
                            Adicionar Chamado
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#fff'></FiPlus>
                            Adicionar Chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>                                
                                    <th scope='col'>#</th>                                
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td data-label='Cliente'>{item.cliente}</td>
                                            <td data-label='Assunto'>{item.assunto}</td>
                                            <td data-label='Status'>
                                                <span className='badge' style={{ backgroundColor: item.status === 'Atendido' ? '#5cb85c' : '#FF8C00' }}>{item.status}</span>
                                            </td>
                                            <td data-label='Cadastrado'>{item.createdFormated}</td>
                                            <td data-label='#'>
                                                <button className='action' style={{ backgroundColor: '#3583f6' }} onClick={() => toglePostModal(item)}>
                                                    <FiSearch color='#fff' size={17}></FiSearch>
                                                </button>
                                                <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: '#f6a935' }}>
                                                    <FiEdit2 color='#fff' size={17}></FiEdit2>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}                                
                            </tbody>
                        </table>
                        
                        { loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais chamados</button>}
                    </>      
                )}
                
                { showPostModal && (
                    <Modal 
                        conteudo={detail}
                        close={toglePostModal}>
                    </Modal>
                )}
                
            </div>            
        </div>
    )
}