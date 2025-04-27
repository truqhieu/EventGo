import axios from "../../axios";

export const apiGetEventById = (eid) =>
  axios({
    url: `/event/${eid}`,
    method: "get",
  });

export const apiGetEventByCategoryName = (name) =>
  axios({
    url: `/event/category?category=${name}`,
    method: "get",
  });

export const apiGetAllEvent = () =>
  axios({
    url: `/event`,
    method: "get",
  });

/**
 * Sends a POST request to create a new event.
 *
 * @param {Object} item - The event data to be created, which includes properties such as title, description, date, location, and capacity.
 * @returns {Promise} - A promise that resolves with the response of the request.
 */

export const apiJoinWaitlist = (eventId, userId) =>
  axios.post("/event/waitlist", { eventId, userId });

export const apiRegisterOrWaitlist = (eventId, userId) =>
  axios({
    url: "/event/registerOrWaitlist",
    method: "post",
    data: { eventId, userId },
  });

export const apiOpenSpots = (eventId, extra) =>
  axios.post("/event/open-spots", { eventId, extra });

export const apiCreateEvent = (item) =>
  axios({
    url: "/event",
    method: "post",
    data: item,
  });

export const apiUpdateEvent = (item) =>
  axios({
    url: "/event/updevent",
    method: "put",
    data: item,
  });

export const apiDeleteEvent = (eid) =>
  axios({
    url: `/event/${eid}`,
    method: "delete",
  });

export const apiEventRegistation = (eventId) =>
  axios({
    url: "/user/regisevent",
    method: "post",
    data: { eventId },
  });

export const apiEventRegistantDetail = (eventId) =>
  axios({
    url: "/event/registerevent",
    method: "post",
    data: { eventId },
  });

export const apiUpdateStatusEventRegistant = (uid, statusEvent, eid) =>
  axios({
    url: "/event/updstatuseventregistant",
    method: "post",
    data: { uid, statusEvent, eid },
  });

export const apiGetHotEventTop1 = () =>
  axios({
    url: "/event/getHotestEvent",
    method: "get",
  });

export const apiFeedbackComment = (eventId, comment) =>
  axios({
    url: "/event/feedbackuser",
    method: "post",
    data: { eventId, comment },
  });

export const apiReplyFeedbackComment = (eventId, feedbackId, replyComment) =>
  axios({
    url: "/event/replyfeedbackuser",
    method: "post",
    data: { eventId, feedbackId, replyComment },
  });

export const apiUpdateFeedback = (eventId, feedbackId, feedbackComment) =>
  axios({
    url: "/event/updatefeedbackuser",
    method: "post",
    data: eventId,
    feedbackId,
    feedbackComment,
  });

export const apiDeleteFeedback = (eventId, feedbackId) =>
  axios({
    url: "/event/deletefeedbackuser",
    method: "post",
    data: eventId,
    feedbackId,
  });
