import React, { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";

const ListHeader = ({ listName, getData, user }) => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [showModal, setShowModal] = useState(false);
    //console.log(user);
    const signOut = () => {
        console.log("signout");
        removeCookie("ResearchEmail");
        removeCookie("ResearchAuthToken");
        window.location.reload();
    };

    return (
        <div className="list-header">
            <h1>{listName}</h1>
            <div className="button-container">
                {user.isadmin && (
                    <button
                        className="create"
                        onClick={() => setShowModal(true)}
                    >
                        <i
                            className="fa-solid fa-user-plus"
                            style={{ color: "#ff8c00", marginRight: "5px" }}
                        ></i>
                        Add New Staff
                    </button>
                )}

                <button className="signout" onClick={signOut}>
                    <i
                        className="fa-solid fa-right-from-bracket"
                        style={{ color: "#ffffff", marginRight: "5px" }}
                    ></i>
                    Sign Out
                </button>
            </div>
            {showModal && (
                <Modal
                    mode={"create"}
                    setShowModal={setShowModal}
                    getData={getData}
                />
            )}
        </div>
    );
};

export default ListHeader;
