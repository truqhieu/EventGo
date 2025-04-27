// client/src/pages/admin/userManage/StaffManage.jsx
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
    apiAssignEventToStaff,
} from "../../../apis/user/user";
import { toast } from "react-toastify";

const StaffManage = () => {
    const dispatch = useDispatch();
    const { userAll, loadingUserAll, errorUserAll } = useSelector(
        (state) => state.user
    );
    const { eventAll } = useSelector((state) => state.event);

    const [showModal, setShowModal] = useState(false);
    const [isUpdateUser, setIsUpdateUser] = useState(false);
    const [idUpdateUser, setIdUpdateUser] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState("");

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

    // State cho tìm kiếm, lọc và sắp xếp
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

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
                await dispatch(fetchAllUsers()); // Đảm bảo fetchAllUsers hoàn tất trước khi đóng modal
                setShowAssignModal(false);
                setSelectedEventId("");
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to assign event");
        }
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
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

    // Lọc và xử lý danh sách staff
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
            <h3>Staff Management</h3>

            {/* Add Staff Modal */}
            {showModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Staff</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
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
                                    <button type="submit" className="btn btn-primary">
                                        Save Staff
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Staff Form */}
            {isUpdateUser && (
                <div className="container mt-5" style={{ width: "85%" }}>
                    <h3 className="text-start mb-4">Update Staff</h3>
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
                                <label className="form-label">
                                    Password (Leave blank to keep unchanged)
                                </label>
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
                            <div className="col-12 text-end mt-3">
                                <button type="submit" className="btn btn-success">
                                    Update Staff
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Assign Event Modal */}
            {showAssignModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Event to Staff</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAssignModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
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
                                <button className="btn btn-primary" onClick={handleAssignEvent}>
                                    Assign Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff List */}
            {!isUpdateUser && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button className="btn btn-primary" onClick={handleModalToggle}>
                            Add Staff
                        </button>
                        <div className="d-flex gap-2">
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
                    <p>Showing {filteredStaff.length} staff(s) with role "Staff"</p>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Created At</th>
                                <th>Sự kiện được giao</th>
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
                                                <ul>
                                                    {user.assignedEvents.map((eventEntry, idx) => (
                                                        <li key={idx}>
                                                            {eventEntry.event?.title || "Unknown Event"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                "No events assigned"
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleOpenUpdateUser(user._id)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleOpenAssignModal(user._id)}
                                                >
                                                    Assign Event
                                                </button>
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
            )}
        </div>
    );
};

export default StaffManage;