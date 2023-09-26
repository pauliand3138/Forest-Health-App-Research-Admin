import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    //console.log(email, password, confirmPassword, gender, dateOfBirth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All fields must not be empty!");
            return;
        }

        const response = await fetch(`http://localhost:8000/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (data.detail) {
            setError(data.detail);
        } else {
            setCookie("ResearchEmail", data.staffid);
            setCookie("ResearchAuthToken", data.token);

            window.location.reload();
        }

        console.log(data);
    };
    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>Welcome back! Please log in</h2>
                    <input
                        type="email"
                        placeholder="Staff ID"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="submit"
                        className="create"
                        onClick={(e) => handleSubmit(e)}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Auth;
