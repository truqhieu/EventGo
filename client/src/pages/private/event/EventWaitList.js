
import React from 'react';
import { useSelector } from 'react-redux';
import { apiGetEventById } from '../../../apis/event/event';
import { toast } from 'react-toastify';

const EventWaitList = ({
    setIsEventList,
    setIsEventWaitlist,
    setIsEventWaitlistDetail,
    setEventRegistantData,
}) => {
    const { eventAll } = useSelector((state) => state.event);

    return (
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
                    {eventAll?.mess
                        ?.filter((ev) => (ev.attendees?.length || 0) >= ev.capacity)
                        ?.map((ev) => (
                            <tr
                                key={ev._id}
                                style={{ cursor: 'pointer' }}
                                onClick={async () => {
                                    try {
                                        const res = await apiGetEventById(ev._id);
                                        if (res?.success) {
                                            setEventRegistantData(res.mess);
                                            setIsEventWaitlistDetail(true);
                                            setIsEventWaitlist(false);
                                        } else {
                                            toast.error('Failed to load event waitlist');
                                        }
                                    } catch (error) {
                                        console.error('Error fetching event:', error);
                                        toast.error('Failed to load event waitlist');
                                    }
                                }}
                            >
                                <td>{ev.title}</td>
                                <td>
                                    {ev.attendees?.length || 0}/{ev.capacity}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-warning">View Waitlist</button>
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
    );
};

export default EventWaitList;