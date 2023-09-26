import React from "react";
import { useState } from "react";

const Modal = ({ mode, setShowModal, getData, user }) => {
    const editMode = mode === "edit" ? true : false;
    const [error, setError] = useState(null);

    const [data, setData] = useState({
        staffid: editMode ? user.staffid : "",
        name: editMode ? user.name : "",
        password: "",
        retypepassword: "",
        isadmin: false,
    });

    const postData = async (e) => {
        e.preventDefault();

        if (
            !data.staffid ||
            !data.name ||
            !data.password ||
            !data.retypepassword
        ) {
            setError("All fields must not be empty!");
            return;
        }

        if (data.password !== data.retypepassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/users/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.status === 200) {
                //console.log("WORKED");
                setShowModal(false);
                getData();
                setError("");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const editData = async (e) => {
        if (data.password === "" || data.retypepassword === "") {
            setError("Password(s) must not be empty!");
            return;
        } else if (data.password !== data.retypepassword) {
            setError("Passwords do not match!");
            return;
        }

        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:8000/users/${user.staffid}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            console.log(response);
            if (response.status === 200) {
                setShowModal(false);
                getData();
                setError("");
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        //console.log(data);
    };

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>
                        {mode == "edit"
                            ? `Set Temporary Password for ${data.name}`
                            : "Let's add a new staff!"}
                    </h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>

                <form>
                    {!editMode && (
                        <>
                            <label>Staff ID</label>
                            <input
                                name="staffid"
                                type="text"
                                placeholder="Name"
                                required
                                value={data.staffid}
                                onChange={handleChange}
                            />
                            <br />
                            <label>Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Name"
                                required
                                value={data.name}
                                onChange={handleChange}
                            />
                            <br />
                        </>
                    )}

                    <label>Temporary Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Temporay Password"
                        required
                        value={data.password}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Confirm Temporary Password</label>
                    <input
                        name="retypepassword"
                        type="password"
                        placeholder="Confirm Temporary Password"
                        required
                        value={data.retypepassword}
                        onChange={handleChange}
                    />

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {(mode == "edit" || mode == "create") && (
                        <input
                            className={mode}
                            type="submit"
                            onClick={editMode ? editData : postData}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default Modal;
