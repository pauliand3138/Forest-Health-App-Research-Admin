import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = ({ mode, setShowModal, getData, form }) => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [isDisabled, setIsDisabled] = useState(mode === "view");
    const editMode = mode === "edit" || mode === "view" ? true : false;
    const [error, setError] = useState(null);

    const [data, setData] = useState({
        userid: editMode ? form.userid : cookies.Email,
        location: editMode ? form.location : "",
        landscapeid: editMode ? form.landscapeid : 1,
        vegtypeid: editMode ? form.vegtypeid : 1,
        vegstageid: editMode ? form.vegstageid : 1,
        burnsevid: editMode ? form.burnsevid : 1,
        date: editMode ? form.date : new Date().toISOString().split("T")[0],
    });

    const postData = async (e) => {
        if (!data.location) {
            setError("All fields must not be empty!");
            return;
        }
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/forms/", {
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
        if (!data.location) {
            setError("All fields must not be empty!");
            return;
        }

        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:8000/forms/${form.formid}`,
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
                    <h3>Let's {mode} your research</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>

                <form>
                    <label>Research Location</label>
                    <input
                        required
                        maxLength={100}
                        placeholder="Location"
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                        disabled={isDisabled}
                    />
                    <br />
                    <label>Landscape Position</label>
                    <select
                        value={data.landscapeid}
                        onChange={handleChange}
                        name="landscapeid"
                        id="landscapeid"
                        required
                        disabled={isDisabled}
                    >
                        <option value="1">Flat / Undulating</option>
                        <option value="2">Ridge / Hill</option>
                        <option value="3">Slope</option>
                        <option value="4">Valley / Gully</option>
                    </select>
                    <br />
                    <label>Vegetation Type</label>
                    <select
                        value={data.vegtypeid}
                        onChange={handleChange}
                        name="vegtypeid"
                        id="vegtypeid"
                        required
                        disabled={isDisabled}
                    >
                        <option value="1">Fern or Herb</option>
                        <option value="2">Grassy</option>
                        <option value="3">Shrubby</option>
                        <option value="4">Rainforest</option>
                        <option value="5">Riparian</option>
                    </select>
                    <br />
                    <label>Vegetation Stage</label>
                    <select
                        value={data.vegstageid}
                        onChange={handleChange}
                        name="vegstageid"
                        id="vegstageid"
                        required
                        disabled={isDisabled}
                    >
                        <option value="1">Old</option>
                        <option value="2">Mature</option>
                        <option value="3">Regrowth</option>
                        <option value="4">Mixed</option>
                        <option value="5">Few trees present</option>
                    </select>
                    <br />
                    <label>Burn Severity</label>
                    <select
                        value={data.burnsevid}
                        onChange={handleChange}
                        name="burnsevid"
                        id="burnsevid"
                        required
                        disabled={isDisabled}
                    >
                        <option value="1">Unburnt</option>
                        <option value="2">Low</option>
                        <option value="3">Moderate</option>
                        <option value="4">High</option>
                        <option value="5">Extreme</option>
                    </select>
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
