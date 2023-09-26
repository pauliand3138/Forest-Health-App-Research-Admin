const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// Get all form submissions
app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const users = await pool.query(
            "SELECT * FROM research_staff WHERE staffid!= $1",
            [userId]
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err);
    }
});

// Get user form submissions
app.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    //console.log(userId);
    try {
        const users = await pool.query(
            "SELECT name, isadmin FROM research_staff WHERE staffid = $1",
            [userId]
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err);
    }
});

// edit user

app.put("/:userid", async (req, res) => {
    const { name, password, gender, dateofbirth, userid } = req.body;
    console.log(userid);
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        try {
            const editUser = await pool.query(
                "UPDATE citizen_scientist SET name = $1, password = $2, gender = $3, dateofbirth = $4 WHERE userid = $5;",
                [name, hashedPassword, gender, dateofbirth, userid]
            );
            res.json(editUser);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const editUser = await pool.query(
                "UPDATE citizen_scientist SET name = $1, gender = $2, dateofbirth = $3 WHERE userid = $4;",
                [name, gender, dateofbirth, userid]
            );
            res.json(editUser);
        } catch (err) {
            console.log(err);
        }
    }
});

// Create new
app.post("/users", async (req, res) => {
    const { staffid, name, password, isadmin } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const newUser = await pool.query(
            `INSERT INTO research_staff(staffid, password, name, isadmin) VALUES($1, $2, $3, $4);`,
            [staffid, hashedPassword, name, isadmin]
        );
        res.json(newUser);
    } catch (err) {
        console.log(err);
    }
});

//edit
app.put("/users/:userid", async (req, res) => {
    const { userid } = req.params;
    console.log(userid);
    const { password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const editForm = await pool.query(
            "UPDATE research_staff SET password = $1 WHERE staffid = $2;",
            [hashedPassword, userid]
        );
        res.json(editForm);
    } catch (err) {
        console.log(err);
    }
});

// delete
app.delete("/forms/:formid", async (req, res) => {
    const { formid } = req.params;

    try {
        const deleteForm = await pool.query(
            "DELETE FROM form WHERE formid = $1;",
            [formid]
        );
        res.json(deleteForm);
    } catch (err) {
        console.log(err);
    }
});

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await pool.query(
            "SELECT * FROM research_staff WHERE staffid = $1",
            [email]
        );

        if (!users.rows.length)
            return res.json({ detail: "User does not exist in system!" });

        const success = await bcrypt.compare(password, users.rows[0].password);

        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

        if (success) {
            res.json({ staffid: users.rows[0].staffid, token });
        } else {
            res.json({ detail: "Username or Password incorrect!" });
        }
    } catch (err) {
        console.log(err);
    }
});
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
