import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "../admin/Admin.css";
import { fetchAllUsers } from "../../../reducer/userReducer";
import { fetchAllEvent } from "../../../reducer/eventReducer";
import { Modal, Button } from "react-bootstrap";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { eventAll } = useSelector((state) => state.event);
    const { userAll } = useSelector((state) => state.user);

    // State để điều khiển modal
    const [showEventListModal, setShowEventListModal] = useState(false);
    const [showUserListModal, setShowUserListModal] = useState(false);
    const [showStaffListModal, setShowStaffListModal] = useState(false);
    const [showCancelledEventListModal, setShowCancelledEventListModal] = useState(false); // Modal mới cho Cancelled Events

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllEvent());
    }, [dispatch]);

    // Calculate metrics
    const totalEvents = eventAll?.mess?.length || 0;
    const totalUsers = userAll?.mess?.filter((user) => user.role === "User").length || 0;
    const totalStaff = userAll?.mess?.filter((user) => user.role === "Staff").length || 0;

    const eventStatusBreakdown = {
        Upcoming: eventAll?.mess?.filter((event) => event.status === "Upcoming").length || 0,
        Ongoing: eventAll?.mess?.filter((event) => event.status === "Ongoing").length || 0,
        Completed: eventAll?.mess?.filter((event) => event.status === "Completed").length || 0,
        Cancelled: eventAll?.mess?.filter((event) => event.status === "Cancelled").length || 0,
    };

    const totalAttendees = eventAll?.mess?.reduce((sum, event) => sum + (event.attendees?.length || 0), 0) || 0;
    const confirmedAttendees =
        eventAll?.mess?.reduce(
            (sum, event) =>
                sum +
                (event.attendees?.filter((attendee) => attendee.statusRegisEvent?.[0]?.status === "confirmed").length || 0),
            0
        ) || 0;

    // Prepare data for Pie Chart (Event Categories)
    const categories = [
        "Technology",
        "Business",
        "Design",
        "Education",
        "Science",
        "Health",
        "Entertainment",
        "Cuisine",
    ];
    const categoryCounts = categories.map(
        (category) => eventAll?.mess?.filter((event) => event.category === category).length || 0
    );

    const pieData = {
        labels: categories,
        datasets: [
            {
                data: categoryCounts,
                backgroundColor: [
                    "#0d6efd",
                    "#198754",
                    "#dc3545",
                    "#ffc107",
                    "#17a2b8",
                    "#6610f2",
                    "#fd7e14",
                    "#6c757d",
                ],
                borderColor: "#ffffff",
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Events by Category",
            },
        },
    };

    // Prepare data for Bar Chart (Attendees per Event)
    const eventTitles = eventAll?.mess?.map((event) => event.title) || [];
    const attendeeCounts = eventAll?.mess?.map((event) => event.attendees?.length || 0) || [];

    const barData = {
        labels: eventTitles,
        datasets: [
            {
                label: "Number of Attendees",
                data: attendeeCounts,
                backgroundColor: "#0d6efd",
                borderColor: "#0b5ed7",
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Attendees per Event",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Attendees",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Events",
                },
            },
        },
    };

    return (
        <div>
            <h3 className="mb-4">Dashboard</h3>

            {/* Metric Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div
                        className="card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowEventListModal(true)}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Events</h5>
                            <p className="card-text display-4">{totalEvents}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div
                        className="card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowUserListModal(true)}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text display-4">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div
                        className="card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowStaffListModal(true)}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Staff</h5>
                            <p className="card-text display-4">{totalStaff}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div
                        className="card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowCancelledEventListModal(true)}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Event Cancelled</h5>
                            <p className="card-text display-4">{eventStatusBreakdown.Cancelled}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Status and Attendee Status Section */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Event Status Breakdown</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Upcoming <span className="badge bg-warning">{eventStatusBreakdown.Upcoming}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Ongoing <span className="badge bg-primary">{eventStatusBreakdown.Ongoing}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Completed <span className="badge bg-success">{eventStatusBreakdown.Completed}</span>
                                </li>
                                {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Cancelled <span className="badge bg-danger">{eventStatusBreakdown.Cancelled}</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Attendee Status</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total Attendees <span className="badge bg-info">{totalAttendees}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Confirmed Attendees <span className="badge bg-success">{confirmedAttendees}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Pending Attendees{" "}
                                    <span className="badge bg-secondary">{totalAttendees - confirmedAttendees}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Event List */}
            <Modal show={showEventListModal} onHide={() => setShowEventListModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách sự kiện</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {eventAll?.mess?.length > 0 ? (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Attendees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventAll.mess.map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.title}</td>
                                        <td>{new Date(event.date).toLocaleDateString()}</td>
                                        <td>{event.category || "N/A"}</td>
                                        <td>{event.status || "N/A"}</td>
                                        <td>{event.attendees?.length || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">Không có sự kiện nào.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEventListModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for User List */}
            <Modal show={showUserListModal} onHide={() => setShowUserListModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userAll?.mess?.filter((user) => user.role === "User").length > 0 ? (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAll.mess
                                    .filter((user) => user.role === "User")
                                    .map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || "N/A"}</td>
                                            <td>{user.address || "N/A"}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">Không có người dùng nào.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUserListModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Staff List */}
            <Modal show={showStaffListModal} onHide={() => setShowStaffListModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userAll?.mess?.filter((user) => user.role === "Staff").length > 0 ? (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAll.mess
                                    .filter((user) => user.role === "Staff")
                                    .map((staff, index) => (
                                        <tr key={index}>
                                            <td>{staff.name}</td>
                                            <td>{staff.email}</td>
                                            <td>{staff.phone || "N/A"}</td>
                                            <td>{staff.address || "N/A"}</td>
                                            <td>{new Date(staff.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">Không có nhân viên nào.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStaffListModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Cancelled Event List */}
            <Modal show={showCancelledEventListModal} onHide={() => setShowCancelledEventListModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Danh sách sự kiện bị hủy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {eventAll?.mess?.filter((event) => event.status === "Cancelled").length > 0 ? (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Reason</th>
                                    <th>Attendees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventAll.mess
                                    .filter((event) => event.status === "Cancelled")
                                    .map((event, index) => (
                                        <tr key={index}>
                                            <td>{event.title}</td>
                                            <td>{new Date(event.date).toLocaleDateString()}</td>
                                            <td>{event.category || "N/A"}</td>
                                            <td>{event.cancelReason || "N/A"}</td>
                                            <td>{event.attendees?.length || 0}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">Không có sự kiện bị hủy nào.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelledEventListModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Dashboard;