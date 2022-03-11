import axios from 'axios';
import React, { useState } from 'react'
import Modal from 'react-modal';
Modal.setAppElement('#root');
export default function Day(props) {
    let event = 0;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    if(props.event && props.event.length > 0){
        event = props.event
    }
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }
    
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width : '50%'
        },
    };
    const deleteEvent = (id) =>{
        axios.delete('http://localhost:3001/events/'+id)
    }
    return (
        <div>
            <p  onClick={props.selectDay} className={props.opacity ? "day-number pointer opacity" : "day-number pointer"}>
                {props.cmp}
            </p>
            {event ?
            <><button style={{height:35, fontSize: 11, width:'90%', marginBottom : 5}} onClick={openModal}>Afficher rdv({event.length})</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >   
                <div>
                    <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                        <h2>Rendez vous</h2>
                        <button style={{height:20}} onClick={closeModal}>&times;</button>
                    </div>
                    
                    {event.map((item,index)=>{
                        return (
                            <>
                                <div key={item.id + index} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                
                                    <div style={{flexDirection:'column', display:'flex'}}>
                                        <div>
                                            <span>Titre : </span><strong>{event[0].title}</strong>
                                        </div>
                                        <div>
                                            <span>Contenu :</span>{event[0].body}
                                        </div>
                                    </div>
                                    <button style={{height: 20}} id='iuende' onClick={()=>{deleteEvent(item.id)}}>Supprimer</button>
                                </div>
                                <hr  style={{
                                    backgroundColor: '#000000',
                                    height: .1,
                                }}/>
                            </>
                        )
                    })}
                </div>
            </Modal>
            </>
            
            
            : null}
        </div>
    )
}
