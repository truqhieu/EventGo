import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import "./Admin.css";
import { fetchAllEvent } from "../../../reducer/eventReducer";
import {
  apiCreateEvent,
  apiDeleteEvent,
  apiEventRegistantDetail,
  apiGetEventById,
  apiOpenSpots,
  apiUpdateEvent,
  apiUpdateStatusEventRegistant,
} from "../../../apis/event/event";
import { toast } from "react-toastify";
import { fetchDataSpeaker } from "../../../reducer/speakerReducer";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Audio } from "react-loader-spinner";
const Admin = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState({
    confirmed: false,
    cancelled: false,
  });
  const [showModal, setShowModal] = useState(false);

  const [beforeBackGroundImage, setBeforeBackGroundImage] = useState(null);
  const [afterBackgroundImage, setAfterBackgroundImage] = useState(null);
  const [afterLogoImage, setAfterLogoImage] = useState(null);

  const [modalFilterDetailEvent, setModalFilterDetailEvent] = useState(false);
  const [updateImageLogo, setUpdateImageLogo] = useState(null);
  const [updateImageBackground, setUpdateImageBackground] = useState(null);

  const { dataSpeakerAll } = useSelector((state) => state.speakerList);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [extraSlots, setExtraSlots] = useState("");

  useEffect(() => {
    dispatch(fetchDataSpeaker());
  }, [dispatch]);

  const { eventAll, errorEventAll, loadingEventAll } = useSelector(
    (state) => state.event
  );
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    dispatch(fetchAllEvent());
  }, [dispatch]);
  const [selectedOption, setSelectedOption] = useState(""); // Dropdown Admin

  const [eventStatusFilter, setEventStatusFilter] = useState("all"); // Lọc theo trạng thái sự kiện
  const [eventStatusFilterDetail, setEventStatusFilterDetail] = useState("all"); // Lọc theo trạng thái sự kiện
  const [userStatusFilterDetail, setUserStatusFilterDetail] = useState("all"); // Lọc theo trạng thái sự kiện

  const [categoryFilter, setcategoryFilter] = useState("all"); // Lọc theo category

  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);

  const [isEventDetail, setIsEventDetail] = useState(false);
  const [isEventList, setIsEventList] = useState(false);
  const [isUpdateEvent, setIsUpdateEvent] = useState(false);

  const [idUpdateEvent, setIdUpdateEvent] = useState(null);
  // const [idEventRegistant, setIdEventRegistant] = useState(null);
  const [statusUpdEventRegistant, setStatusUpdEventRegistant] = useState(null);

  const [eventRegistantData, setEventRegistantData] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const [isEventWaitlist, setIsEventWaitlist] = useState(false);
  const [isEventWaitlistDetail, setIsEventWaitlistDetail] = useState(false);
  const handleSelectWaitlist = () => {
    setIsEventList(false);
    setIsEventDetail(false);
    setIsEventWaitlist(true);
    setIsEventWaitlistDetail(false);
    setIsUpdateEvent(false);
  };
  const handleOpenAddEvent = () => setIsAddEventOpen(true);
  const handleCloseAddEvent = () => setIsAddEventOpen(false);
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

  // const [formUpd, setFormUpd] = useState({
  //   title: "",
  //   description: "",
  //   date: "",
  //   location: "",
  //   capacity: "",
  //   category: "",
  //   speaker: "",
  //   status: "",
  //   backgroundImage: "",
  //   logoImage: "",
  //   organizerUnit: {
  //     name: "",
  //     address: "",
  //     contactInfo: {
  //       phone: "",
  //       email: "",
  //     },
  //   },
  // });

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "logout") {
      alert("Logging out...");
    }
  };
  // Lọc dữ liệu dựa trên bộ lọc

  const handleSelectEvent = (view) => {
    setIsEventList(view === "list");
    setIsEventDetail(view === "detail");
    setIsEventWaitlist(view === "waitlist");
    setIsEventWaitlistDetail(false); // luôn reset detail view
    setIsUpdateEvent(false);
  };

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

  const statusEvent = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

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

  const handleOpenUpdateEvent = async (eid) => {
    setIsUpdateEvent(true);
    setIsEventList(false);
    setIdUpdateEvent(eid);

    try {
      const response = await apiGetEventById(eid);
      setInitialUpd(response?.mess);
      // setFormUpd(response?.mess);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  // const handleFileChange = (e) => {
  //   const { name } = e.target;
  //   const file = e.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       if (name === "logoImage") {
  //         setInitialUpd((prevState) => ({
  //           ...prevState,
  //           [name]: reader.result, // Cập nhật hình ảnh dưới dạng base64 để xem trước
  //         }));
  //         setUpdateImageLogo(file); // Cập nhật logo mới
  //       } else if (name === "backgroundImage") {
  //         setInitialUpd((prevState) => ({
  //           ...prevState,
  //           [name]: reader.result, // Cập nhật hình ảnh dưới dạng base64 để xem trước
  //         }));
  //         setUpdateImageBackground(file); // Cập nhật hình nền mới
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleUpdateImgLogo = (e) => {
    const { name } = e.target;
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
    const reader = new FileReader();
    reader.onloadend = () => {
      setInitialUpd((prev) => ({
        ...prev,
        [name]: reader.result,
      }));
    };
    reader.readAsDataURL(file); // Đọc file dưới dạng URL

    setUpdateImageLogo(file); // Lưu tệp gốc để gửi đi
  };

  const handleUpdateImgBackground = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (!file) {
      toast.error("Please choose image to create event");
      return;
    }

    const validFormImage = ["image/jpeg", "image/png"];

    if (!validFormImage.includes(file.type)) {
      toast.error("Please choose image file must be jpeg or png");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setInitialUpd((prev) => ({
        ...prev,
        [name]: reader.result,
      }));
    };
    reader.readAsDataURL(file); // Đọc file dưới dạng URL

    // Gửi tệp hình ảnh thay vì đọc và lưu dưới dạng base64
    setUpdateImageBackground(file); // Lưu tệp gốc để gửi đi
  };

  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;

    setInitialUpd((prevState) => {
      const keys = name.split("."); // Tách name theo dấu "."

      if (keys.length === 1) {
        // Nếu không có nested key, cập nhật trực tiếp
        return { ...prevState, [name]: value };
      } else if (keys.length === 2) {
        // Nếu có 2 cấp (e.g., organizerUnit.name)
        return {
          ...prevState,
          [keys[0]]: {
            ...prevState[keys[0]],
            [keys[1]]: value,
          },
        };
      } else if (keys.length === 3) {
        // Nếu có 3 cấp (e.g., organizerUnit.contactInfo.phone)
        return {
          ...prevState,
          [keys[0]]: {
            ...prevState[keys[0]],
            [keys[1]]: {
              ...prevState[keys[0]][keys[1]],
              [keys[2]]: value,
            },
          },
        };
      }
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!initialUpd.date) {
      toast.error("Date is required!");
      return;
    }
    if (!initialUpd.endDate) {
      toast.error("End Date is required!");
      return;
    }
    const formData = new FormData();
    // 1) các trường text/number
    formData.append("eid", idUpdateEvent);
    formData.append("title", initialUpd.title);
    formData.append("description", initialUpd.description);
    formData.append("date", initialUpd.date);
    formData.append("endDate", initialUpd.endDate);
    formData.append("location", initialUpd.location);
    formData.append("capacity", initialUpd.capacity);
    formData.append("category", initialUpd.category);
    formData.append("status", initialUpd.status);

    // 2) speakerIds: mỗi id đẩy một lần
    if (Array.isArray(initialUpd.speaker)) {
      initialUpd.speaker.forEach((id) => {
        formData.append("speakerIds", id);
      });
    } else if (initialUpd.speaker) {
      formData.append("speakerIds", initialUpd.speaker);
    }

    // 3) organizerUnit gói làm 1 field JSON
    formData.append(
      "organizerUnit",
      JSON.stringify({
        name: initialUpd.organizerUnit?.name || "",
        address: initialUpd.organizerUnit?.address || "",
        contactInfo: {
          phone: initialUpd.organizerUnit?.contactInfo?.phone || "",
          email: initialUpd.organizerUnit?.contactInfo?.email || "",
        },
      })
    );

    // 4) Ảnh mới (nếu user chọn)
    if (updateImageLogo) {
      formData.append("logoImage", updateImageLogo);
    }
    if (updateImageBackground) {
      formData.append("backgroundImage", updateImageBackground);
    }

    try {
      const response = await apiUpdateEvent(formData);
      if (response.success) {
        toast.success("Event updated successfully!");
        dispatch(fetchAllEvent());
        setIsUpdateEvent(false); // đóng form
      } else {
        toast.error("Update failed: " + (response.message || ""));
      }
    } catch (err) {
      console.error("UpdateEvent Error:", err);
      toast.error("Failed to update event");
    }
  };

  const listDataFilter = Array.isArray(eventAll?.mess)
    ? [...eventAll?.mess]
    : [];
  const listDataFilterDetail = Array.isArray(eventRegistantData?.attendees)
    ? [...eventRegistantData?.attendees]
    : [];

  let afterFilterDetail = listDataFilterDetail?.filter((item) => {
    // const matchesStatusEvent =
    // eventStatusFilterDetail === "all" || item?.eventstatus === eventStatusFilterDetail;
    const matchesStatusUser =
      userStatusFilterDetail === "all" ||
      item?.statusRegisEvent[0]?.status === userStatusFilterDetail;

    return matchesStatusUser;
  });

  let afterFilter = listDataFilter?.filter((item) => {
    const matchesCategory =
      categoryFilter === "all" || item?.category === categoryFilter;
    const matchesStatusEvent =
      eventStatusFilter === "all" || item?.status === eventStatusFilter;

    return matchesCategory && matchesStatusEvent;
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

  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (attendee) => {
    setSelectedAttendee(attendee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAttendee(null);
    setIsModalOpen(false);
  };
  const handleUpdateStatusEventRegistant = async (data) => {
    if (data === "confirmed") {
      setLoading((prevState) => ({
        ...prevState,
        confirmed: true,
      }));
    } else {
      setLoading((prevState) => ({
        ...prevState,
        cancelled: true,
      }));
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Trễ 2 giây

      const response = await apiUpdateStatusEventRegistant(
        selectedAttendee?.id,
        data,
        selectedAttendee?.statusRegisEvent[0]?.idEvent
      );

      if (response?.success) {
        // Cập nhật trạng thái của selectedAttendee
        setSelectedAttendee((prevAttendee) => {
          if (!prevAttendee) return null;

          return {
            ...prevAttendee,
            statusRegisEvent: prevAttendee.statusRegisEvent.map((status) => ({
              ...status,
              status: data, // Cập nhật trạng thái mới
            })),
          };
        });

        // Cập nhật dữ liệu trong bảng nếu cần
        // Nếu bạn có state lưu trữ eventRegistantData, bạn cũng nên cập nhật nó
        setEventRegistantData((prevData) => {
          if (!prevData) return prevData;

          return {
            ...prevData,
            attendees: prevData.attendees.map((attendee) =>
              attendee.id === selectedAttendee.id
                ? {
                    ...attendee,
                    statusRegisEvent: attendee.statusRegisEvent.map(
                      (status) => ({
                        ...status,
                        status: data,
                      })
                    ),
                  }
                : attendee
            ),
          };
        });

        toast.success(`${data} event status successfully!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (data === "confirmed") {
        setLoading((prevState) => ({
          ...prevState,
          confirmed: false,
        }));
      } else if (data === "cancelled") {
        setLoading((prevState) => ({
          ...prevState,
          cancelled: false,
        }));
      }
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar border-end p-3">
        <h4 className="text-center mb-4">Event Go</h4>
        <nav className="nav flex-column">
          {/* Users Dropdown */}
          <div className="nav-item">
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
                <a href="#" className="nav-link">
                  User Grid
                </a>
                <a href="#" className="nav-link">
                  User List
                </a>
                <a href="#" className="nav-link">
                  Users Profile
                </a>
              </div>
            )}
          </div>
          <div className="nav-item">
            <a
              href="#"
              className="nav-link fw-bold d-flex justify-content-between align-items-center"
              onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
            >
              <span>Event</span>
              <span>{isEventMenuOpen ? "▼" : "▶"}</span>
            </a>
            {isEventMenuOpen && (
              <div className="submenu">
                <a
                  className="nav-link"
                  onClick={() => handleSelectEvent("list")}
                >
                  Event List
                </a>
                <a
                  className="nav-link"
                  onClick={() => handleSelectEvent("waitlist")}
                >
                  Event Waitlist
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="content p-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3></h3>

          <div className="d-flex align-items-center">
            <select
              className="form-select"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="" disabled hidden>
                Admin
              </option>
              <option value="profile">Profile</option>
              <option value="settings">Settings</option>
              <option value="logout" className="text-danger">
                Logout
              </option>
            </select>
          </div>
        </div>

        {isEventList && (
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
                          className={`badge bg-${
                            event.status === "Upcoming"
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
        )}

        {/* EventDetail */}
        {isEventDetail && (
          <div>
            <h3>Event Detail</h3>
            {modalFilterDetailEvent && (
              <div className="d-flex gap-2 mb-3 mt-5">
                {/* <select
                  className="form-select w-auto"
                  value={eventStatusFilterDetail}
                  onChange={(e) => setEventStatusFilterDetail(e.target.value)}
                >
                  <option value="">All Event Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select> */}

                <select
                  className="form-select w-auto"
                  value={userStatusFilterDetail}
                  onChange={(e) => setUserStatusFilterDetail(e.target.value)}
                >
                  <option value="all">All User Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
            )}

            {/* Table */}

            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Capacity</th>
                  <th>Event Status</th>
                  <th>User Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {afterFilterDetail?.length > 0 ? (
                  afterFilterDetail?.map((attendee, index) => (
                    <tr key={index}>
                      <td>{attendee.name || "N/A"}</td>
                      <td>{attendee.email || "N/A"}</td>
                      <td>{eventRegistantData.title || "N/A"}</td>
                      <td>{eventRegistantData.date || "N/A"}</td>
                      <td>{eventRegistantData.capacity || "N/A"}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            eventRegistantData.eventstatus === "Upcoming"
                              ? "warning"
                              : eventRegistantData.eventstatus === "Ongoing"
                              ? "primary"
                              : eventRegistantData.eventstatus === "Completed"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {eventRegistantData.eventstatus}
                        </span>
                      </td>
                      <td>
                        {attendee.statusRegisEvent?.[0]?.status ? (
                          <span
                            className={`badge bg-${
                              attendee.statusRegisEvent[0].status === "pending"
                                ? "secondary"
                                : attendee.statusRegisEvent[0].status ===
                                  "confirmed"
                                ? "success"
                                : "danger"
                            }`}
                          >
                            {attendee.statusRegisEvent[0].status}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">pending</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={() => handleOpenModal(attendee)}
                        >
                          Set
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No User Register</p>
                )}
              </tbody>
            </table>

            {/* <!-- Modal --> */}
            {isModalOpen && (
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Cập nhật trạng thái</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div>
                        <p>
                          <strong>Name:</strong> {selectedAttendee?.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedAttendee?.email}
                        </p>
                      </div>
                      <div className="form-group mt-3">
                        <label>Chọn trạng thái mới:</label>
                        {selectedAttendee?.statusRegisEvent?.[0]?.status ===
                        "pending" ? (
                          <div className="d-flex gap-2 mt-2">
                            <button
                              className="btn btn-success"
                              disabled={loading?.confirmed} // Vô hiệu hóa nút khi đang loading
                              onClick={() =>
                                handleUpdateStatusEventRegistant("confirmed")
                              }
                            >
                              {loading?.confirmed ? (
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
                              {loading?.confirmed
                                ? "ĐANG XỬ LÝ..."
                                : "Confirmed"}
                            </button>
                            <button
                              className="btn btn-danger"
                              disabled={loading?.cancelled} // Vô hiệu hóa nút khi đang loading
                              onClick={() =>
                                handleUpdateStatusEventRegistant("cancelled")
                              }
                            >
                              {loading?.cancelled ? (
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
                              {loading?.cancelled
                                ? "ĐANG XỬ LÝ..."
                                : "Cancelled"}
                            </button>
                          </div>
                        ) : selectedAttendee?.statusRegisEvent?.[0]?.status ===
                          "cancelled" ? (
                          <p className="text-danger mt-2">
                            User has been cancelled
                          </p>
                        ) : selectedAttendee?.statusRegisEvent?.[0]?.status ===
                          "confirmed" ? (
                          <p className="text-danger mt-2">
                            User has been confirmed
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && <div className="modal-backdrop fade show"></div>}
          </div>
        )}

        {isEventWaitlist && (
          <div>
            <h3>Event Waitlist</h3>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Attendees/Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {eventAll.mess
                  .filter((ev) => (ev.attendees?.length || 0) >= ev.capacity)
                  .map((ev) => (
                    <tr
                      key={ev._id}
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        // load chi tiết waitlist
                        setIsEventWaitlistDetail(true);
                        setIsEventWaitlist(false);
                        const res = await apiGetEventById(ev._id);
                        setEventRegistantData(res.mess);
                      }}
                    >
                      <td>{ev.title}</td>
                      <td>
                        {ev.attendees.length}/{ev.capacity}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning">
                          View Waitlist
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => {
                setIsEventWaitlist(false);
                setIsEventList(true);
              }}
            >
              Back to Event List
            </button>
          </div>
        )}

        {/* === 4) Chi tiết Waitlist của 1 event === */}
        {isEventWaitlistDetail && eventRegistantData && (
          <div>
            <h3>
              Waitlist for “{eventRegistantData.title}”
              <small className="text-muted">
                ({eventRegistantData.attendees.length}/
                {eventRegistantData.capacity})
              </small>
            </h3>
            <h5 className="mt-4">
              Users on Waitlist ({eventRegistantData.waitlist?.length || 0})
            </h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {eventRegistantData.waitlist?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex align-items-center mt-2">
              <input
                type="number"
                className="form-control w-auto me-2"
                placeholder="Extra slots"
                value={extraSlots}
                onChange={(e) => setExtraSlots(e.target.value)}
              />
              <button
                className="btn btn-success"
                onClick={async () => {
                  await apiOpenSpots(eventRegistantData._id, extraSlots);
                  // 1) Lấy chi tiết registration có đầy đủ status
                  const res = await apiEventRegistantDetail(
                    eventRegistantData._id
                  );
                  setEventRegistantData(res.mess);
                  // 2) Chuyển về màn hình Event Detail
                  setIsEventWaitlistDetail(false);
                  setIsEventDetail(true);
                  setModalFilterDetailEvent(true);
                  setExtraSlots("");
                  toast.success(`Added ${extraSlots} slots`);
                }}
              >
                Open Slots
              </button>
            </div>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => {
                setIsEventWaitlistDetail(false);
                setIsEventWaitlist(true);
              }}
            >
              Back to Waitlist
            </button>
          </div>
        )}

        {/* updateEvent */}
        {isUpdateEvent && (
          <div className="container mt-5" style={{ width: "85%" }}>
            {/* Tiêu đề */}
            <h3 className="text-start text-update mb-4">Update Event</h3>

            <form onSubmit={handleSubmitUpdate}>
              <div className="row">
                {/* Title */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={initialUpd?.title}
                    className="form-control"
                    onChange={handleChangeUpdate}
                    name="title"
                    required
                  />
                </div>

                {/* Date */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    onChange={handleChangeUpdate}
                    value={
                      initialUpd?.date
                        ? new Date(initialUpd.date).toLocaleDateString("en-CA") // 'en-CA' đảm bảo định dạng YYYY-MM-DD
                        : ""
                    }
                    required
                  />
                </div>

                {/* End Date */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    onChange={handleChangeUpdate}
                    value={
                      initialUpd?.endDate
                        ? new Date(initialUpd.endDate).toLocaleDateString(
                            "en-CA"
                          ) // Đồng nhất định dạng với 'Date'
                        : ""
                    }
                  />
                </div>

                {/* Location */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={initialUpd?.location}
                    onChange={handleChangeUpdate}
                    className="form-control"
                    name="location"
                    required
                  />
                </div>

                {/* Organizer Unit */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Organizer Unit Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChangeUpdate}
                    name="organizerUnit.name"
                    value={initialUpd?.organizerUnit?.name || ""}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Organizer Address (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChangeUpdate}
                    name="organizerUnit.address"
                    value={initialUpd?.organizerUnit?.address || ""}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Organizer Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChangeUpdate}
                    name="organizerUnit.contactInfo.phone"
                    value={initialUpd?.organizerUnit?.contactInfo?.phone || ""}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Organizer Email</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={handleChangeUpdate}
                    name="organizerUnit.contactInfo.email"
                    value={initialUpd?.organizerUnit?.contactInfo?.email || ""}
                  />
                </div>

                {/* Capacity */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    value={initialUpd?.capacity}
                    onChange={handleChangeUpdate}
                    className="form-control"
                    name="capacity"
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    value={initialUpd?.category}
                    name="category"
                    onChange={handleChangeUpdate}
                    className="form-select"
                  >
                    {categoriesEvent?.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Speaker
                  </label>
                  <select
                    name="speaker"
                    value={
                      initialUpd?.speaker?.length > 0
                        ? initialUpd.speaker[0]?._id
                        : ""
                    } // Lấy _id đầu tiên nếu có
                    className="form-select"
                    onChange={handleChangeUpdate}
                  >
                    {dataSpeakerAll?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Event Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Event Status</label>
                  <select
                    className="form-select"
                    value={initialUpd?.status}
                    onChange={handleChangeUpdate}
                    name="status"
                  >
                    {statusEvent?.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload logo */}
                <div className="col-md-7">
                  <div className="upload-container">
                    <input
                      id="file-upload-logo"
                      type="file"
                      name="logoImage"
                      hidden
                      onChange={handleUpdateImgLogo}
                    />

                    <div className="preview-box">
                      <img
                        src={
                          initialUpd?.logoImage ||
                          "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
                        }
                        alt="Logo Preview"
                      />
                    </div>
                    <label htmlFor="file-upload-logo" className="upload-label">
                      <p style={{ color: "white" }}>
                        Chọn hình ảnh logo để update
                      </p>
                    </label>
                  </div>
                </div>

                {/* Upload background */}
                <div className="col-md-5">
                  <div className="upload-container">
                    <label htmlFor="file-upload-bg" className="upload-label">
                      <i className="bi bi-cloud-arrow-up" />
                      <p style={{ color: "white" }}>Chọn hình nền để update</p>
                    </label>
                    <input
                      id="file-upload-bg"
                      type="file"
                      name="backgroundImage"
                      hidden
                      onChange={handleUpdateImgBackground}
                    />
                    <div className="preview-box">
                      <img
                        src={
                          initialUpd?.backgroundImage ||
                          "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
                        }
                        alt="Background Preview"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="col-12 text-end mt-3">
                  <button type="submit" className="btn btn-success">
                    Update Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
