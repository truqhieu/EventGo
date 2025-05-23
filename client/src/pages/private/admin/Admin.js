import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import "./Admin.css";
import { fetchAllEvent } from "../../../reducer/eventReducer";
import { toast } from "react-toastify";
import { fetchDataSpeaker } from "../../../reducer/speakerReducer";
import UserManage from "../userManage/UserManage";
import StaffManage from "../userManage/StaffManage";
import EventList from "../event/EventList";
import EventDetail from "../event/EventDetail";
import EventWaitList from "../event/EventWaitList";
import EventWaitlistDetail from "../event/EventWaitlistDetail";
import UpdateEvent from "../event/UpdateEvent";
import Dashboard from "../dashboard/Dashboard";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(true);
  const [isEventDetail, setIsEventDetail] = useState(false);
  const [isEventList, setIsEventList] = useState(false);
  const [isUpdateEvent, setIsUpdateEvent] = useState(false);
  const [eventRegistantData, setEventRegistantData] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEventWaitlist, setIsEventWaitlist] = useState(false);
  const [isEventWaitlistDetail, setIsEventWaitlistDetail] = useState(false);
  const [modalFilterDetailEvent, setModalFilterDetailEvent] = useState(false);
  const [isUserList, setIsUserList] = useState(false);
  const [isStaffList, setIsStaffList] = useState(false);
  const [idUpdateEvent, setIdUpdateEvent] = useState(null);

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

  useEffect(() => {
    dispatch(fetchDataSpeaker());
    dispatch(fetchAllEvent());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authData");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "logout") {
      handleLogout();
    }
  };

  const handleSelectUser = (view) => {
    if (view === "userList") {
      setIsUserList(true);
      setIsStaffList(false);
      setIsEventList(false);
      setIsEventDetail(false);
      setIsUpdateEvent(false);
      setIsEventWaitlist(false);
      setIsEventWaitlistDetail(false);
      setIsDashboard(false);
    } else if (view === "staffList") {
      setIsUserList(false);
      setIsStaffList(true);
      setIsEventList(false);
      setIsEventDetail(false);
      setIsUpdateEvent(false);
      setIsEventWaitlist(false);
      setIsEventWaitlistDetail(false);
      setIsDashboard(false);
    }
  };

  const handleSelectEvent = (view) => {
    setIsEventList(view === "eventList");
    setIsEventDetail(view === "detail");
    setIsEventWaitlist(view === "waitlist");
    setIsEventWaitlistDetail(false);
    setIsUpdateEvent(false);
    setIsUserList(false);
    setIsStaffList(false);
    setIsDashboard(false);
  };

  const handleSelectDashboard = () => {
    setIsDashboard(true);
    setIsUserList(false);
    setIsStaffList(false);
    setIsEventList(false);
    setIsEventDetail(false);
    setIsUpdateEvent(false);
    setIsEventWaitlist(false);
    setIsEventWaitlistDetail(false);
  };

  return (
    <div className="d-flex">
      <div className="sidebar">
        <h4 className="text-center mb-4">Event Go</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              href="#"
              className={`nav-link fw-bold ${isDashboard ? "active" : ""}`}
              onClick={handleSelectDashboard}
            >
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link fw-bold d-flex justify-content-between align-items-center"
              onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)}
            >
              <span>Users</span>
              <span>{isUsersMenuOpen ? "▼" : "▶"}</span>
            </a>
            {isUsersMenuOpen && (
              <div className="submenu">
                <a className="nav-link" onClick={() => handleSelectUser("userList")}>
                  User List
                </a>
                <a className="nav-link" onClick={() => handleSelectUser("staffList")}>
                  Staff List
                </a>
              </div>
            )}
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link fw-bold d-flex justify-content-between align-items-center"
              onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
            >
              <span>Events</span>
              <span>{isEventMenuOpen ? "▼" : "▶"}</span>
            </a>
            {isEventMenuOpen && (
              <div className="submenu">
                <a className="nav-link" onClick={() => handleSelectEvent("eventList")}>
                  Event List
                </a>
                <a className="nav-link" onClick={() => handleSelectEvent("waitlist")}>
                  Event Waitlist
                </a>
              </div>
            )}
          </li>
        </ul>
      </div>

      <div className="content">
        <div className="card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Admin Panel</h3>
            <div className="dropdown">
              <select
                className="form-select"
                value={selectedOption}
                onChange={handleSelectChange}
                style={{ width: "150px" }}
              >
                <option value="" disabled hidden>
                  Admin
                </option>
                <option value="logout" className="text-danger">
                  Logout
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-4">
          {isDashboard && <Dashboard />}
          {isEventList && (
            <EventList
              setIsUpdateEvent={setIsUpdateEvent}
              setIdUpdateEvent={setIdUpdateEvent}
              setIsEventList={setIsEventList}
              setIsEventDetail={setIsEventDetail}
              setEventRegistantData={setEventRegistantData}
            />
          )}
          {isEventDetail && (
            <EventDetail
              eventRegistantData={eventRegistantData}
              setEventRegistantData={setEventRegistantData}
              setIsEventDetail={setIsEventDetail}
              setModalFilterDetailEvent={setModalFilterDetailEvent}
            />
          )}
          {isEventWaitlist && (
            <EventWaitList
              setIsEventList={setIsEventList}
              setIsEventWaitlist={setIsEventWaitlist}
              setIsEventWaitlistDetail={setIsEventWaitlistDetail}
              setEventRegistantData={setEventRegistantData}
            />
          )}
          {isEventWaitlistDetail && eventRegistantData && (
            <EventWaitlistDetail
              eventRegistantData={eventRegistantData}
              setEventRegistantData={setEventRegistantData}
              setIsEventWaitlistDetail={setIsEventWaitlistDetail}
              setIsEventWaitlist={setIsEventWaitlist}
              setIsEventDetail={setIsEventDetail}
              setModalFilterDetailEvent={setModalFilterDetailEvent}
            />
          )}
          {isUpdateEvent && (
            <UpdateEvent
              idUpdateEvent={idUpdateEvent}
              initialUpd={initialUpd}
              setInitialUpd={setInitialUpd}
              setIsUpdateEvent={setIsUpdateEvent}
            />
          )}
          {isUserList && <UserManage />}
          {isStaffList && <StaffManage />}
        </div>
      </div>
    </div>
  );
};

export default Admin;