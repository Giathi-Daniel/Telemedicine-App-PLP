const db = require('../config/db')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

// register user
exports.registerProvider = async (req, res) => {
    const errors = validationResult(req) 

    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    const { first_name, last_name, provider_specialty, email, password,phone_number } = req.body

    try {
        const [provider] = await db.execute('SELECT email FROM providers WHERE email = ?', [email])
        if(provider.length > 0) {
            return res.status(404).json({ message: 'The user already exists' });
        }

        const hashedPashword = await bcrypt.hash(password, 18)
        await db.execute('INSERT INTO providers(first_name, last_name, provider_specialty, email, password,phone_number) VALUES (?,?,?,?,?,?)', [first_name, last_name, provider_specialty, email, hashedPashword, phone_number])
        return res.status(201).json({ message: 'New Doctor registered successfully ' })
    } catch(err) {
        console.error(err)
        return res.status(500).json({message: 'An error occurred during registration', error: err.message })
    }
}

// Login
exports.loginProvider = async (req, res) => {
    const { email, password } = req.body

    try {
        const [provider] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
        if(provider.length === 0) {
            return res.status(404).json({ message: 'The user does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password)

        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email/passowrd combination.' })
        }

        // create session
        req.session.userId = provider[0].id;
        req.session.email = provider[0].email;

        res.redirect('/dashboard')

    } catch(err){
        console.error(err)
        return res.status(500).json({message: 'An error occurred during login', error: err.message })
    }
}

// logout
exports.logoutProvider = async (req, res) => {
    req.session.destroy( 
        (err) => {
            if(err) {
                console.error(err)
                return res.status(500).json({ message: 'An error occured destroying session', error: err.message })
            }
            return res.status(201).json({ message: 'Successfully loged out' })
        }
    )
}

// get user info
exports.getProvider = async (req, res) => {
    if(!req.session.providerId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in' })
    }

    try {
        const [user] = db.execute('SELECT name, email FROM users WHERE email = ?', [email])
        if(user.length === 0) {
            return res.status(404).json({ message: 'The user does not exist' });
        }


        return res.status(200).json({ message: 'Details fetched for editing!', user: user[0] })

    } catch(err){
        console.error(err)
        return res.status(500).json({message: 'An error occurred while fetching details', error: err.message })
    }
}

// edit user
exports.editProvider = async (req, res) => {
    // check if the user is logged in
    if(!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please login to continue.' })
    }

    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    const { name, email, password } = req.body 

    const hashedPashword = await bcrypt.hash(password, 18)
    
    try {
        await db.execute('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPashword, req.session.userId])
        return res.status(200).json({ message: 'User details updated successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error updating details', error: error.message })
    }
}
