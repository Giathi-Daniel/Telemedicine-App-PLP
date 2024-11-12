const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const path = require("path");

// register provider
exports.registerProvider = async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body)

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Please correct input errors", errors: errors.array() });
  }

  const {
    first_name,
    last_name,
    password,
    provider_specialty,
    email,
    phone_number,
  } = req.body;

  try {
    const [provider] = await db.execute(
      "SELECT email FROM providers WHERE email = ?",
      [email]
    );
    if (provider.length > 0) {
      return res.status(404).json({ message: "The provider already exists" });
    }

    const hashedPashword = await bcrypt.hash(password, 18);
    await db.execute(
      "INSERT INTO providers(first_name, last_name, password, provider_specialty, email, phone_number) VALUES (?,?,?,?,?,?)",
      [
        first_name,
        last_name,
        hashedPashword,
        provider_specialty,
        email,
        phone_number,
      ]
    );
    return res
      .status(201)
      .json({ message: "New Doctor registered successfully " });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "An error occurred during registration",
        error: err.message,
      });
  }
};

// Login
exports.loginProvider = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [provider] = await db.execute(
      "SELECT * FROM providers WHERE email = ?",
      [email]
    );
    if (provider.length === 0) {
      return res.status(404).json({ message: "The provider does not exist" });
    }

    const isMatch = await bcrypt.compare(password, provider[0].password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email/passowrd combination." });
    }

    // create session
    req.session.user = {
      id: provider[0].provider_id,
      email: provider[0].email,
      role: "provider",
    };

    return res.status(200).json({ message: "Successful login!" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred during login", error: err.message });
  }
};

// logout
exports.logoutProvider = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({
          message: "An error occured destroying session",
          error: err.message,
        });
    }
    return res.status(201).json({ message: "Successfully loged out" });
  });
};

// get provider info

exports.getProvider = async (req, res) => {
  // Check if the provider is logged in
  if (req.session.user.role !== 'provider') {
    return res.status(401).json({ message: "Unauthorized. Please log in" });
  }

  const email = req.session.user.email
  // console.log(email)

  try {
    // Fetch provider details from the database
    const [provider] = await db.execute(
      "SELECT first_name, last_name, provider_specialty, email FROM providers WHERE email = ?",
      [email]
    );

    // If the provider does not exist, return a 404 status with a message//+
    if (provider.length === 0) {
      return res.status(404).json({ message: "The provider does not exist" });
    }

    // If the provider exists, return a 200 status with a message and the provider details//+
    return res
      .status(200)
      .json({ message: "Details fetched for editing!", provider: provider[0] });
  } catch (err) {
    // If there is a database error, log the error and return a 500 status with a message//+
    console.error(err);
    return res
      .status(500)
      .json({
        message: "An error occurred while fetching details",
        error: err.message,
      });
  }
};

// edit provider
exports.editProvider = async (req, res) => {
  // check if the provider is logged in
  if (!req.session.providerId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login to continue." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Please correct input errors", errors: errors.array() });
  }

  const { first_name, last_name, provider_specialty, email, phone_number } =
    req.body;

  try {
    await db.execute(
      "UPDATE providers SET first_name = ?, last_name = ?, provider_specialty = ?, email = ?, phone_number = ? WHERE id = ?",
      [
        first_name,
        last_name,
        provider_specialty,
        email,
        phone_number,
        req.session.providerId,
      ]
    );
    return res
      .status(200)
      .json({ message: "provider details updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating details", error: error.message });
  }
};

exports.dashboardProvider = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/doctor', 'dashboard.html'))
}

// app.get('/provider/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/doctor', 'dashboard.html'))
// })

exports.profileProvider = (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/doctor', 'profile.html'))
  // res.send('Welcome to Provider Profile Page')
}