import React, { useState } from "react";

const UserModal = ({ user, getUserData, setShowUserModal }) => {
    const [name, setName] = useState(user?.name);
    const [password, setPassword] = useState(null);
    const [retypePassword, setRetypePassword] = useState(null);
    const [error, setError] = useState("");
    //console.log(user);

    const updateUser = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Name must not be empty!");
            return;
        }

        if (name == user.name && !password && !retypePassword) {
            setError("No attributes to be updated!");
            return;
        }

        if (password !== retypePassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/${user.staffid}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        password,
                        staffid: user.staffid,
                    }),
                }
            );

            if (response.detail) {
                setError(response.detail);
            }

            if (response.status === 200) {
                setShowUserModal(false);
                getUserData();
                setError("");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's edit your profile</h3>
                    <button onClick={() => setShowUserModal(false)}>X</button>
                </div>

                <form>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <br />
                    <hr
                        style={{
                            color: "lightgray",
                            backgroundColor: "lightgray",
                            height: "0.1px",
                            borderColor: "lightgray",
                            width: "100%",
                        }}
                    />
                    <br />
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Retype Password</label>
                    <input
                        type="password"
                        placeholder="Retype Password"
                        required
                        onChange={(e) => setRetypePassword(e.target.value)}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <input
                        className={"edit"}
                        type="submit"
                        onClick={(e) => updateUser(e)}
                    />
                </form>
            </div>
        </div>
    );
};

export default UserModal;
