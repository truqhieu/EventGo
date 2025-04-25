import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiDeleteFeedback,
  apiEventRegistation,
  apiFeedbackComment,
  apiGetEventByCategoryName,
  apiGetEventById,
  apiReplyFeedbackComment,
  apiUpdateFeedback,
} from "../../apis/event/event";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./DetailEvent.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Audio } from "react-loader-spinner";
// hoặc bạn có thể sử dụng các loại spinner khác

import swal from "sweetalert";
import { useSelector } from "react-redux";
import { CiMenuKebab } from "react-icons/ci"; // Import icon
const DetailEvent = () => {
  const navigate = useNavigate();
  const { eid } = useParams();
  const [detailEvent, setDetailEvent] = useState(null);
  const [relateEvent, setRelateEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);

  const { user, errorUser, isLoadingUser } = useSelector(
    (state) => state.authen
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy thông tin chi tiết sự kiện
        const detail = await apiGetEventById(eid);
        setDetailEvent(detail?.mess);

        if (detail?.mess?.category) {
          const relateDetailEvent = await apiGetEventByCategoryName(
            detail.mess.category
          );
          setRelateEvent(relateDetailEvent?.mess);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchData();
  }, [eid]);

  // const [feedbackList,setFeedBacklist] = useStat
  const authDataLocalStorage = JSON.parse(localStorage.getItem("authData"));
  const isLogged = authDataLocalStorage?.isLogin;
  const accessToken = authDataLocalStorage?.accessToken;

  const roleAdmin = user?.role;

  // const handleRegisEvent =  async(eid) => {
  //   if(isLogged && accessToken){
  //     try {
  //        const response = await apiEventRegistation(eid)
  //        if(response?.success){
  //           swal('SUCCESS',"Bạn đã đăng kí sự kiện thành công","success")
  //        }
  //     } catch (error) {
  //       swal("Error", `${error?.response?.data?.mess}`, "error");
  //     }
  //   }else{
  //     swal('ERROR','Bạn cần đăng nhập để có thể đăng kí sự kiện này','error')
  //   }

  // };
  const handleRegisEvent = async (eid) => {
    if (isLogged && accessToken) {
      try {
        setLoading(true); // Bắt đầu loading
        const response = await apiEventRegistation(eid);
        console.log(response);

        if (response?.success) {
          swal("SUCCESS", "Bạn đã đăng kí sự kiện thành công", "success");
        }
      } catch (error) {
        swal("Error", `${error?.response?.data?.mess}`, "error");
      } finally {
        setLoading(false); // Kết thúc loading dù thành công hay thất bại
      }
    } else {
      swal(
        "ERROR",
        "Bạn cần đăng nhập để có thể đăng kí sự kiện này",
        "error"
      ).then(() => {
        // In the component where you are navigating
        navigate("/login", { state: { eid } });
      });
    }
  };

  const [comment, setComment] = useState("");
  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  // console.log("comment",comment);
  const handleSubmitFeedback = async () => {
    if (!comment.trim()) return;

    try {
      // setLoading(true);
      const response = await apiFeedbackComment(eid, comment);

      console.log(response?.event);

      if (response?.success) {
        setDetailEvent(response?.event);
        setComment("");
      }
    } catch (error) {
      swal("ERROR", `${error?.response?.data?.message}`, "error");
    }
  };

  // console.log(replyText);
  //feedback user
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMenu, setActiveMenu] = useState(null); // Để hiển thị menu

  const handleReplyFeedback = async (feedbackId) => {
    if (!replyText.trim()) return;

    setLoadingReply(true);
    try {
      const response = await apiReplyFeedbackComment(
        eid,
        feedbackId,
        replyText
      );

      if (response?.message === "Reply added successfully") {
        setDetailEvent((prev) => ({
          ...prev,
          feedback: prev.feedback.map((fb) =>
            fb._id === feedbackId
              ? {
                  ...fb,
                  replies: [
                    ...fb.replies,
                    {
                      updatedAt: new Date().getTime().toString(), // Tạo ID tạm thời
                      replyComment: replyText,
                      adminId: { _id: user._id, name: user.name }, // Thêm thông tin admin
                    },
                  ],
                }
              : fb
          ),
        }));

        setReplyText("");
        setReplyingTo(null); // Đóng khung nhập sau khi gửi thành công
      } else {
        await swal("Error!", "Failed to reply to feedback.", "error");
      }
    } catch (error) {
      console.error("Error replying to feedback:", error);
      await swal("Error!", "Something went wrong.", "error");
    } finally {
      setLoadingReply(false);
    }
  };

  //edit and xoa feedback
  const handleUpdateFeedback = async (feedbackId) => {
    try {
      setLoading(true);
      const response = await apiUpdateFeedback({
        eventId: eid,
        feedbackId,
        feedbackComment: editText,
      });

      if (response?.message === "Feedback updated successfully") {
        setDetailEvent((prev) => ({
          ...prev,
          feedback: prev.feedback.map((fb) =>
            fb._id === feedbackId
              ? { ...fb, feedbackComment: editText, updatedAt: new Date() }
              : fb
          ),
        }));
        setActiveMenu(null);

        setEditingFeedbackId(null);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const confirmDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this feedback!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (!confirmDelete) return;

      setLoading(true);
      const response = await apiDeleteFeedback({ eventId: eid, feedbackId });

      if (response?.message === "Feedback deleted successfully") {
        setDetailEvent((prev) => ({
          ...prev,
          feedback: prev.feedback.filter((fb) => fb._id !== feedbackId),
        }));
        setActiveMenu(null);
        await swal("Deleted!", "Your feedback has been deleted.", "success");
      } else {
        await swal("Error!", "Failed to delete feedback.", "error");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      await swal("Error!", "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="blog-hero-section"
        style={{
          backgroundImage: `url(${detailEvent?.backgroundImage})`,
          backgroundSize: "cover", // Optional: to ensure the image covers the entire section
          backgroundPosition: "center", // Optional: to center the image
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="bh-text">
                <h2>{detailEvent?.title}</h2>
                <ul>
                  <li>
                    <span>
                      By{" "}
                      {detailEvent?.speaker?.length > 0
                        ? detailEvent.speaker.map((el, index) => (
                            <span key={el._id}>
                              <strong>{el.name}</strong>
                              {index !== detailEvent.speaker.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))
                        : "Updating..."}
                    </span>
                  </li>
                  <li>{detailEvent?.date}</li>
                  <li>{detailEvent?.category}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog Details Hero Section End */}
      {/* Blog Details Section Begin */}
      <section className="blog-details-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <div className="bd-text">
                <div className="bd-title">
                  <p>
                    Postcards are also viable ways to generate increased contact
                    for your business but because business cards are handier and
                    easier to fit into a wallet or a business file organizer,
                    they are more certain to be carried anywhere and anytime.
                  </p>
                  <p>
                    Postcards are also viable ways to generate increased contact
                    for your business but because business cards are handier and
                    easier to fit into a wallet or a business file organizer,
                    they are more certain to be carried anywhere and anytime.
                    Moreover, what is printed on the card is as important as to
                    how the information is printed. A business card should have
                    the name and the logo of the company.
                  </p>
                </div>
                <div className="bd-more-pic">
                  <div className="row">
                    <div className="col-md-6">
                      <img src="img/blog/blog-details/blog-more-1.jpg" alt="" />
                    </div>
                    <div className="col-md-6">
                      <img src="img/blog/blog-details/blog-more-2.jpg" alt="" />
                    </div>
                  </div>
                </div>
                <div className="bd-tag-share">
                  <div className="tag">
                    <button
                      href="#"
                      className="btn btn-danger text-decoration-none"
                      onClick={() => handleRegisEvent(detailEvent?._id)}
                      disabled={loading} // Vô hiệu hóa nút khi đang loading
                    >
                      {loading ? (
                        <Audio
                          height="20"
                          width="20"
                          radius="4"
                          color="white"
                          ariaLabel="loading"
                          wrapperStyle={{
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        />
                      ) : null}
                      {loading ? "ĐANG XỬ LÝ..." : "EVENT REGISTATION"}
                    </button>
                  </div>

                  {/* Comment Section */}
                  {/* Comment Section */}
                  {isLogged && accessToken ? (
                    <div className="comment-section mt-4 p-4 bg-light rounded shadow-sm mx-3">
                      <h4 className="mb-3">Comments</h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmitFeedback();
                        }}
                        className="d-flex flex-column"
                      >
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          placeholder="Write a comment..."
                          value={comment}
                          onChange={handleInputChange}
                        />
                        <button
                          className="btn btn-primary w-25 align-self-end"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </form>
                      <ul className="list-unstyled mt-4">
                        {detailEvent?.feedback?.map((item, index) => (
                          <li
                            key={index}
                            className="p-3 mb-2 bg-white rounded shadow-sm position-relative"
                          >
                            {/* Use Flexbox to align content and push the menu to the right */}
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <small className="text-secondary d-block mt-1">
                                  {item?.updatedAt
                                    ? `Đã chỉnh sửa vào ${new Date(
                                        item.updatedAt
                                      ).toLocaleString()}`
                                    : `Đã đăng vào ${new Date(
                                        item.createdAt
                                      ).toLocaleString()}`}
                                </small>
                                <strong>{item?.userId?.name}</strong>
                                {editingFeedbackId === item._id ? (
                                  // Show input field when editing
                                  <div className="mt-2">
                                    <textarea
                                      className="form-control"
                                      rows="2"
                                      value={editText}
                                      onChange={(e) =>
                                        setEditText(e.target.value)
                                      }
                                      placeholder="Edit your comment..."
                                    />
                                  </div>
                                ) : (
                                  // Show static comment text when not editing
                                  <div>
                                    <p className="mb-0 text-muted">
                                      {item?.feedbackComment}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Menu Dropdown */}
                              {user?._id === item?.userId?._id && (
                                <div className="position-relative">
                                  <CiMenuKebab
                                    size={20}
                                    className="cursor-pointer"
                                    onClick={() =>
                                      setActiveMenu(
                                        activeMenu === index ? null : index
                                      )
                                    }
                                  />
                                  {activeMenu === index && (
                                    <div
                                      className="position-absolute bg-white shadow rounded p-2"
                                      style={{
                                        right: 0,
                                        top: "-20%",
                                        right: "80%",
                                      }}
                                    >
                                      {editingFeedbackId === item._id ? (
                                        <button
                                          className="btn btn-sm btn-success w-100"
                                          onClick={() =>
                                            handleUpdateFeedback(item._id)
                                          }
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-sm btn-warning w-100"
                                          onClick={() => {
                                            setEditingFeedbackId(item._id);
                                            setEditText(item.feedbackComment);
                                            setActiveMenu(null);
                                          }}
                                        >
                                          Edit
                                        </button>
                                      )}
                                      <button
                                        className="btn btn-sm btn-danger w-100 mt-1"
                                        onClick={() =>
                                          handleDeleteFeedback(item._id)
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Reply Button (Ẩn nếu đã có phản hồi) */}
                            {roleAdmin === "Admin" &&
                              item.replies.length === 0 && (
                                <div className="d-flex justify-content-end mt-2">
                                  <button
                                    className={`btn btn-sm ${
                                      replyingTo === index
                                        ? "btn-outline-danger"
                                        : "btn-outline-primary"
                                    }`}
                                    onClick={() =>
                                      setReplyingTo(
                                        replyingTo === index ? null : index
                                      )
                                    }
                                  >
                                    {replyingTo === index ? "Cancel" : "Reply"}
                                  </button>
                                </div>
                              )}

                            {/* Reply Input Box */}
                            {replyingTo === index && (
                              <div className="mt-2 d-flex align-items-center">
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                />
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleReplyFeedback(item._id)}
                                  disabled={loadingReply}
                                >
                                  {loadingReply ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    "Send"
                                  )}
                                </button>
                              </div>
                            )}

                            {/* Hiển thị danh sách reply */}
                            {item.replies?.length > 0 && (
                              <ul className="mt-3 ps-3 border-start">
                                {item.replies.map((reply, replyIndex) => (
                                  <li key={replyIndex} className="mt-2">
                                    <strong className="text-primary">
                                      {reply.adminId?.name}:
                                    </strong>
                                    <span className="ms-2">
                                      {reply.replyComment}
                                    </span>
                                    <small className="text-secondary d-block mt-1">
                                      Đã trả lời{" "}
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleString()}
                                    </small>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center text-muted"></div>
                  )}

                  <div className="s-share">
                    <span>Share:</span>
                    <a href="#">
                      <i className="fa fa-facebook" />
                    </a>
                    <a href="#">
                      <i className="fa fa-twitter" />
                    </a>
                    <a href="#">
                      <i className="fa fa-google-plus" />
                    </a>
                    <a href="#">
                      <i className="fa fa-instagram" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="related-post-section spad">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="section-title">
                <h2>Relatest Post</h2>
              </div>
            </div>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="blog-slider"
          >
            {relateEvent?.map((post) => (
              <SwiperSlide key={post?.id}>
                <div
                  className="blog-item set-bg"
                  style={{
                    backgroundImage: `url('${post?.logoImage}')`,
                  }}
                >
                  <div className="bi-tag bg-gradient">{post?.category}</div>
                  <div className="bi-text">
                    <h5>
                      <a href={`/detailevent/${post?._id}`}>{post?.title}</a>
                    </h5>
                    <span>
                      <i className="fa fa-clock-o"></i> {post?.date}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default DetailEvent;
