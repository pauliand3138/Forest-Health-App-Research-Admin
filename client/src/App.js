import { useEffect, useState } from "react";
import ListItem from "./components/ListItem";
import ListHeader from "./components/ListHeader";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";
import UserModal from "./components/UserModal";

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const authToken = cookies.AuthToken;
    const userId = cookies.Email;
    const [forms, setForms] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [user, setUser] = useState(null);

    //console.log(user);
    const getData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/forms/${userId}`
            );
            const json = await response.json();
            setForms(json);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/${userId}`);
            const json = await response.json();
            setUser(json);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (authToken) {
            getData();
            getUserData();
        }
    }, []);

    //console.log(user);

    const sortedForms = forms?.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    //console.log(sortedForms);
    return (
        <div className="app">
            {!authToken && <Auth />}
            {authToken && (
                <>
                    <ListHeader
                        listName={"🏝️Forest Health App"}
                        getData={getData}
                    />
                    <p className="user-email">
                        👋 Hello! {user ? user[0].name : ""}
                    </p>
                    {sortedForms?.length == 0 ? (
                        <p className="empty-form">
                            🔎You have not made any research yet.
                        </p>
                    ) : (
                        <></>
                    )}
                    {sortedForms?.map((form) => (
                        <ListItem
                            key={form.formid}
                            form={form}
                            getData={getData}
                        />
                    ))}
                </>
            )}
            <div className="footer">
                <p className="copyright">
                    © 2813ICT Software Engineering Fundamentals - Group 22
                </p>
                {authToken && (
                    <button
                        className="edit-profile"
                        onClick={() => setShowUserModal(true)}
                    >
                        <i
                            className="fa-regular fa-user"
                            style={{ color: "#000000", marginRight: "5px" }}
                        ></i>
                        Manage Profile
                    </button>
                )}
            </div>
            {showUserModal && (
                <UserModal
                    user={user[0]}
                    setShowUserModal={setShowUserModal}
                    getUserData={getUserData}
                />
            )}
        </div>
    );
};

export default App;
