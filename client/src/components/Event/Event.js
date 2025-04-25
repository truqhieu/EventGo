import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Event = () => {
  const [events, setEvents] = useState([]);
  const { user } = useSelector((state) => state.authen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tất cả sự kiện từ API
        const response = await axios.get("http://localhost:9999/api/event");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
  }, []);

  // Hàm kiểm tra xem user đã đăng ký sự kiện chưa
  const checkRegistration = (event) => {
    if (!user || !event?.attendees) return false;
    return event.attendees.some(attendee => attendee.toString() === user._id.toString());
  };

  // Chia sự kiện thành 2 cột
  const leftColumnEvents = events.slice(0, Math.ceil(events.length / 2));
  const rightColumnEvents = events.slice(Math.ceil(events.length / 2));

  return (
    <>
      <section className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>News Latest</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section spad">
        <div className="container">
          <div className="row">
            {/* Cột trái */}
            <div className="col-lg-6">
              {leftColumnEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`blog-item ${index === 0 ? 'large-item' : ''}`}
                  style={{
                    backgroundImage: `url(${event.backgroundImage || 'https://via.placeholder.com/800x500'})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "30px"
                  }}
                >
                  <div className="bi-tag bg-gradient">
                    {event.category}
                  </div>
                  <div className="bi-text">
                    <h3>
                      <a href={`/detailevent/${event._id}`}>
                        {event.title}
                      </a>
                    </h3>
                    <span>
                      <i className="fa fa-clock-o" />
                      {new Date(event.date).toLocaleString()}
                    </span>
                    {user && (
                      <p style={{ color: 'red', marginTop: '10px' }}>
                        Status: {checkRegistration(event) ? 'Registered' : 'Not registered'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải */}
            <div className="col-lg-6">
              {rightColumnEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`blog-item ${index === 0 ? 'large-item' : ''}`}
                  style={{
                    backgroundImage: `url(${event.backgroundImage || 'https://via.placeholder.com/800x500'})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "30px"
                  }}
                >
                  <div className="bi-tag bg-gradient">
                    {event.category}
                  </div>
                  <div className="bi-text">
                    <h3>
                      <a href={`/detailevent/${event._id}`}>
                        {event.title}
                      </a>
                    </h3>
                    <span>
                      <i className="fa fa-clock-o" />
                      {new Date(event.date).toLocaleString()}
                    </span>
                    {user && (
                      <p style={{ color: 'red', marginTop: '10px' }}>
                        Status: {checkRegistration(event) ? 'Registered' : 'Not registered'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Event;