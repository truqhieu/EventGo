import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import {
    apiCreateEvent,
    apiDeleteEvent,
    apiEventRegistantDetail,
    apiGetEventById,
    apiOpenSpots,
    apiUpdateEvent,
    apiUpdateStatusEventRegistant,
} from "../../../apis/event/event";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvent } from '../../../reducer/eventReducer';

const UpdateEvent = ({ idUpdateEvent, initialUpd, setInitialUpd, setIsUpdateEvent }) => {
    const dispatch = useDispatch();
    const { isLoading, error, dataSpeakerAll } = useSelector((state) => state.speakerList);

    const [updateImageLogo, setUpdateImageLogo] = useState(null);
    const [updateImageBackground, setUpdateImageBackground] = useState(null);

    const statusEvent = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
    const categoriesEvent = [
        "Technology",
        "Business",
        "Design",
        "Education",
        "Science",
        "Health",
        "Entertainment",
        "Cuisine",
    ];

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        if (!initialUpd.date) {
            toast.error("Date is required!");
            return;
        }
        if (!initialUpd.endDate) {
            toast.error("End Date is required!");
            return;
        }

        const formData = new FormData();
        formData.append("eid", idUpdateEvent);
        formData.append("title", initialUpd.title);
        formData.append("description", initialUpd.description);
        formData.append("date", initialUpd.date);
        formData.append("endDate", initialUpd.endDate);
        formData.append("location", initialUpd.location);
        formData.append("capacity", initialUpd.capacity);
        formData.append("category", initialUpd.category);
        formData.append("status", initialUpd.status);

        if (Array.isArray(initialUpd.speaker)) {
            initialUpd.speaker.forEach((id) => {
                formData.append("speakerIds", id);
            });
        } else if (initialUpd.speaker) {
            formData.append("speakerIds", initialUpd.speaker);
        }

        formData.append(
            "organizerUnit",
            JSON.stringify({
                name: initialUpd.organizerUnit?.name || "",
                address: initialUpd.organizerUnit?.address || "",
                contactInfo: {
                    phone: initialUpd.organizerUnit?.contactInfo?.phone || "",
                    email: initialUpd.organizerUnit?.contactInfo?.email || "",
                },
            })
        );

        if (updateImageLogo) {
            formData.append("logoImage", updateImageLogo);
        }
        if (updateImageBackground) {
            formData.append("backgroundImage", updateImageBackground);
        }

        try {
            const response = await apiUpdateEvent(formData);
            if (response.success) {
                toast.success("Event updated successfully!");
                dispatch(fetchAllEvent());
                setIsUpdateEvent(false); // Đóng form
            } else {
                toast.error("Update failed: " + (response.message || ""));
            }
        } catch (err) {
            console.error("UpdateEvent Error:", err);
            toast.error("Failed to update event");
        }
    };

    const handleUpdateImgLogo = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please choose an image!");
            return;
        }

        const validFormImage = ["image/jpeg", "image/png"];
        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose an image file (JPEG or PNG)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setInitialUpd((prev) => ({
                ...prev,
                logoImage: reader.result,
            }));
        };
        reader.readAsDataURL(file);
        setUpdateImageLogo(file);
    };

    const handleUpdateImgBackground = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please choose an image!");
            return;
        }

        const validFormImage = ["image/jpeg", "image/png"];
        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose an image file (JPEG or PNG)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setInitialUpd((prev) => ({
                ...prev,
                backgroundImage: reader.result,
            }));
        };
        reader.readAsDataURL(file);
        setUpdateImageBackground(file);
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;

        setInitialUpd((prevState) => {
            const keys = name.split(".");
            if (keys.length === 1) {
                return { ...prevState, [name]: value };
            } else if (keys.length === 2) {
                return {
                    ...prevState,
                    [keys[0]]: {
                        ...prevState[keys[0]],
                        [keys[1]]: value,
                    },
                };
            } else if (keys.length === 3) {
                return {
                    ...prevState,
                    [keys[0]]: {
                        ...prevState[keys[0]],
                        [keys[1]]: {
                            ...prevState[keys[0]][keys[1]],
                            [keys[2]]: value,
                        },
                    },
                };
            }
        });
    };

    return (
        <div className="container mt-5" style={{ width: "85%" }}>
            <h3 className="text-start text-update mb-4">Update Event</h3>
            <form onSubmit={handleSubmitUpdate}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            value={initialUpd?.title}
                            className="form-control"
                            onChange={handleChangeUpdate}
                            name="title"
                            required
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            onChange={handleChangeUpdate}
                            value={
                                initialUpd?.date
                                    ? new Date(initialUpd.date).toLocaleDateString("en-CA")
                                    : ""
                            }
                            required
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            onChange={handleChangeUpdate}
                            value={
                                initialUpd?.endDate
                                    ? new Date(initialUpd.endDate).toLocaleDateString("en-CA")
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            value={initialUpd?.location}
                            onChange={handleChangeUpdate}
                            className="form-control"
                            name="location"
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Organizer Unit Name</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={handleChangeUpdate}
                            name="organizerUnit.name"
                            value={initialUpd?.organizerUnit?.name || ""}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Organizer Address (Optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={handleChangeUpdate}
                            name="organizerUnit.address"
                            value={initialUpd?.organizerUnit?.address || ""}
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Organizer Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={handleChangeUpdate}
                            name="organizerUnit.contactInfo.phone"
                            value={initialUpd?.organizerUnit?.contactInfo?.phone || ""}
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Organizer Email</label>
                        <input
                            type="email"
                            className="form-control"
                            onChange={handleChangeUpdate}
                            name="organizerUnit.contactInfo.email"
                            value={initialUpd?.organizerUnit?.contactInfo?.email || ""}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Capacity</label>
                        <input
                            type="number"
                            value={initialUpd?.capacity}
                            onChange={handleChangeUpdate}
                            className="form-control"
                            name="capacity"
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="category" className="form-label">
                            Category
                        </label>
                        <select
                            value={initialUpd?.category}
                            name="category"
                            onChange={handleChangeUpdate}
                            className="form-select"
                        >
                            {categoriesEvent?.map((item, index) => (
                                <option value={item} key={index}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="speaker" className="form-label">
                            Speaker
                        </label>
                        <select
                            name="speaker"
                            value={
                                initialUpd?.speaker?.length > 0 ? initialUpd.speaker[0]?._id : ""
                            }
                            className="form-select"
                            onChange={handleChangeUpdate}
                        >
                            {dataSpeakerAll?.map((item, index) => (
                                <option key={index} value={item?._id}>
                                    {item?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Event Status</label>
                        <select
                            className="form-select"
                            value={initialUpd?.status}
                            onChange={handleChangeUpdate}
                            name="status"
                        >
                            {statusEvent?.map((item, index) => (
                                <option value={item} key={index}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-7">
                        <div className="upload-container">
                            <input
                                id="file-upload-logo"
                                type="file"
                                name="logoImage"
                                hidden
                                onChange={handleUpdateImgLogo}
                            />
                            <div className="preview-box">
                                <img
                                    src={
                                        initialUpd?.logoImage ||
                                        "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
                                    }
                                    alt="Logo Preview"
                                />
                            </div>
                            <label htmlFor="file-upload-logo" className="upload-label">
                                <p style={{ color: "white" }}>Chọn hình ảnh logo để update</p>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="upload-container">
                            <label htmlFor="file-upload-bg" className="upload-label">
                                <i className="bi bi-cloud-arrow-up" />
                                <p style={{ color: "white" }}>Chọn hình nền để update</p>
                            </label>
                            <input
                                id="file-upload-bg"
                                type="file"
                                name="backgroundImage"
                                hidden
                                onChange={handleUpdateImgBackground}
                            />
                            <div className="preview-box">
                                <img
                                    src={
                                        initialUpd?.backgroundImage ||
                                        "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
                                    }
                                    alt="Background Preview"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 text-end mt-3">
                        <button type="submit" className="btn btn-success">
                            Update Event
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateEvent;