const UsersModel = require('./models/users.model')
const crypto = require('crypto');





module.exports.getToken = async(req,res) =>{

        const jwt = require('jsonwebtoken'); 
        const secretKey = crypto.randomBytes(32).toString('hex');

        const { email } = req.body;  
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/; // Nous permet de vérifier si 'email' est valide
        if (!email || !emailRegex.test(email)) {
          return res.status(400).json({ error: 'Email is invalid.' });
        }

        const check_email = (await UsersModel.findOne({email : email}));
        if(!check_email){
             
            // Génère le token en utilisant la clé secrète
            const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
            await UsersModel.create({
                email:email,
                token : token, // J'ai longtemps hésité de stocker ou non le token dans la base de données d'un point de vue sécurité.
                words_per_day:0
            })
           return res.status(200).json({ token });
        }
        return res.status(200).send(check_email.token);
          
}


module.exports.justifyText = async(req,res) => {
    const {email,text} = req.body; // On peut imaginer que l'email pourrait être récupéré avec un GET au préalable pour pouvoir être injecté au moment du POST
    const user = await UsersModel.findOne({email : email});
    if(!user){
        return res.status(404).json({ error: 'User Not Found' });
    }
    if(!text) {
        return res.status(400).json({ error: 'Text is required.' });
    }

    const now = new Date();
    const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // +1 --> Récupère le prochain jour
    const millisecondsUntilReset = resetTime - now;
    
    // Permet de reinitialiser le compteur de mots

    if (millisecondsUntilReset <= 0) {  
        await UsersModel.updateOne({ email: email }, { $set: { words_per_day: 0 } });
    }


    const tab = text.split(' '); // Récupère les mots dans un tableau

    let words_per_day = user.words_per_day+tab.length;
    if(words_per_day > 800000){ // Vérifie si on a dépassé le quota de mots par jour
        return res.status(402).send('Payment Required');
    }
    await UsersModel.updateOne({email:email},{$set : {words_per_day:words_per_day}});

    let currentLine = ''; // Nous permet de stocker les lignes
    const res_lines = []; // Va nous permettre de stocker nos lignes 'justifiées'.
    tab.forEach(word => {
      if (currentLine.length + word.length <= 80) {
        currentLine += word + ' '; // On ajoute le mot courant à la ligne
      } else {
        // Alors notre ligne contient plus de 80 caractères
        res_lines.push(currentLine.trim()); // Ajoute à notre tableau la ligne de 80 caractères
        currentLine = word + ' '; // Permets de recommencer notre prochaine ligne
      }
    });
  
    // Ajoutez la dernière ligne (peut être moins de 80 caractères)
    res_lines.push(currentLine.trim());
     
    res.status(200).send(res_lines.join('\n'));
  }

module.exports.getEmail = async(req,res)=>{
  const user = await UsersModel.findOne({token:req.params.token})
  if(!user){
    return res.status(404).json({ error: 'User Not Found' });
  }
  return res.status(200).send(user.email);

}


