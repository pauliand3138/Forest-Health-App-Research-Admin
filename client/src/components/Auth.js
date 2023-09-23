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
    const [gender, setGender] = useState("Male");
    const [dateOfBirth, setDateOfBirth] = useState(null);

    //console.log(email, password, confirmPassword, gender, dateOfBirth);

    const viewLogin = (status) => {
        setError(null);
        setIsLogin(status);
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        if (
            !isLogin &&
            (!password || !confirmPassword || !name || !gender || !dateOfBirth)
        ) {
            setError("All fields must not be empty!");
            return;
        } else if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const response = await fetch(`http://localhost:8000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                name,
                gender,
                dateOfBirth,
            }),
        });

        const data = await response.json();

        if (data.detail) {
            setError(data.detail);
        } else {
            setCookie("Email", data.email);
            setCookie("AuthToken", data.token);

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
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
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
                    {!isLogin && (
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            required
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    )}
                    {!isLogin && (
                        <select
                            onChange={(e) => setGender(e.target.value)}
                            name="gender"
                            id="gender"
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
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
                <div className="auth-options">
                    <button
                        onClick={() => viewLogin(false)}
                        style={{
                            backgroundColor: !isLogin
                                ? "rgb(255,255,255)"
                                : "rgb(188,188,188)",
                        }}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => viewLogin(true)}
                        style={{
                            backgroundColor: isLogin
                                ? "rgb(255,255,255)"
                                : "rgb(188,188,188)",
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
