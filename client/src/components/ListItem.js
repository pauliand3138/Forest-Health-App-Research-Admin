import React, { useState } from "react";
import FormIcon from "./FormIcon";
import Modal from "./Modal";

const ListItem = ({ form, getData }) => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState(null);

    const deleteItem = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/forms/${form.formid}`,
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
                <FormIcon />
                <p>{form.location}</p>
            </div>

            <div className="button-container">
                <p style={{ color: "gray" }}>{form.date}</p>
                <button
                    className="view"
                    onClick={() => {
                        setMode("view");
                        setShowModal(true);
                    }}
                >
                    <i
                        className="fa-regular fa-eye"
                        style={{ color: "#3651d9", marginRight: "5px" }}
                    ></i>
                    View
                </button>
                <button
                    className="edit"
                    onClick={() => {
                        setMode("edit");
                        setShowModal(true);
                    }}
                >
                    <i
                        className="fa-regular fa-pen-to-square"
                        style={{ color: "#008000", marginRight: "5px" }}
                    ></i>
                    Edit
                </button>
                <button className="delete" onClick={deleteItem}>
                    <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#ff0000", marginRight: "5px" }}
                    ></i>
                    Delete
                </button>
            </div>
            {showModal && (
                <Modal
                    mode={mode}
                    setShowModal={setShowModal}
                    getData={getData}
                    form={form}
                />
            )}
        </li>
    );
};

export default ListItem;
