import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
import { fetchAllEvent } from '../../../reducer/eventReducer';
import { Modal, Button } from 'react-bootstrap';

const EventList = ({ setIsUpdateEvent, setIdUpdateEvent, setIsEventList, setIsEventDetail, setEventRegistantData }) => {
    const dispatch = useDispatch();
    const [eventStatusFilter, setEventStatusFilter] = useState("all");
    const [categoryFilter, setcategoryFilter] = useState("all");
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [afterLogoImage, setAfterLogoImage] = useState(null);
    const [afterBackgroundImage, setAfterBackgroundImage] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewBackground, setPreviewBackground] = useState(null);

    const { dataSpeakerAll } = useSelector((state) => state.speakerList);
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

    const [formAdd, setFormAdd] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
        category: "",
        speaker: "",
        backgroundImage: "",
        logoImage: "",
    });

    const formatDateEn = (isoDate) => {
        if (!isoDate) return "N/A";
        return new Date(isoDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleEventRegistant = async (eid) => {
        setIsEventList(false);
        setIsEventDetail(true);
        try {
            const response = await apiEventRegistantDetail(eid);
            if (response?.success) {
                setEventRegistantData(response?.mess);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenUpdateEvent = async (eid) => {
        setIsUpdateEvent(true);
        setIdUpdateEvent(eid);
        setIsEventList(false);
        try {
            const response = await apiGetEventById(eid);
            setFormAdd(response?.mess);
        } catch (error) {
            toast.error("Failed to update event");
        }
    };

    const handleDeletedEvent = async (eid) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await apiDeleteEvent(eid);
                if (response?.success) {
                    toast.success("Removed successfully", { icon: "🚀" });
                    dispatch(fetchAllEvent());
                }
            } catch (error) {
                toast.error("Remove Failed", { icon: "🚀" });
            }
        }
    };

    const handleInputAdd = (e) => {
        const { name, value } = e.target;
        setFormAdd((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        dispatch(fetchAllEvent());
    }, [dispatch]);

    const handleChooseImgLogo = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please choose an image");
            return;
        }
        const validFormImage = ["image/jpeg", "image/png"];
        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose a JPEG or PNG image");
            return;
        }
        setAfterLogoImage(file);
        setPreviewLogo(URL.createObjectURL(file));
    };

    const handleChooseImgBackGround = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please choose an image");
            return;
        }
        const validFormImage = ["image/jpeg", "image/png"];
        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose a JPEG or PNG image");
            return;
        }
        setAfterBackgroundImage(file);
        setPreviewBackground(URL.createObjectURL(file));
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        if (!formAdd.title?.trim()) {
            toast.error("Title is required!");
            return;
        }
        if (!formAdd.date) {
            toast.error("Date is required!");
            return;
        }
        if (!formAdd.location?.trim()) {
            toast.error("Location is required!");
            return;
        }
        if (!formAdd.capacity) {
            toast.error("Capacity is required!");
            return;
        }
        if (!formAdd.category) {
            toast.error("Category is required!");
            return;
        }
        const formData = new FormData();
        formData.append("title", formAdd.title);
        formData.append("description", formAdd.description);
        formData.append("date", formAdd.date);
        formData.append("location", formAdd.location);
        formData.append("capacity", formAdd.capacity);
        formData.append("category", formAdd.category);
        formData.append("speaker", formAdd.speaker);
        if (afterLogoImage) formData.append("logoImage", afterLogoImage);
        if (afterBackgroundImage) formData.append("backgroundImage", afterBackgroundImage);

        try {
            const response = await apiCreateEvent(formData);
            if (response?.success) {
                toast.success("Event created successfully!");
                setIsAddEventOpen(false);
                setFormAdd({
                    title: "",
                    description: "",
                    date: "",
                    location: "",
                    capacity: "",
                    category: "",
                    speaker: "",
                    backgroundImage: "",
                    logoImage: "",
                });
                setPreviewLogo(null);
                setPreviewBackground(null);
                dispatch(fetchAllEvent());
            } else {
                toast.error("Create event failed: " + (response.data?.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            toast.error("Create event failed!");
        }
    };

    const { eventAll } = useSelector((state) => state.event);
    const listDataFilter = Array.isArray(eventAll?.mess) ? [...eventAll?.mess] : [];

    let afterFilter = listDataFilter?.filter((item) => {
        const matchesCategory = categoryFilter === "all" || item?.category === categoryFilter;
        const matchesStatusEvent = eventStatusFilter === "all" || item?.status === eventStatusFilter;
        return matchesCategory && matchesStatusEvent;
    });

    return (
        <div>
            <h3 className="mb-4">Event List</h3>
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <select
                    className="form-select w-auto"
                    value={eventStatusFilter}
                    onChange={(e) => setEventStatusFilter(e.target.value)}
                >
                    <option value="all">All Event Status</option>
                    {statusEvent.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select w-auto"
                    value={categoryFilter}
                    onChange={(e) => setcategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categoriesEvent.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <Button variant="primary" onClick={() => setIsAddEventOpen(true)}>
                    Add Event
                </Button>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>End Date</th>
                                <th>Location</th>
                                <th>Organizer</th>
                                <th>Capacity</th>
                                <th>Category</th>
                                <th>Attendees</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {afterFilter?.length > 0 ? (
                                afterFilter.map((event, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleEventRegistant(event?._id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{event?.title}</td>
                                        <td>{formatDateEn(event?.date)}</td>
                                        <td>{event?.endDate ? formatDateEn(event.endDate) : "N/A"}</td>
                                        <td>{event?.location || "N/A"}</td>
                                        <td>
                                            <div>
                                                <strong>{event?.organizerUnit?.name || "N/A"}</strong>
                                                <br />
                                                📍 {event?.organizerUnit?.address || "No Address"}
                                                <br />
                                                📞 {event?.organizerUnit?.contactInfo?.phone || "No Phone"}
                                                <br />
                                                📧 {event?.organizerUnit?.contactInfo?.email || "No Email"}
                                            </div>
                                        </td>
                                        <td>{event?.capacity}</td>
                                        <td>{event?.category}</td>
                                        <td>{event?.attendees?.length || 0}</td>
                                        <td>
                                            <span
                                                className={`badge bg-${event.status === "Upcoming"
                                                        ? "warning"
                                                        : event.status === "Ongoing"
                                                            ? "primary"
                                                            : event.status === "Completed"
                                                                ? "success"
                                                                : "danger"
                                                    }`}
                                            >
                                                {event?.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenUpdateEvent(event?._id);
                                                    }}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletedEvent(event?._id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center text-muted">
                                        No events found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isAddEventOpen} onHide={() => setIsAddEventOpen(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitAdd}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formAdd.title}
                                    onChange={handleInputAdd}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={formAdd.date}
                                    onChange={handleInputAdd}
                                />
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formAdd.description}
                                    onChange={handleInputAdd}
                                    rows="4"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    value={formAdd.location}
                                    onChange={handleInputAdd}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="capacity" className="form-label">Capacity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="capacity"
                                    value={formAdd.capacity}
                                    onChange={handleInputAdd}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formAdd.category}
                                    onChange={handleInputAdd}
                                >
                                    <option value="">Select Category</option>
                                    {categoriesEvent?.map((item, index) => (
                                        <option value={item} key={index}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="speaker" className="form-label">Speakers</label>
                                <select
                                    name="speaker"
                                    className="form-select"
                                    value={formAdd.speaker}
                                    onChange={handleInputAdd}
                                >
                                    <option value="">Select Speaker</option>
                                    {dataSpeakerAll?.map((item, index) => (
                                        <option value={item?._id} key={index}>
                                            {item?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="backgroundImage" className="form-label">Background Image</label>
                                <div className="upload-container">
                                    <div className="preview-box">
                                        {previewBackground && <img src={previewBackground} alt="Background Preview" />}
                                    </div>
                                    <label className="upload-label">
                                        <span>{previewBackground ? "Change Image" : "Upload Background Image"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="backgroundImage"
                                            onChange={handleChooseImgBackGround}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="logoImage" className="form-label">Logo Image</label>
                                <div className="upload-container">
                                    <div className="preview-box">
                                        {previewLogo && <img src={previewLogo} alt="Logo Preview" />}
                                    </div>
                                    <label className="upload-label">
                                        <span>{previewLogo ? "Change Image" : "Upload Logo Image"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="logoImage"
                                            onChange={handleChooseImgLogo}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                            <Button type="submit" variant="primary">
                                Save Event
                            </Button>
                            <Button variant="secondary" onClick={() => setIsAddEventOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EventList;   