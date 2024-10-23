const db = require('../config/db') // connect to db
const bcrypt = require('bcryptjs') //hash passwords
const { validationResult } = require('express-validator') // validation

// register user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req) //so that it can validate for us
    // chech if any errors present in validation
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    // fetch input parameters from the body
    const { first_name, last_name, email, password, role, date_of_birth, language, gender, } = req.body

    if (role === 'patient') {
        existingUser = await Patient.findOne({ where: { email } });
    } else if (role === 'provider') {
    existingUser = await Provider.findOne({ where: { email } });
    } else if (role === 'admin') {
    existingUser = await Admin.findOne({ where: { email } });
    }

    try {
        const [user] = await db.execute('SELECT email FROM patients WHERE email = ?', [email])
        if(user.length > 0) {
            return res.status(404).json({ message: 'The user already exists' });
        }

        // prepare our data
        const hashedPashword = await bcrypt.hash(password, 18)
        await db.execute('INSERT INTO patients(first_name, last_name, email, password, role, date_of_birth, language, gender, password) VALUES (?,?,?,?,?,?,?,?,?)', [first_name, last_name, email, role, date_of_birth, language, gender, hashedPashword])
        return res.status(201).json({ message: 'New user registered successfully ' })
    } catch(err) {
        console.error(err)
        return res.status(500).json({message: 'An error occurred during registration', error: err.message })
    }
}

// Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
        if(user.length === 0) {
            return res.status(404).json({ message: 'The user does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password)

        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email/passowrd combination.' })
        }

        // create session
        req.session.userId = user[0].id;
        req.session.name = user[0].name;
        req.session.email = user[0].email;

        // return res.status(200).json({ message: 'Successful login!' })
        res.redirect('/dashboard')

    } catch(err){
        console.error(err)
        return res.status(500).json({message: 'An error occurred during login', error: err.message })
    }
}

// logout
exports.logoutUser = async (req, res) => {
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
exports.getUser = async (req, res) => {
    if(!req.session.userId) {
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
exports.editUser = async (req, res) => {
    // check if the user is logged in
    if(!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please login to continue.' })
    }

    const errors = validationResult(req) //so that it can validate for us
    // chech if any errors present in validation
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    // fetch user details from request body
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


// if (role === 'patient') {
//     if (!date_of_birth || !language || !gender) {
//       return res.status(400).json({ message: 'All patient fields are required' });
//     }
//   } else if (role === 'provider') {
//     if (!specialty) {
//       return res.status(400).json({ message: 'Specialty is required for doctors' });
//     }
//   }
  
// const bcrypt = require('bcrypt');
// const { Patient, Provider, Admin } = require('../models');  // Your database models

// Register Route
const register = async (req, res) => {
  const { first_name, last_name, email, password, role, date_of_birth, language, gender, specialty } = req.body;

  try {
    // Step 1: Check if the email already exists in any table (patients, providers, admins)
    let existingUser;

    if (role === 'patient') {
      existingUser = await Patient.findOne({ where: { email } });
    } else if (role === 'provider') {
      existingUser = await Provider.findOne({ where: { email } });
    } else if (role === 'admin') {
      existingUser = await Admin.findOne({ where: { email } });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Step 2: Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create the user in the appropriate table based on the role
    let newUser;

    if (role === 'patient') {
      newUser = await Patient.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        date_of_birth,
        language,
        gender,
      });
    } else if (role === 'provider') {
      newUser = await Provider.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        specialty,
      });
    } else if (role === 'admin') {
      newUser = await Admin.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });
    }

    // Respond with success message
    res.status(201).json({ message: 'Registration successful', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = { register };

// const bcrypt = require('bcrypt');
// const { Patient, Provider, Admin } = require('../models');  // Your database models

// Check if the user has the correct role (admin)
// function checkAuthAndRole(requiredRole) {
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       window.location.href = '/login.html'; // Redirect to login if not authenticated
//       return;
//     }
  
//     try {
//       const decoded = jwt.decode(token);
//       if (decoded.role !== requiredRole) {
//         window.location.href = '/login.html'; // Redirect if role doesn't match
//       }
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       window.location.href = '/login.html'; // Invalid token
//     }
//   }
  
//   // Example usage on the admin dashboard
//   checkAuthAndRole('admin'); // Ensure user is an admin before accessing this page
  


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Patient, Provider, Admin } = require('../models');  // Your database models

// Login Route
// const login = async (req, res) => {
//   const { email_address, password } = req.body;

//   try {
//     // Step 1: Check if the user is a patient
//     let user = await Patient.findOne({ where: { email_address } });
    
//     // If not a patient, check if user is a doctor/provider
//     if (!user) {
//       user = await Provider.findOne({ where: { email_address } });
//     }

//     // If not a provider, check if user is an admin
//     if (!user) {
//       user = await Admin.findOne({ where: { email_address } });
//     }

//     // Step 2: If user is not found in any table
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Step 3: Check if the password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Step 4: Generate JWT Token with the user role (patient, provider, admin)
//     const token = jwt.sign(
//       { userId: user.id, role: user.constructor.name.toLowerCase() },  // role will be "patient", "provider", or "admin"
//       'your_jwt_secret',
//       { expiresIn: '1h' }
//     );

//     // Step 5: Return the token and role
//     res.json({ token, role: user.constructor.name.toLowerCase() });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { login };


// middleware to check roles
// const checkRole = (requiredRole) => {
//     return (req, res, next) => {
//       const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the header
//       if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
  
//       try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         if (decoded.role !== requiredRole) {
//           return res.status(403).json({ message: 'Forbidden' }); // User does not have the correct role
//         }
//         req.user = decoded; // Attach user data to the request
//         next();
//       } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//       }
//     };
//   };
  
//   module.exports = checkRole;
  

// const express = require('express');
// const router = express.Router();
// const checkRole = require('../middleware/roleMiddleware');

// // Example protected route for admin
// router.get('/admin/stats', checkRole('admin'), (req, res) => {
//   // Admin-specific logic here
//   res.json({ message: 'Welcome Admin!' });
// });

// module.exports = router;



// Assuming you are using plain JS for handling the login
// document.getElementById("login-form").addEventListener("submit", async (e) => {
//     e.preventDefault();
    
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
  
//     try {
//       const response = await fetch('/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         // Store the JWT token in localStorage
//         localStorage.setItem('token', data.token);
        
//         // Redirect based on the role (patient, doctor, admin)
//         if (data.role === 'admin') {
//           window.location.href = '/admin-dashboard.html';
//         } else if (data.role === 'doctor') {
//           window.location.href = '/doctor-dashboard.html';
//         } else if (data.role === 'patient') {
//           window.location.href = '/patient-dashboard.html';
//         }
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   });
  

// authController.js
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Assuming User model exists

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     // Create JWT token
//     const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

//     // Send token in response
//     res.json({ token, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { login };
