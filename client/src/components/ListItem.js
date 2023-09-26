import React, { useState } from "react";
import FormIcon from "./FormIcon";
import Modal from "./Modal";

const ListItem = ({ user, getData, isadmin }) => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState(null);

    //console.log(isadmin);
    const deleteItem = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/users/${user.staffid}`,
                {
                    method: "DELETE",
                }
            );
            if (response.status === 200) {
                getData();
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <li className="list-item">
            <div className="info-container">
                <FormIcon isadmin={user.isadmin} />
                <p>{user.name}</p>
            </div>
            {isadmin && (
                <>
                    <div className="button-container">
                        <button
                            className="edit"
                            onClick={() => {
                                setMode("edit");
                                setShowModal(true);
                            }}
                        >
                            <i
                                className="fa-solid fa-user-shield"
                                style={{ color: "#008000", marginRight: "5px" }}
                            ></i>
                            Set Temporary Password
                        </button>
                        <button className="delete" onClick={deleteItem}>
                            <i
                                className="fa-solid fa-user-slash"
                                style={{ color: "#ff0000", marginRight: "5px" }}
                            ></i>
                            Delete Staff
                        </button>
                    </div>
                    {showModal && (
                        <Modal
                            mode={mode}
                            setShowModal={setShowModal}
                            getData={getData}
                            user={user}
                        />
                    )}
                </>
            )}
            <p class="user-type">{user.isadmin ? "Admin" : "User"}</p>
        </li>
    );
};

export default ListItem;
