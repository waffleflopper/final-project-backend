const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'final-project'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//signin route
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong crednetials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
})

//register route
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx('login').insert({
            hash: hash,
            email: email
        })
        .returning('email')
        .then(loginEmail => {
            return trx('users').returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then (user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register, try a different email'))
})


// profile route
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('ERROR: User not found.');
            }
        });
});

// image route
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if (entries.length) {
            res.json(entries[0]);
        } else {
            res.status(400).json('ERROR: User not found.');
        }
        
    })
    .catch(err => res.status(400).json('unable to get count, might be table issues'))
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
