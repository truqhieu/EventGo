import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../reducer/userReducer";
import { fetchAllEvent } from "../../../reducer/eventReducer";
import {
    apiCreateUser,
    apiDeleteUser,
    apiGetUserById,
    apiUpdateUser,
    apiRemoveAssignedEvent,
    apiAssignEventToStaff,
} from "../../../apis/user/user";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const StaffManage = () => {
    const dispatch = useDispatch();
    const { userAll } = useSelector((state) => state.user);
    const { eventAll } = useSelector((state) => state.event);

    const [showModal, setShowModal] = useState(false);
    const [isUpdateUser, setIsUpdateUser] = useState(false);
    const [idUpdateUser, setIdUpdateUser] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const [formAdd, setFormAdd] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "Staff",
    });

    const [formUpd, setFormUpd] = useState({
        name: "",
        email: "",
        password: "",
        role: "Staff",
        phone: "",
        address: "",
        profileImage: "",
    });

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllEvent());
    }, [dispatch]);

    const handleOpenAssignModal = (staffId) => {
        setSelectedStaffId(staffId);
        setShowAssignModal(true);
    };

    const handleAssignEvent = async () => {
        if (!selectedEventId) {
            toast.error("Please select an event to assign");
            return;
        }
        try {
            const response = await apiAssignEventToStaff(selectedStaffId, selectedEventId);
            if (response?.data?.success) {
                toast.success("Event assigned successfully!");
                await dispatch(fetchAllUsers());
                setShowAssignModal(false);
                setSelectedEventId("");
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to assign event");
        }
    };

    const handleRemoveEvent = async (staffId, eventId) => {
        if (window.confirm("Are you sure you want to remove this event from the staff?")) {
            try {
                const response = await apiRemoveAssignedEvent(staffId, eventId);
                if (response?.data?.success) {
                    toast.success("Event removed successfully!");
                    await dispatch(fetchAllUsers());
                }
            } catch (error) {
                toast.error(error.response?.data?.mess || "Failed to remove event");
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

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await apiCreateUser(formAdd);
            if (response?.data?.success) {
                toast.success("Create staff successfully! Please verify via email.");
                setFormAdd({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    password: "",
                    role: "Staff",
                });
                setShowModal(false);
                await dispatch(fetchAllUsers());
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to create staff");
        }
    };

    const handleOpenUpdateUser = async (id) => {
        setIsUpdateUser(true);
        setIdUpdateUser(id);
        try {
            const response = await apiGetUserById(id);
            setFormUpd(response?.data?.mess);
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to fetch staff");
        }
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;
        setFormUpd((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await apiUpdateUser(idUpdateUser, formUpd);
            if (response?.data?.success) {
                toast.success("Staff updated successfully!");
                await dispatch(fetchAllUsers());
                setIsUpdateUser(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to update staff");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff?")) {
            try {
                const response = await apiDeleteUser(id);
                if (response?.data?.success) {
                    toast.success("Staff deleted successfully!");
                    await dispatch(fetchAllUsers());
                }
            } catch (error) {
                toast.error(error.response?.data?.mess || "Failed to delete staff");
            }
        }
    };

    const filteredStaff = userAll?.mess
        ?.filter((user) => user.role === "Staff")
        ?.filter((user) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        })
        ?.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        }) || [];

    return (
        <div>
            <h3 className="mb-4">Staff Management</h3>

            {isUpdateUser ? (
                <div className="card p-4">
                    <h4 className="mb-4">Update Staff</h4>
                    <form onSubmit={handleSubmitUpdate}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formUpd.name || ""}
                                    onChange={handleChangeUpdate}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formUpd.email || ""}
                                    onChange={handleChangeUpdate}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password (Leave blank to keep unchanged)</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formUpd.password || ""}
                                    onChange={handleChangeUpdate}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-select"
                                    name="role"
                                    value={formUpd.role || "Staff"}
                                    onChange={handleChangeUpdate}
                                >
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formUpd.phone || ""}
                                    onChange={handleChangeUpdate}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Address (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={formUpd.address || ""}
                                    onChange={handleChangeUpdate}
                                />
                            </div>
                            <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                                <Button variant="success" type="submit">
                                    Update Staff
                                </Button>
                                <Button variant="secondary" onClick={() => setIsUpdateUser(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Add Staff
                        </Button>
                        <div className="d-flex gap-3 flex-wrap">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: "200px" }}
                            />
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <option value="newest">Sort: Newest First</option>
                                <option value="oldest">Sort: Oldest First</option>
                            </select>
                        </div>
                    </div>
                    <p className="mb-3">Showing {filteredStaff.length} staff(s) with role "Staff"</p>
                    <div className="card">
                        <div className="card-body p-0">
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Created At</th>
                                        <th>Assigned Events</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaff.length > 0 ? (
                                        filteredStaff.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.phone || "N/A"}</td>
                                                <td>{user.address || "N/A"}</td>
                                                <td>{new Date(user.createdAt).toDateString()}</td>
                                                <td>
                                                    {user.assignedEvents && user.assignedEvents.length > 0 ? (
                                                        <ul className="mb-0">
                                                            {user.assignedEvents.map((eventEntry, idx) => (
                                                                <li key={idx} className="d-flex justify-content-between align-items-center"
                                                                    style={{ marginBottom: "5px" }}>
                                                                    <span>{eventEntry.event?.title || "Unknown Event"}</span>
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveEvent(user._id, eventEntry.event?._id)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No events assigned"
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleOpenUpdateUser(user._id)}
                                                        >
                                                            Update
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => handleOpenAssignModal(user._id)}
                                                        >
                                                            Assign Event
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted">
                                                No staff found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmitAdd}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formAdd.name}
                                onChange={handleInputAdd}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formAdd.email}
                                onChange={handleInputAdd}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone (Optional)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={formAdd.phone}
                                onChange={handleInputAdd}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Address (Optional)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={formAdd.address}
                                onChange={handleInputAdd}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formAdd.password}
                                onChange={handleInputAdd}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Role
                            </label>
                            <select
                                className="form-select"
                                name="role"
                                value={formAdd.role}
                                onChange={handleInputAdd}
                            >
                                <option value="Staff">Staff</option>
                            </select>
                        </div>
                        <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                                Save Staff
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Event to Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="event" className="form-label">
                            Select Event
                        </label>
                        <select
                            className="form-select"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                        >
                            <option value="">-- Select an event --</option>
                            {eventAll?.mess?.map((event) => (
                                <option key={event._id} value={event._id}>
                                    {event.title} ({new Date(event.date).toDateString()})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleAssignEvent}>
                            Assign Event
                        </Button>
                        <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default StaffManage;