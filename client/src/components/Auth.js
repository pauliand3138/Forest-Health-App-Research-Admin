import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [name, setName] = useState(null);

    //console.log(email, password, confirmPassword, gender, dateOfBirth);

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All fields must not be empty!");
            return;
        }

        const response = await fetch(`http://localhost:8000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                name,
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
                    <h2>
                        {isLogin
                            ? "Welcome back! Please log in"
                            : "Hello! Please sign up!"}
                    </h2>
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
                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    <input
                        type="submit"
                        className="create"
                        onClick={(e) =>
                            handleSubmit(e, isLogin ? "login" : "signup")
                        }
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Auth;
