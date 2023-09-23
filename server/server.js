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
app.get("/forms/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const forms = await pool.query("SELECT * FROM form WHERE userId= $1", [
            userId,
        ]);
        res.json(forms.rows);
    } catch (err) {
        console.error(err);
    }
});

// Get user form submissions
app.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const forms = await pool.query(
            "SELECT * FROM citizen_scientist WHERE userId= $1",
            [userId]
        );
        res.json(forms.rows);
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
app.post("/forms", async (req, res) => {
    const {
        location,
        date,
        landscapeid,
        vegtypeid,
        vegstageid,
        burnsevid,
        userid,
    } = req.body;
    console.log(
        location,
        date,
        landscapeid,
        vegtypeid,
        vegstageid,
        burnsevid,
        userid
    );
    const formid = uuidv4();
    try {
        const newForm = await pool.query(
            `INSERT INTO form(formid, location, date, landscapeid, vegtypeid, vegstageid, burnsevid, userid) VALUES($1, $2, $3, $4, $5, $6, $7, $8);`,
            [
                formid,
                location,
                date,
                landscapeid,
                vegtypeid,
                vegstageid,
                burnsevid,
                userid,
            ]
        );
        res.json(newForm);
    } catch (err) {
        console.log(err);
    }
});

//edit
app.put("/forms/:formid", async (req, res) => {
    const { formid } = req.params;
    console.log(formid);
    const {
        location,
        date,
        landscapeid,
        vegtypeid,
        vegstageid,
        burnsevid,
        userid,
    } = req.body;

    try {
        const editForm = await pool.query(
            "UPDATE form SET userid = $1, location = $2, date = $3, landscapeid = $4, vegtypeid = $5, vegstageid = $6, burnsevid = $7 WHERE formid = $8;",
            [
                userid,
                location,
                date,
                landscapeid,
                vegtypeid,
                vegstageid,
                burnsevid,
                formid,
            ]
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

// signup
app.post("/signup", async (req, res) => {
    const { email, password, name, gender, dateOfBirth } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        await pool.query(
            `INSERT INTO citizen_scientist (userid, password, name, gender, dateofbirth) VALUES($1, $2, $3, $4, $5)`,
            [email, hashedPassword, name, gender, dateOfBirth]
        );

        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

        res.json({ email, token });
    } catch (err) {
        console.log(err);
        if (err) {
            res.json({ detail: "Email already exist!" });
        }
    }
});

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await pool.query(
            "SELECT * FROM citizen_scientist WHERE userid = $1",
            [email]
        );

        if (!users.rows.length)
            return res.json({ detail: "User does not exist in system!" });

        const success = await bcrypt.compare(password, users.rows[0].password);

        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

        if (success) {
            res.json({ email: users.rows[0].userid, token });
        } else {
            res.json({ detail: "Username or Password incorrect!" });
        }
    } catch (err) {
        console.log(err);
    }
});
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
