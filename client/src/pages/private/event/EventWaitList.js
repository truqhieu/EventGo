import React from 'react';
import { useSelector } from 'react-redux';
import { apiGetEventById } from '../../../apis/event/event';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

const EventWaitList = ({
    setIsEventList,
    setIsEventWaitlist,
    setIsEventWaitlistDetail,
    setEventRegistantData,
}) => {
    const { eventAll } = useSelector((state) => state.event);

    return (
        <div>
            <h3 className="mb-4">Event Waitlist</h3>
            <div className="card">
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
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
                                            <Button variant="warning" size="sm">
                                                View Waitlist
                                            </Button>
                                        </td>
                                    </tr>
                                )) || (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            No events with waitlists
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Button
                variant="secondary"
                className="mt-3"
                onClick={() => {
                    setIsEventWaitlist(false);
                    setIsEventList(true);
                }}
            >
                Back to Event List
            </Button>
        </div>
    );
};

export default EventWaitList;