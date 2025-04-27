  import React, { useEffect, useState } from "react";
  import { apiGetHotEventTop1 } from "../../apis/event/event";

  import { fetchDataSpeaker } from "../../reducer/speakerReducer";
  import { useDispatch, useSelector } from "react-redux";

  const HomeCenter = () => {
    const [hotEvent, setHotEvent] = useState(null);



    const dispatch = useDispatch();
    const { isLoading, error, dataSpeakerAll } = useSelector(
      (state) => state.speakerList
    );
    useEffect(() => {
      dispatch(fetchDataSpeaker());
    }, [dispatch]);

    return (
      <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333" }}>
        {/* Hot Event Section */}
        <section
          className="home-about-section spad"
          style={{
            padding: "50px 20px",
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            maxWidth: 1100,
            margin: "40px auto",
            boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 30 }}>
            {/* Left Image */}
            <div style={{ flex: "1 1 45%", minWidth: 280 }}>
              <img
                src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/3/27/1027990/Han-Hyo-Joo-01.jpg"
                alt="Event"
                style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 350 }}
              />
            </div>

            {/* Right Text */}
            <div style={{ flex: "1 1 50%", minWidth: 280 }}>
              <h2 style={{ fontSize: 28, marginBottom: 16, color: "#2c3e50" }}>
              </h2>
              <p style={{ lineHeight: 1.6, fontSize: 16, marginBottom: 24 }}>
                When I first got into the online advertising business, I was looking
                for the magical combination that would put my website into the top
                search engine rankings, catapult me to the forefront of the minds or
                individuals looking to buy my product, and generally make me rich
                beyond my wildest dreams! After succeeding in the business for this
                long, I’m able to look back on my old self with this kind of thinking
                and shake my head.
              </p>
          
              <a
                href={`/detailevent/${hotEvent?.event?.id}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#007bff")}
              >
                Discover Now
              </a>
            </div>
          </div>
        </section>

        {/* Speakers Section */}
        <section
          className="team-member-section"
          style={{
            padding: "50px 20px",
            maxWidth: 1100,
            margin: "0 auto 60px auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 30, marginBottom: 8, color: "#2c3e50" }}>
              Who’s speaking
            </h2>
            <p style={{ color: "#555", fontSize: 16 }}>
              These are our communicators, you can see each person information
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "center",
            }}
          >
            {isLoading && <p>Loading speakers...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {dataSpeakerAll?.map((el, index) => (
              <div
                key={index}
                className="member-item"
                style={{
                  width: 180,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
                  backgroundImage: `url(${el?.photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  cursor: "pointer",
                  color: "#fff",
                  height: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "16px",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                {/* Social Icons */}
                <div
                  className="mi-social-inner bg-gradient"
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                    opacity: 0.85,
                  }}
                >
                  <a href="#" style={{ color: "#fff", fontSize: 16 }}>
                    <i className="fa fa-facebook" />
                  </a>
                  <a href="#" style={{ color: "#fff", fontSize: 16 }}>
                    <i className="fa fa-instagram" />
                  </a>
                  <a href="#" style={{ color: "#fff", fontSize: 16 }}>
                    <i className="fa fa-twitter" />
                  </a>
                  <a href="#" style={{ color: "#fff", fontSize: 16 }}>
                    <i className="fa fa-linkedin" />
                  </a>
                </div>

                {/* Text */}
                <div className="mi-text" style={{ textShadow: "0 0 8px rgba(0,0,0,0.7)" }}>
                  <h5 style={{ margin: 0, fontWeight: "700", fontSize: 18 }}>
                    {el?.name || "Emma Sandoval"}
                  </h5>
                  <span style={{ fontSize: 14, opacity: 0.9 }}>Speaker</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  export default HomeCenter;