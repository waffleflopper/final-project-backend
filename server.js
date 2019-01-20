const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: 123,
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 33,
            joined: new Date(),
        },
        {
            id: 234,
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entires: 23,
            joined: new Date(),
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})


app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    res.json('signin');  //kind of like send()


})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: 142,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    })

    res.json(database.users[database.users.length-1]);
})



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