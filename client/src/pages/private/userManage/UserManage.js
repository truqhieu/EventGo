import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../reducer/userReducer";
import {
    apiCreateUser,
    apiDeleteUser,
    apiGetUserById,
    apiUpdateUser,
} from "../../../apis/user/user";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const UserManage = () => {
    const dispatch = useDispatch();
    const { userAll } = useSelector((state) => state.user);

    const [showModal, setShowModal] = useState(false);
    const [isUpdateUser, setIsUpdateUser] = useState(false);
    const [idUpdateUser, setIdUpdateUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [eventStatusFilter, setEventStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    const [formAdd, setFormAdd] = useState({
        name: "",
        email: "",
        password: "",
        role: "User",
    });

    const [formUpd, setFormUpd] = useState({
        name: "",
        email: "",
        password: "",
        role: "User",
        phone: "",
        address: "",
        profileImage: "",
    });

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

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
                toast.success("Create user successfully! Please verify via email.");
                setFormAdd({
                    name: "",
                    email: "",
                    password: "",
                    role: "User",
                });
                setShowModal(false);
                await dispatch(fetchAllUsers());
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to create user");
        }
    };

    const handleOpenUpdateUser = async (id) => {
        setIsUpdateUser(true);
        setIdUpdateUser(id);
        try {
            const response = await apiGetUserById(id);
            setFormUpd(response?.data?.mess);
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to fetch user");
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
                toast.success("User updated successfully!");
                await dispatch(fetchAllUsers());
                setIsUpdateUser(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.mess || "Failed to update user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await apiDeleteUser(id);
                if (response?.data?.success) {
                    toast.success("User deleted successfully!");
                    await dispatch(fetchAllUsers());
                }
            } catch (error) {
                toast.error(error.response?.data?.mess || "Failed to delete user");
            }
        }
    };

    const filteredUsers = userAll?.mess
        ?.filter((user) => user.role === "User")
        ?.filter((user) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        })
        ?.filter((user) => {
            if (eventStatusFilter === "all") return true;
            if (!user.eventsAttended || user.eventsAttended.length === 0) return false;
            return user.eventsAttended.some(
                (eventEntry) => eventEntry.status === eventStatusFilter
            );
        })
        ?.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        }) || [];

    return (
        <div>
            <h3 className="mb-4">User Management</h3>

            {isUpdateUser ? (
                <div className="card p-4">
                    <h4 className="mb-4">Update User</h4>
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
                                    value={formUpd.role || "User"}
                                    onChange={handleChangeUpdate}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
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
                                    Update User
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
                            Add User
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
                                value={eventStatusFilter}
                                onChange={(e) => setEventStatusFilter(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <option value="all">All Event Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
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
                    <p className="mb-3">Showing {filteredUsers.length} user(s) with role "User"</p>
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
                                        <th>Events Attended</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.phone || "N/A"}</td>
                                                <td>{user.address || "N/A"}</td>
                                                <td>{new Date(user.createdAt).toDateString()}</td>
                                                <td>
                                                    {user.eventsAttended && user.eventsAttended.length > 0 ? (
                                                        <ul className="mb-0">
                                                            {user.eventsAttended.map((eventEntry, idx) => (
                                                                <li key={idx}>
                                                                    {eventEntry.event?.title || "Unknown Event"} -{" "}
                                                                    <span
                                                                        className={`badge bg-${eventEntry.status === "pending"
                                                                                ? "secondary"
                                                                                : eventEntry.status === "confirmed"
                                                                                    ? "success"
                                                                                    : "danger"
                                                                            }`}
                                                                    >
                                                                        {eventEntry.status}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No events registered"
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
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center text-muted">
                                                No users found.
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
                    <Modal.Title>Add User</Modal.Title>
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
                                <option value="User">User</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>
                        <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">
                                Save User
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserManage;