import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.authen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sự kiện từ API
        const response = await axios.get("http://localhost:9999/api/event");
        
        // Handle different possible response structures
        const eventsData = response.data?.data || response.data?.mess || response.data;
        
        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else {
          setError("Invalid events data format");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm kiểm tra xem user đã đăng ký sự kiện chưa
  const checkRegistration = (event) => {
    if (!user || !event?.attendees) return false;
    return event.attendees.some(attendee => 
      attendee._id ? attendee._id.toString() === user._id.toString() : 
      attendee.toString() === user._id.toString()
    );
  };

  if (loading) return <div className="text-center py-5">Loading events...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;
  if (!Array.isArray(events) || events.length === 0) return <div className="text-center py-5">No events available</div>;

  // Chia sự kiện thành 2 cột - only if events is an array
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
              {leftColumnEvents.map((event) => (
                <EventCard key={event._id} event={event} user={user} checkRegistration={checkRegistration} />
              ))}
            </div>

            {/* Cột phải */}
            <div className="col-lg-6">
              {rightColumnEvents.map((event) => (
                <EventCard key={event._id} event={event} user={user} checkRegistration={checkRegistration} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Separate component for event card to reduce duplication
const EventCard = ({ event, user, checkRegistration }) => (
  <div
    className="blog-item"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${event.backgroundImage || 'https://via.placeholder.com/800x500'})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginBottom: "30px",
      minHeight: "300px"
    }}
  >
    <div className="bi-tag bg-gradient">
      {event.category}
    </div>
    <div className="bi-text">
      <h3>
        <a href={`/detailevent/${event._id}`} className="text-white">
          {event.title}
        </a>
      </h3>
      <span className="text-light">
        <i className="fa fa-clock-o mr-2" />
        {new Date(event.date).toLocaleString()}
      </span>
      <p className="text-light">{event.location}</p>
      {user && (
        <span 
          className={`badge ${checkRegistration(event) ? 'bg-success' : 'bg-secondary'}`}
          style={{ fontSize: '0.9rem' }}
        >
          {checkRegistration(event) ? 'Registered' : 'Not registered'}
        </span>
      )}
    </div>
  </div>
);

export default Event;