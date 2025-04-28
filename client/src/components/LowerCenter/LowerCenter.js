import React from "react";
import "./LowerCenter.css";

const LowerCenter = () => {
  const backgroundImageLastNews = {
    backgroundImage:
      'url("https://codetheweb.blog/assets/img/posts/css-advanced-background-images/cover.jpg    ")',
    backgroundSize: "cover", // Optional: to ensure the image covers the entire section
    backgroundPosition: "center", // Optional: to center the image
  };

  return (
    <div>
      <section className="latest-blog spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Latest News</h2>
                <p>Do not miss anything topic abput the event</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div
                className="latest-item set-bg large-item"
                data-setbg="https://www.imageproprint.com/graphics/powerful-bc-ir-designs-card.jpg"
              >
                <div className="li-tag">Marketing</div>
                <div className="li-text">
                  <h4>
                    <a
                      href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE0nU-ttm_1wZ8nfETX7pBcMl8aV0tKkIGNQ&s"
                      style={{ color: "black" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Improve Your Business Cards And Enhance Your Sales
                    </a>
                  </h4>
                  <span>
                    <i className="fa fa-clock-o" /> 19th May, 2019
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="latest-item set-bg"
                data-setbg="https://www.imageproprint.com/graphics/powerful-bc-ir-designs-card.jpg"
              >
                <div className="li-tag">Experience</div>
                <div className="li-text">
                  <h5>
                    <a href="./blog-details.html">
                      All users on MySpace will know that there are millions of
                      people out there.
                    </a>
                  </h5>
                  <span>
                    <i className="fa fa-clock-o" /> 19th May, 2019
                  </span>
                </div>
              </div>
              <div
                className="latest-item set-bg"
                data-setbg="img/blog/latest-b/latest-3.jpg"
              >
                <div className="li-tag">Marketing</div>
                <div className="li-text">
                  <h5>
                    <a href="./blog-details.html">
                      A Pocket PC is a handheld computer, which features many of
                      the same capabilities.
                    </a>
                  </h5>
                  <span>
                    <i className="fa fa-clock-o" /> 19th May, 2019
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newslatter-section">
        <div className="container">
          <div
            className="newslatter-inner set-bg"
            style={backgroundImageLastNews}
          >
            <div className="ni-text">
              <h3>Subscribe Newsletter</h3>
              <p>Subscribe to our newsletter and don’t miss anything</p>
            </div>
            <form action="#" className="ni-form">
              <input type="text" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LowerCenter;
