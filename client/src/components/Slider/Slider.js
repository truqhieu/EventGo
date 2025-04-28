import React from 'react';

const Slider = () => {
  const backgroundImage = {
    backgroundImage: 'url("https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png")',
    backgroundSize: 'cover',  // Optional: to ensure the image covers the entire section
    backgroundPosition: 'center',  // Optional: to center the image
  };

  return (
    <div>
      <section className="hero-section set-bg" style={backgroundImage}>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="hero-text">
                <span>5 to 9 May 2019, Mardavall Hotel, New York</span>
                <h2>
                  Improve Yourself
                  <br /> To Become Success  
                </h2>
                <a href="#" className="primary-btn">
                  Register
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section class="counter-section bg-gradient">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <div class="counter-text">
                        <span>Conference Date</span>
                        <h3>Count Every Second <br />Until the Event</h3>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="cd-timer" id="countdown">
                        <div class="cd-item">
                            <span>40</span>
                            <p>Days</p>
                        </div>
                        <div class="cd-item">
                            <span>18</span>
                            <p>Hours</p>
                        </div>
                        <div class="cd-item">
                            <span>46</span>
                            <p>Minutes</p>
                        </div>
                        <div class="cd-item">
                            <span>32</span>
                            <p>Seconds</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>    
    </div>
  );
};

export default Slider;
