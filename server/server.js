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

// Get all users
app.get("/users/:staffid", async (req, res) => {
    const { staffid } = req.params;

    try {
        const users = await pool.query(
            "SELECT * FROM research_staff WHERE staffid!= $1",
            [staffid]
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err);
    }
});

// Get loggedin user
app.get("/:staffid", async (req, res) => {
    const { staffid } = req.params;
    try {
        const users = await pool.query(
            "SELECT name, isadmin, staffid FROM research_staff WHERE staffid = $1",
            [staffid]
        );
        res.json(users.rows);
    } catch (err) {
        console.error(err);
    }
});

// edit own
app.put("/:staffid", async (req, res) => {
    const { name, password, staffid } = req.body;
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        try {
            const editUser = await pool.query(
                "UPDATE research_staff SET name = $1, password = $2 WHERE staffid = $3;",
                [name, hashedPassword, staffid]
            );
            res.json(editUser);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const editUser = await pool.query(
                "UPDATE research_staff SET name = $1 WHERE staffid = $2;",
                [name, staffid]
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

//edit users
app.put("/users/:staffid", async (req, res) => {
    const { staffid } = req.params;
    const { password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const editForm = await pool.query(
            "UPDATE research_staff SET password = $1 WHERE staffid = $2;",
            [hashedPassword, staffid]
        );
        res.json(editForm);
    } catch (err) {
        console.log(err);
    }
});

// delete
app.delete("/users/:staffid", async (req, res) => {
    const { staffid } = req.params;

    try {
        const deleteUser = await pool.query(
            "DELETE FROM research_staff WHERE staffid = $1;",
            [staffid]
        );
        res.json(deleteUser);
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
