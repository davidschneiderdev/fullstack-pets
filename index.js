const http = require('http');
const express = require('express');

const app = express();
const PORT = 3000;

const server = http.createServer(app);

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');
app.use(express.static('public'));

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({extended: true});

const pets = require('./models/pets');



app.get('/', (req, res) => {res.send(`<h1>Welcome to Pet Database</h1>`);});

app.get('/pets', async (req, res) => {
    const thePets = await pets.all();
    res.json(thePets);
});

//Create
app.get('/pets/create', async(req, res) => {
    res.render('form');
})

app.post('/pets/create', parseForm, async(req, res) => {
    // console.log(req.body);
    const { name, species, birthdate, owner_id }  = req.body;
    const newPetId = await pets.create(name, species, birthdate, owner_id);
    // console.log(newPetId);
    res.redirect(`/pets/${newPetId}`);
    // res.send('New pet added to database!');
});

app.get('/pets/:id', async(req, res) => {
    const pet = await pets.one(req.params.id);
    res.json(pet);
})

//Update
app.get('/pets/:id/edit', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const thePet = await pets.one(id);
    res.render('editPet', {
        locals: {
            name: thePet.name,
            birthdate: thePet.birthdate
        }
    });
}); 

app.post('/pets/:id/edit', parseForm, async(req, res) => {
    const { name, birthdate } = req.body;
    const updatedPet = await pets.updateName(req.params.id, name);
    res.send('Pet information updated!');
});

//Delete
app.get('/pets/:id/delete', (req, res) => {
    res.render('deleteForm');
})

app.post('/pets/:id/delete', parseForm, async (req, res) => {
    // console.log(req.body.deletePetInfo);
    if (req.body.deletePetInfo === "yes") {
        await pets.del(req.params.id);
        res.send("Pet info deleted.");
    } else {
        res.send("Okay, we will not delete at this time.");
    }
})


server.listen(PORT, () => {console.log(`Listening at port ${PORT}`);});
