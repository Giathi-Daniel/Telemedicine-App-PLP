const db = require("../config/db"); // connect to db
const bcrypt = require("bcryptjs"); //hash passwords
const { validationResult } = require("express-validator"); // validation

// register user
exports.registerUser = async (req, res) => {
  const errors = validationResult(req); //so that it can validate for us
  console.log(errors);
  // chech if any errors present in validation
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Please correct input errors", errors: errors.array() });
  }

  // fetch input parameters from the body
  const {
    first_name,
    last_name,
    email,
    password,
    date_of_birth,
    language,
    gender,
  } = req.body;

  console.log(req.body);

  try {
    const [user] = await db.execute(
      "SELECT email FROM patients WHERE email = ?",
      [email]
    );
    if (user.length > 0) {
      return res.status(404).json({ message: "The user already exists" });
    }

    // prepare our data
    const hashedPashword = await bcrypt.hash(password, 18);
    await db.execute(
      "INSERT INTO patients(first_name, last_name, password, email,date_of_birth, language, gender) VALUES (?,?,?,?,?,?,?)",
      [
        first_name,
        last_name,
        hashedPashword,
        email,
        date_of_birth,
        language,
        gender,
      ]
    );
    return res
      .status(201)
      .json({ message: "New user registered successfully " });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during registration",
      error: err.message,
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute("SELECT * FROM patients WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ message: "The user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email/passowrd combination." });
    }

    // create session
    req.session.user = {
      id: user.id,
      email: user.email,
      role: "patient",
    };

    return res.status(200).json({ message: "Successful login!" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred during login", error: err.message });
  }
};


// get user info
exports.getUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const [user] = await db.execute(
      "SELECT first_name, last_name, email FROM patients WHERE id = ?",
      [userId]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User profile fetched", user: user[0] });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

// editUser
exports.editUser = async (req, res) => {
  const userId = req.session.user.id;
  const { first_name, last_name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation errors", errors: errors.array() });
  }

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const query =
      "UPDATE patients SET first_name = ?, last_name = ?, email = ?" +
      (hashedPassword ? ", password = ?" : "") +
      " WHERE id = ?";
    const params = hashedPassword
      ? [first_name, last_name, email, hashedPassword, userId]
      : [first_name, last_name, email, userId];

    await db.execute(query, params);
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// logout
exports.logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "An error occured destroying session",
        error: err.message,
      });
    }
    return res.status(201).json({ message: "Successfully loged out" });
  });
};