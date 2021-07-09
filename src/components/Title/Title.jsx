import './Title.css'
import React from 'react'

export default function Title({children, name}){
    return(
        <div className="title">
            {children}
            <span>{name}</span>
        </div>
    )
}