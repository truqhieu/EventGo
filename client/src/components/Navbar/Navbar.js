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
import { fetchCurrentData, fetCurrentData } from "../../reducer/authenReducer";
import { isTokenExpired } from "../../ultils/helper";
import { apiRefreshToken } from "../../apis/authen/authentication";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("authData")) || {};
  const isLogged = authData?.isLogin || false;
  const accessToken = authData?.accessToken || "";
  const { isLoading, error, dataSpeakerAll } = useSelector(
    (state) => state.speakerList
  );
  const { user, errorUser, isLoadingUser } = useSelector(
    (state) => state.authen
  );
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
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          const result = await apiRefreshToken();

          if (!result?.data?.success) {
            // Xử lý khi server trả về success: false
            handleLogout()
          }
        } catch (error) {
          // Xử lý mọi lỗi từ API
          handleLogout()
        }
      }
    };

    if (accessToken) checkToken();
  }, [dispatch, accessToken]);

  return (
    <div>
      <header className="header-section">
        <div className="container">
          <div className="logo">
            <a href="/">
              <img
                src="https://ticketgo.vn/images/ticketgo/logo3.png"
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
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="/speaker">Speakers</a>
                  <ul className="dropdown">
                    {dataSpeakerAll?.map((item, index) => (
                      <li key={index}>
                        <a href="/speaker">{item?.name}</a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <a href="#">Schedule</a>
                </li>
                <li>
                  <a href="/event">Hot News</a>
                </li>
                <li>
                  <a href="#">Contacts</a>
                </li>
              </ul>
            </nav>
            {isLogged ? (
              <select
                className="primary-btn top-btn"
                onChange={handleSelectDropdownChange}
                aria-label="User Menu"
              >
                <option selected>Hello {user?.name}</option>
                <option value="profile">Profile</option>
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
