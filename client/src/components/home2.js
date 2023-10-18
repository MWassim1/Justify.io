import '../css/home2.css';
import React, { useState,useRef,useEffect } from 'react'; 
import axios from "axios"


function Home2(props) {
    const axiosUrlJustify ="http://localhost:3000/api/justify"
    const axiosUrlgetEmail = "http://localhost:3001/api/getemail/"

    const areainput = useRef(null)
    const url = window.location.href
    const last_slash = url.lastIndexOf('/')
    const token = url.slice(last_slash+1)
    
    const [text, setText] = useState(''); 
    const [email,setEmail] = useState('');
    const [justify,setJustify] = useState('');
    const [payment,setPayment] = useState('');

    useEffect(()=>{
        axios.get(axiosUrlgetEmail+token)
            .then(res=>{
                setEmail(res.data)
            })
            .catch((err)=>{console.log(err)})


    })
    
    const handleTextChange = (event) => {
      setText(event.target.value);
    };
  
    const handleButtonClick = (evt) => {
        evt.preventDefault()
        if(text.trim() !== ""){
            axios.post(axiosUrlJustify,{email:email,text:text})
            .then(res =>{
                if(res.status === 200){
                    setJustify(res.data)
                    document.getElementById("popup_text_justified").style.visibility = "visible"
                }
            })
            .catch((err)=>{
                setPayment(err.response.data)
                document.getElementById("popup_text_payment").style.visibility = "visible"


            })
            areainput.current.value = ""
            setText('');
        }

    };

    const onEnterKey = (evt) => {
        if(evt.keyCode === 13 && evt.shiftKey === false) {
          handleButtonClick(evt)
        }
      }
    
      const handleHideJustified = (evt) =>{
        document.getElementById("popup_text_justified").style.visibility = "hidden"
      }
      const handleHidePayment = (evt) =>{
        document.getElementById("popup_text_payment").style.visibility = "hidden"
      }

  return (
    <div className="input-with-button">
        <p id='justify_io2'>Justify.io</p>
        <textarea id='textarea' ref = {areainput} className='textarea' placeholder="Entrez du texte..."value={text} onChange={handleTextChange} onKeyDown={onEnterKey}/>
        <button id='button_area' onClick={handleButtonClick}>Envoyer</button>
        <div id="popup_text_justified">
            <p id="text_popup_text_justified" style={{ whiteSpace: "pre-wrap" }}>{justify}</p>
            <button id="button_text_justified" onClick={handleHideJustified}>Fermer</button>
        </div>
        <div id="popup_text_payment">
            <p id="text_popup_text_payment" style={{ whiteSpace: "pre-wrap" }}>{payment}</p>
            <button id="button_text_payment" onClick={handleHidePayment}>Fermer</button>
        </div>
    </div>
  );
}

export default Home2;
