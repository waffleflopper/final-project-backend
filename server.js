const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '234',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'apples',
            entries: 0,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com',
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

//signin route
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    res.json('signin');  //kind of like send()


})

//register route
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    /* bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    }); */
    database.users.push({
        id: '142',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    })
    res.json(database.users[database.users.length-1]);
})

const findUser = id => {
    const userArray = database.users.filter(user=>user.id===id);
    return userArray[0]; //should never have more than 1 value returned, because it's a key
}

// profile route
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = findUser(id);
    if (user != undefined) { 
        return res.json(user);
    } else {
        return res.status(400).json('not found');
    }
})

// image route
app.put('/image', (req, res) => {
    const { id } = req.body;
    const user = findUser(id);
    if (user) {
        user.entries++;
        return res.json(user.entries);
    } else {
        return res.status(400).json('user not found');
    }
})

/* bcrypt.hash("bacon", null, null, (err, hash) => {
    //store hash in your password db
})

bcrypt.compare("bacon", hash, (err, res) => {
    // res == true.
}) */

app.listen(3000, () => {
    console.log('server is running on port 3000');
});



/*
/ --> res = this is working
/signin --> POST  success/fail
/register --> POST   user
/profile/:userId --> GET  return user info
/image --> PUT (update) return user (count for rank)
*/