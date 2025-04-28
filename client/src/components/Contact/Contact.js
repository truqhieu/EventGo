import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
    return (
        <div>
            {/* Banner hoặc Header */}
            <section className="contact-banner">
                <div className="container">
                    <h1>Liên Hệ Với Chúng Tôi</h1>
                    <p>Chúng tôi rất mong nhận được phản hồi từ bạn!</p>
                </div>
            </section>

            {/* Section Thông tin liên hệ */}
            <section className="contact-info">
                <div className="container">
                    <h2>Thông Tin Liên Hệ</h2>
                    <p>Email: info@sukien.com</p>
                    <p>Điện thoại: +84 123 456 789</p>
                    <p>Địa chỉ: 123 Đường Sự Kiện, Quận 1, TP. Hồ Chí Minh</p>
                </div>
            </section>


        </div>
    );
};

export default Contact;