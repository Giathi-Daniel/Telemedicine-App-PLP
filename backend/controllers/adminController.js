const db = require('../config/db')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

// register admin
exports.registerAdmin = async (req, res) => {
    const errors = validationResult(req) 

    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    const { first_name, last_name, email, password, phone_number } = req.body

    try {
        const [admin] = await db.execute('SELECT email FROM admins WHERE email = ?', [email])
        if(admin.length > 0) {
            return res.status(404).json({ message: 'The admin already exists' });
        }

        const hashedPashword = await bcrypt.hash(password, 18)
        await db.execute('INSERT INTO admins(first_name, last_name, email, password, phone_number) VALUES (?,?,?,?,?)', [first_name, last_name, email, hashedPashword, phone_number])
        return res.status(201).json({ message: 'New Doctor registered successfully ' })
    } catch(err) {
        console.error(err)
        return res.status(500).json({message: 'An error occurred during registration', error: err.message })
    }
}

// Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body

    try {
        const [admin] = await db.execute('SELECT * FROM admins WHERE email = ?', [email])
        if(admin.length === 0) {
            return res.status(404).json({ message: 'The admin does not exist' });
        }

        const isMatch = await bcrypt.compare(password, admin[0].password)

        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email/passowrd combination.' })
        }

        // create session
        req.session.user = {
            id: admin.id,
            email: admin.email,
            role: 'admin' 
        };

        res.redirect('/dashboard')

    } catch(err){
        console.error(err)
        return res.status(500).json({message: 'An error occurred during login', error: err.message })
    }
}

// logout
exports.logoutAdmin = async (req, res) => {
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

// get admin info
exports.getAdmin = async (req, res) => {
    if(!req.session.adminId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in' })
    }

    try {
        const [admin] = db.execute('SELECT name, email FROM admins WHERE email = ?', [email])
        if(admin.length === 0) {
            return res.status(404).json({ message: 'The admin does not exist' });
        }


        return res.status(200).json({ message: 'Details fetched for editing!', admin: admin[0] })

    } catch(err){
        console.error(err)
        return res.status(500).json({message: 'An error occurred while fetching details', error: err.message })
    }
}

// edit admin
exports.editAdmin = async (req, res) => {
    // check if the admin is logged in
    if(!req.session.adminId) {
        return res.status(401).json({ message: 'Unauthorized. Please login to continue.' })
    }

    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    const { first_name, last_name, email, password, phone_number } = req.body 

    const hashedPashword = await bcrypt.hash(password, 18)
    
    try {
        await db.execute('UPDATE admin SET first_name = ?, last_name = ?, email = ?, password = ?, phone_number = ? WHERE id = ?', [first_name, last_name, email, hashedPashword, phone_number, req.session.adminId])
        return res.status(200).json({ message: 'admin details updated successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error updating details', error: error.message })
    }
}
