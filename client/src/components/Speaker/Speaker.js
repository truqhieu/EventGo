import React from "react";
import { useState, useEffect } from "react";
import { fetchDataSpeaker } from "../../reducer/speakerReducer";
import { useDispatch, useSelector } from "react-redux";

const Speaker = () => {
  const dispatch = useDispatch();
  const { isLoading, error, dataSpeakerAll } = useSelector(
    (state) => state.speakerList
  );
  useEffect(() => {    
    dispatch(fetchDataSpeaker());
  }, [dispatch]);

  
  return (
    <div>
      <section className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>Feature Speakers</h2>
                <div className="bt-option">
                  <a href="#">Home</a>
                  <span>Our Speakers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Breadcrumb Section End */}
      {/* Speaker Section Begin */}
      <section className="speaker-section spad">
        <div className="container">
          <div className="row">
            {dataSpeakerAll?.map((el, index) => (
              <div className="col-sm-6">
                <div className="speaker-item">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="si-pic">
                        <img style={{height:'370px' , width:'383px' , objectFit:'cover'}} src={el?.photoUrl} alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="si-text">
                        <div className="si-title">
                          <h4>{el.name}</h4>
                          <span>Speaker</span>
                        </div>
                        <div className="si-social">
                          <a href={el?.socialLinks?.facebook}>
                            <i className="fa fa-facebook" />
                          </a>
                          <a href={el?.socialLinks?.twitter}>
                            <i className="fa fa-twitter" />
                          </a>
                          <a href={el?.socialLinks?.linkedin}>
                            <i className="fa fa-google-plus" />
                          </a>
                        </div>
                        <p>
                          {el?.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="load-more">
            <a href="#" className="primary-btn">
              Load More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Speaker;
