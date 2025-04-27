import React, { useEffect, useState } from 'react'
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

const EventList = ({ setIsUpdateEvent, setIdUpdateEvent, setIsEventList }) => {

    const dispatch = useDispatch();

    const [eventStatusFilter, setEventStatusFilter] = useState("all"); // Lọc theo trạng thái sự kiện
    const [eventStatusFilterDetail, setEventStatusFilterDetail] = useState("all"); // Lọc theo trạng thái sự kiện
    const statusEvent = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
    const [categoryFilter, setcategoryFilter] = useState("all"); // Lọc theo category
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [afterLogoImage, setAfterLogoImage] = useState(null);
    const [afterBackgroundImage, setAfterBackgroundImage] = useState(null);
    const [isEventDetail, setIsEventDetail] = useState(false);
    const [modalFilterDetailEvent, setModalFilterDetailEvent] = useState(false);
    const [eventRegistantData, setEventRegistantData] = useState(null);

    const handleCloseAddEvent = () => setIsAddEventOpen(false);
    const handleOpenAddEvent = () => setIsAddEventOpen(true);

    const { dataSpeakerAll } = useSelector((state) => state.speakerList);

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

    const [initialUpd, setInitialUpd] = useState({
        title: "",
        description: "",
        date: "",
        endDate: "",
        location: "",
        capacity: "",
        category: "",
        speaker: "",
        status: "",
        backgroundImage: "",
        logoImage: "",
        organizerUnit: {
            name: "",
            address: "",
            contactInfo: {
                phone: "",
                email: "",
            },
        },
    });

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
            month: "long", // April
            day: "numeric", // 25
            year: "numeric", // 2025
        });
    };

    const handleEventRegistant = async (eid) => {
        setIsEventList(false);
        setIsEventDetail(true);
        setModalFilterDetailEvent(true);
        setIsUpdateEvent(false);
        // setIdEventRegistant(eid);
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
            setInitialUpd(response?.mess);
            // setFormUpd(response?.mess);
        } catch (error) {
            toast.error("Failed to update event");
        }
    };

    const handleDeletedEvent = async (eid) => {
        const alert = "Are you delete this event";
        if (window.confirm(alert)) {
            try {
                const response = await apiDeleteEvent(eid);

                if (response?.success) {
                    toast.success("Remove successfully", { icon: "🚀" });
                    dispatch(fetchAllEvent());
                }
            } catch (error) {
                toast.success(`Remove Failed`, { icon: "🚀" });
            }
        }
    };

    const handleInputAdd = (e) => {
        const { name, value } = e.target;
        setFormAdd(() => ({
            ...formAdd,
            [name]: value,
        }));
    };

    useEffect(() => {
        dispatch(fetchAllEvent());
    }, [dispatch]);

    const handleChooseImgLogo = (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error("Please choose image to create event");
            return;
        }

        const validFormImage = ["image/jpeg", "image/png"];

        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose image file must be jpeg or png");
            return;
        }

        // Gửi tệp hình ảnh thay vì đọc và lưu dưới dạng base64
        setAfterLogoImage(file); // Lưu tệp gốc để gửi đi
    };

    const handleChooseImgBackGround = (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error("Please choose image to create event");
            return;
        }

        const validFormImage = ["image/jpeg", "image/png"];

        if (!validFormImage.includes(file.type)) {
            toast.error("Please choose image file must be jpeg or png");
            return;
        }

        // Gửi tệp hình ảnh thay vì đọc và lưu dưới dạng base64
        setAfterBackgroundImage(file); // Lưu tệp gốc để gửi đi
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
        if (afterBackgroundImage)
            formData.append("backgroundImage", afterBackgroundImage);

        try {
            const response = await apiCreateEvent(formData);
            console.log("API response:", response);
            if (response?.success) {
                toast.success("Create event successfully!");

                // ✨ Đóng modal và reset form NGAY LẬP TỨC
                handleCloseAddEvent();
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

                // ✨ Gọi fetch sau cùng để tránh delay UI
                setTimeout(() => {
                    dispatch(fetchAllEvent());
                }, 0);
            } else {
                toast.error(
                    "Create event failed: " + (response.data?.message || "Unknown error")
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Create event failed!");
        }
    };
    const { eventAll, errorEventAll, loadingEventAll } = useSelector(
        (state) => state.event
    );
    const listDataFilter = Array.isArray(eventAll?.mess)
        ? [...eventAll?.mess]
        : [];

    let afterFilter = listDataFilter?.filter((item) => {
        const matchesCategory =
            categoryFilter === "all" || item?.category === categoryFilter;
        const matchesStatusEvent =
            eventStatusFilter === "all" || item?.status === eventStatusFilter;

        return matchesCategory && matchesStatusEvent;
    });

    return (
        <div>
            <h3>Event List</h3>
            <div className="d-flex gap-2 mb-3 mt-5">
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

                {/* <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Filter by Title"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                  /> */}
            </div>

            {/* Table */}
            {isAddEventOpen && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    style={{ display: "block" }}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add Event
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={handleCloseAddEvent}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitAdd}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            onChange={handleInputAdd}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            onChange={handleInputAdd}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="date"
                                            name="date"
                                            onChange={handleInputAdd}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="location" className="form-label">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            name="location"
                                            onChange={handleInputAdd}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">
                                            Category
                                        </label>
                                        <select
                                            onChange={handleInputAdd}
                                            name="category"
                                            className="form-select"
                                            value={formAdd.category}
                                        >
                                            <option value="">Select Category</option>
                                            {categoriesEvent?.map((item, index) => (
                                                <option value={item} key={index}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="capacity" className="form-label">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="capacity"
                                            name="capacity"
                                            onChange={handleInputAdd}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="backgroundImage"
                                            className="form-label"
                                        >
                                            BackgroundImage
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            id="backgroundImage"
                                            name="backgroundImage"
                                            onChange={handleChooseImgBackGround}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="logoImage" className="form-label">
                                            Logo Image
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            id="logoImage"
                                            name="logoImage"
                                            onChange={handleChooseImgLogo}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="speaker" className="form-label">
                                            Speakers
                                        </label>
                                        <select
                                            onChange={handleInputAdd}
                                            name="speaker"
                                            className="form-select"
                                        >
                                            {dataSpeakerAll?.map((item, index) => (
                                                <option value={item?._id} key={index}>
                                                    {item?.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Save Event
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button
                className="btn btn-primary mb-3"
                onClick={handleOpenAddEvent}
            >
                Add Event
            </button>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>EndDate</th>
                        <th>Location</th>
                        <th>OrganizerUnit</th>
                        <th>Capacity</th>
                        <th>Category</th>
                        <th>Attendees</th>
                        <th>EventStatus</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {eventAll?.mess?.length > 0 ? (
                      eventAll?.mess?.map((event, index) => ( */}

                    {afterFilter?.length > 0 ? (
                        afterFilter.map((event, index) => (
                            <tr
                                key={index}
                                onClick={() => handleEventRegistant(event?._id)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{event?.title}</td>
                                <td>{formatDateEn(event?.date)}</td>
                                <td>
                                    {event?.endDate ? formatDateEn(event.endDate) : "N/A"}
                                </td>
                                <td>{event?.location || "N/A"}</td>

                                <td>
                                    <div>
                                        <strong>{event?.organizerUnit?.name || "N/A"}</strong>
                                        <br />
                                        📍 {event?.organizerUnit?.address || "No Address"}
                                        <br />
                                        📞{" "}
                                        {event?.organizerUnit?.contactInfo?.phone ||
                                            "No Phone"}
                                        <br />
                                        📧{" "}
                                        {event?.organizerUnit?.contactInfo?.email ||
                                            "No Email"}
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
                                    {/* Dùng d-flex để hiển thị nút ngang hàng */}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn sự kiện truyền lên thẻ <tr>
                                                handleOpenUpdateEvent(event?._id);
                                            }}
                                        >
                                            Update
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn sự kiện truyền lên thẻ <tr>
                                                handleDeletedEvent(event?._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">
                                No events found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default EventList