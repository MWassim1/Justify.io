import '../css/home.css';
import React, { useState } from 'react'; 
import axios from "axios"
import {useNavigate} from 'react-router-dom'


function Home(props) {

    const axiosUrlToken = "http://localhost:3001/api/token"

    const navigate = useNavigate()

    const [emailValue, setEmailValue] = useState(''); 


    const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('Email saisi :', emailValue); 

    axios.post(axiosUrlToken, {email :emailValue})
      .then((res) => {
        console.log(res.data);
        navigate('home/'+res.data);
    })
    .catch((error) => {console.log("error : ",error);});

}

const handleEmailChange = (evt) => {
    setEmailValue(evt.target.value);
  };

  return (
    <div className="App">
      <p id='justify_io'>Justify.io</p>
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" name="email" placeholder="Entrez votre adresse e-mail" required value={emailValue} onChange={handleEmailChange}  />
        <br />
        <input type="submit" value="Soumettre" />
      </form>
    </div>
  );
}

export default Home;
