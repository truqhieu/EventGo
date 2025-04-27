import React, { useState } from 'react';
import { apiOpenSpots, apiEventRegistantDetail } from '../../../apis/event/event';
import { toast } from 'react-toastify';

const EventWaitlistDetail = ({
    eventRegistantData,
    setEventRegistantData,
    setIsEventWaitlistDetail,
    setIsEventWaitlist,
    setIsEventDetail,
    setModalFilterDetailEvent,
}) => {
    const [extraSlots, setExtraSlots] = useState('');

    const handleOpenSlots = async () => {
        if (!extraSlots || extraSlots <= 0) {
            toast.error('Please enter a valid number of extra slots');
            return;
        }

        try {
            const response = await apiOpenSpots(eventRegistantData._id, extraSlots);
            if (response?.success) {
                const res = await apiEventRegistantDetail(eventRegistantData._id);
                if (res?.success) {
                    setEventRegistantData(res.mess);
                    setIsEventWaitlistDetail(false);
                    setIsEventDetail(true);
                    setModalFilterDetailEvent(true);
                    setExtraSlots('');
                    toast.success(`Added ${extraSlots} slots`);
                } else {
                    toast.error('Failed to refresh event data');
                }
            } else {
                toast.error('Failed to open slots');
            }
        } catch (error) {
            console.error('Error opening slots:', error);
            toast.error('Failed to open slots');
        }
    };

    return (
        <div>
            <h3>
                Waitlist for “{eventRegistantData?.title}”
                <small className="text-muted">
                    ({eventRegistantData?.attendees?.length || 0}/
                    {eventRegistantData?.capacity || 0})
                </small>
            </h3>
            <h5 className="mt-4">
                Users on Waitlist ({eventRegistantData?.waitlist?.length || 0})
            </h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {eventRegistantData?.waitlist?.map((user, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{user._id}</td>
                            <td>{user.name || 'N/A'}</td>
                            <td>{user.email || 'N/A'}</td>
                        </tr>
                    )) || (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No users on waitlist
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
            <div className="d-flex align-items-center mt-2">
                <input
                    type="number"
                    className="form-control w-auto me-2"
                    placeholder="Extra slots"
                    value={extraSlots}
                    onChange={(e) => setExtraSlots(e.target.value)}
                    min="1"
                />
                <button className="btn btn-success" onClick={handleOpenSlots}>
                    Open Slots
                </button>
            </div>
            <button
                className="btn btn-secondary mt-3"
                onClick={() => {
                    setIsEventWaitlistDetail(false);
                    setIsEventWaitlist(true);
                }}
            >
                Back to Waitlist
            </button>
        </div>
    );
};

export default EventWaitlistDetail;