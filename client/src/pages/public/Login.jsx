import React, { useState } from "react";
import styles from "./Login.module.css";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLogin, apiRegistation } from "../../apis/authen/authentication";
import swal from "sweetalert";
const Login = () => {
  const [activeForm, setActiveForm] = useState("login");
  const navigate = useNavigate();
  const location = useLocation()
  const detailEventId = location?.state?.eid || null


  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [formRegis, setFormRegis] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;

    setFormLogin(() => ({
      ...formLogin,
      [name]: value,
    }));
  };

  const handleInputRegister = (e) => {
    const { name, value } = e.target;

    setFormRegis(() => ({
      ...formRegis,
      [name]: value,
    }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!formLogin?.email || !formLogin?.password) {
      swal("Error", "Please enter both email and password", "error");
      return; // Nếu trống, không tiếp tục submit form
    }
    try {
      const response = await apiLogin(formLogin?.email, formLogin?.password);
      if (response?.success) {
        swal("SUCCESS", "Login Successfully!!!", "success");
        if (response?.userData?.role === "User") {
          detailEventId ? navigate(`/detailevent/${detailEventId}`) : navigate('/');
          localStorage.setItem(
            "authData",
            JSON.stringify({
              isLogin: true,
              accessToken: response?.accessToken,
            })
          );
        }
        if (response?.userData?.role === "Admin") {
          navigate("/admin");
          localStorage.setItem(
            "authData",
            JSON.stringify({
              isLogin: true,
              accessToken: response?.accessToken,
            })
          );
        }
        if (response?.userData?.role === "Staff") {
          navigate("/staff");
          localStorage.setItem(
            "authData",
            JSON.stringify({
              isLogin: true,
              accessToken: response?.accessToken,
            })
          );
        }
      }
    } catch (error) {
      swal("FAILED", "Login Failed!!!", "error");
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (!formRegis?.email || !formRegis?.name || !formRegis?.password) {
      swal("Error", "Please fill in all fields", "error");
      return; // Nếu trống, không tiếp tục submit form
    }
    try {
      const response = await apiRegistation(
        formRegis?.name,
        formRegis?.email,
        formRegis?.password
      );
      if (response?.success) {
        swal({
          title: "Đăng ký thành công",
          text: "Vui lòng kiểm tra email để hoàn tất xác thực!",
          icon: "success",
        });
      }
    } catch (error) {
      swal("Error", `${error?.response?.data?.mess}`, "error");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <section className="h-100">
        <div className={`container py-5 h-100 ${styles.loginWrapper}`}>
          <div
            className={`row d-flex justify-content-center align-items-center h-100 ${styles.rowLogin}`}
          >
            <div className="col-xl-10">
              <div className={`card rounded-3 text-black ${styles.loginCard}`}>
                <div className="row g-0">
                  <div className={`col-lg-6 ${styles.colLogin}`}>
                    <div
                      className={`card-body p-md-5 mx-md-4 ${styles.loginCardBody}`}
                    >
                      <div className="text-center">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                          alt="logo"
                          className={styles.logo}
                        />
                        <h4 className="mt-1 mb-5 pb-1">
                          We are The Lotus Team
                        </h4>
                      </div>

                      {/* ==== FORM LOGIN ==== */}
                      {activeForm === "login" && (
                        <form onSubmit={handleSubmitLogin}>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="email"
                              id="loginEmail"
                              name="email"
                              placeholder=" "
                              className="form-control"
                              onChange={handleChangeLogin}
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="loginEmail"
                            >
                              Email
                            </label>
                          </div>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="password"
                              id="loginPassword"
                              name="password"
                              placeholder=" "
                              className="form-control"
                              onChange={handleChangeLogin}
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="loginPassword"
                            >
                              Password
                            </label>
                          </div>
                          <button
                            type="submit"
                            className={`btn ${styles.loginButton}`}
                          >
                            Log in
                          </button>
                          <p className="text-center mt-3">
                            <a
                              href="#"
                              className={styles.switchButton}
                              onClick={() => setActiveForm("forgot")}
                            >
                              Forgot password?
                            </a>
                          </p>
                          <p className="text-center">
                            Don't have an account?{" "}
                            <a
                              href="#"
                              className={styles.switchButton}
                              onClick={() => setActiveForm("register")}
                            >
                              Create new
                            </a>
                          </p>
                          <a
                            href="/"
                            style={{ marginLeft: "60px" }}
                            className={`text-center text-blue text-decoration-none`}
                          >
                            Back To Home
                          </a>
                        </form>
                      )}

                      {/* ==== FORM REGISTER ==== */}
                      {activeForm === "register" && (
                        <form onSubmit={handleSubmitRegister}>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="text"
                              id="registerName"
                              name="name"
                              placeholder=" "
                              className="form-control"
                              onChange={handleInputRegister}
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="registerName"
                            >
                              Full Name
                            </label>
                          </div>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="email"
                              id="registerEmail"
                              name="email"
                              placeholder=" "
                              className="form-control"
                              onChange={handleInputRegister}
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="registerEmail"
                            >
                              Email
                            </label>
                          </div>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="password"
                              id="registerPassword"
                              placeholder=" "
                              name="password"
                              className="form-control"
                              onChange={handleInputRegister}
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="registerPassword"
                            >
                              Password
                            </label>
                          </div>
                          <button
                            type="submit"
                            className={`btn ${styles.loginButton}`}
                          >
                            Sign Up
                          </button>
                          <p className="text-center mt-3">
                            Already have an account?{" "}
                            <a
                              href="#"
                              className={styles.switchButton}
                              onClick={() => setActiveForm("login")}
                            >
                              Log in
                            </a>
                          </p>
                        </form>
                      )}

                      {/* ==== FORM FORGOT PASSWORD ==== */}
                      {activeForm === "forgot" && (
                        <form>
                          <div
                            className={`form-outline mb-4 ${styles.formControl}`}
                          >
                            <input
                              type="email"
                              id="forgotEmail"
                              placeholder=" "
                              className="form-control"
                              required
                            />
                            <label
                              className={styles.formLabel}
                              htmlFor="forgotEmail"
                            >
                              Enter your email
                            </label>
                          </div>
                          <button className={`btn ${styles.loginButton}`}>
                            Reset Password
                          </button>
                          <p className="text-center mt-3">
                            Remember your password?{" "}
                            <button
                              className={styles.switchButton}
                              onClick={() => setActiveForm("login")}
                            >
                              Log in
                            </button>
                          </p>
                        </form>
                      )}
                    </div>
                  </div>
                  <div className={`col-lg-6 ${styles.gradientSection}`}>
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">We are more than just a company</h4>
                      <p className="small mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;