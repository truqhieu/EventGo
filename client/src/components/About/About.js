import React from "react";
import "./About.css";

const About = () => {
    return (
        <div>
            {/* Banner hoặc Header */}
            <section className="about-banner">
                <div className="container">
                    <h1>About Us</h1>
                    <p>Learn more about our journey and mission.</p>
                </div>
            </section>

            {/* Section Giới thiệu */}
            <section className="about-section">
                <div className="container">
                    <h2>Our Mission</h2>
                    <p>
                        We aim to bring the best experiences to our audience through engaging events and insightful speakers.
                    </p>
                </div>
            </section>

            {/* Section Tiến trình */}
            <section className="about-timeline">
                <div className="container">
                    <h2>Our Journey</h2>
                    <ul>
                        <li>
                            <span className="year">2019</span> - Started with our first event, bringing together industry leaders.
                        </li>
                        <li>
                            <span className="year">2020</span> - Expanded our speaker network and broadened our audience base.
                        </li>
                        <li>
                            <span className="year">2021</span> - Hosted international events and webinars, reaching global audiences.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Section Team */}
            <section className="about-team">
                <div className="container">
                    <h2>Our Team</h2>
                    <p>Meet the dedicated people behind the events:</p>
                    <div className="team-members">
                        <div className="member">
                            <img src="https://htmediagroup.vn/wp-content/uploads/2024/08/Anh-profile-nam-dep-3-min.jpg.webp" alt="team member" />
                            <h3>John Doe</h3>
                            <p>Event Manager</p>
                        </div>
                        <div className="member">
                            <img src="https://htmediagroup.vn/wp-content/uploads/2024/08/Anh-profile-nam-dep-3-min.jpg.webp" alt="team member" />
                            <h3>Jane Smith</h3>
                            <p>Marketing Lead</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
