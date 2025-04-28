import React from "react";
import "../../styletemplate/css/slicknav.min.css";
import "../../styletemplate/css/elegant-icons.css";
import "../../styletemplate/css/magnific-popup.css";
import "../../styletemplate/css/style.css";
import "../../styletemplate/css/bootstrap.min.css";
import "../../styletemplate/css/font-awesome.min.css";
import { LuLogIn } from "../../ultils/icon";
import { useState, useEffect } from "react";
import { fetchDataSpeaker } from "../../reducer/speakerReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentData } from "../../reducer/authenReducer";
import { isTokenExpired } from "../../ultils/helper";
import { apiRefreshToken } from "../../apis/authen/authentication";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData")) || {};
  const isLogged = authData?.isLogin || false;
  const accessToken = authData?.accessToken || "";
  const { dataSpeakerAll } = useSelector((state) => state.speakerList);
  const { user } = useSelector((state) => state.authen);

  useEffect(() => {
    if (isLogged && accessToken) {
      dispatch(fetchCurrentData());
    }
  }, [dispatch, isLogged, accessToken]);

  useEffect(() => {
    dispatch(fetchDataSpeaker());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/");
  };

  const handleSelectDropdownChange = (e) => {
    const value = e.target.value;
    if (value === "logout") {
      handleLogout();
    } else if (value === "profile") {
      navigate("/profile");
    } else if (value === "event-registered") {
      navigate("/event-registered");
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          const result = await apiRefreshToken();
          if (!result?.data?.success) {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
    };

    if (accessToken) checkToken();
  }, [accessToken]);

  return (
    <div>
      <header className="header-section">
        <div className="container">
          <div className="logo">
            <a href="/">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfyDDAElY58f-mmrhgncjex7NoK7VAvL-DvQ&s"
                alt=""
                style={{ height: "50px" }}
              />
            </a>
          </div>
          <div className="nav-menu">
            <nav className="mainmenu mobile-menu">
              <ul>
                <li className="active">
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/speaker">Speakers</a>
                  {dataSpeakerAll?.length > 0 && (
                    <ul className="dropdown">
                      {dataSpeakerAll.map((item, index) => (
                        <li key={index}>
                          <a href={`/speaker/${item._id}`}>{item.name}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <a href="/event">Schedule</a>
                </li>
                <li>
                  <a href="/contact">Contacts</a>
                </li>
              </ul>
            </nav>
            {isLogged ? (
              <select style={{ color: "black" }}
                className="primary-btn top-btn"
                onChange={handleSelectDropdownChange}
                aria-label="User Menu"
              >
                <option value="">Hello {user?.name}</option>
                <option value="profile">Profile</option>
                <option value="event-registered">Event Registered</option>
                <option value="setting">Settings</option>
                <option value="logout">Logout</option>
              </select>
            ) : (
              <a href="/login" className="primary-btn top-btn">
                <LuLogIn /> Login
              </a>
            )}
          </div>
          <div id="mobile-menu-wrap" />
        </div>
      </header>
    </div>
  );
};

export default Navbar;