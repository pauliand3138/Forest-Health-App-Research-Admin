import { useEffect, useState } from "react";
import ListItem from "./components/ListItem";
import ListHeader from "./components/ListHeader";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";
import UserModal from "./components/UserModal";

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const authToken = cookies.ResearchAuthToken;
    const staffId = cookies.ResearchEmail;
    const [users, setUsers] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [user, setUser] = useState(null);
    const [userIsAdmin, setUserIsAdmin] = useState(null);

    //console.log(user);
    const getData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/users/${staffId}`
            );
            const json = await response.json();

            setUsers(json);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/${staffId}`);
            const json = await response.json();
            setUser(json);
            setUserIsAdmin(user[0].isadmin);
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

    return (
        <>
            <div className="app">
                {!authToken && <Auth />}
                {authToken && (
                    <>
                        <ListHeader
                            listName={"👨🏻‍💼FHA Research Admin Dashboard"}
                            getData={getData}
                            user={user ? user[0] : ""}
                        />
                        <p className="user-email">
                            👋 Hello! {user ? user[0].name : ""}
                        </p>
                        {users?.length == 0 ? (
                            <p className="empty-form">
                                🔎 No users found in the system.
                            </p>
                        ) : (
                            <></>
                        )}
                        {users?.map((u) => (
                            <ListItem
                                key={u.staffid}
                                user={u}
                                getData={getData}
                                isadmin={user ? user[0].isadmin : ""}
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
            {authToken && !userIsAdmin && (
                <p className="privilege-type">
                    ⚠️ You are logged in with limited privileges
                </p>
            )}
        </>
    );
};

export default App;
