import React, { useState } from 'react';
import { apiUpdateStatusEventRegistant } from "../../../apis/event/event";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";
import { Modal, Button } from 'react-bootstrap';

const EventDetail = ({
    eventRegistantData,
    setEventRegistantData,
    setIsEventDetail,
    setModalFilterDetailEvent,
}) => {
    const [userStatusFilterDetail, setUserStatusFilterDetail] = useState('all');
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState({ confirmed: false, cancelled: false });

    const listDataFilterDetail = Array.isArray(eventRegistantData?.attendees)
        ? [...eventRegistantData?.attendees]
        : [];

    const afterFilterDetail = listDataFilterDetail?.filter(
        (item) =>
            userStatusFilterDetail === 'all' ||
            item?.statusRegisEvent[0]?.status === userStatusFilterDetail
    );

    const handleUpdateStatusEventRegistant = async (status) => {
        setLoading((prev) => ({ ...prev, [status]: true }));
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await apiUpdateStatusEventRegistant(
                selectedAttendee?.id,
                status,
                selectedAttendee?.statusRegisEvent[0]?.idEvent
            );
            if (response?.success) {
                setSelectedAttendee((prev) => ({
                    ...prev,
                    statusRegisEvent: prev.statusRegisEvent.map((s) => ({
                        ...s,
                        status,
                    })),
                }));
                setEventRegistantData((prev) => ({
                    ...prev,
                    attendees: prev.attendees.map((attendee) =>
                        attendee.id === selectedAttendee.id
                            ? {
                                ...attendee,
                                statusRegisEvent: attendee.statusRegisEvent.map((s) => ({
                                    ...s,
                                    status,
                                })),
                            }
                            : attendee
                    ),
                }));
                toast.success(`${status} event status successfully!`);
                setIsModalOpen(false);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setLoading((prev) => ({ ...prev, [status]: false }));
        }
    };

    return (
        <div>
            <h3 className="mb-4">Event Detail</h3>
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <select
                    className="form-select w-auto"
                    value={userStatusFilterDetail}
                    onChange={(e) => setUserStatusFilterDetail(e.target.value)}
                >
                    <option value="all">All User Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                </select>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setIsEventDetail(false);
                        setModalFilterDetailEvent(false);
                    }}
                >
                    Back to Event List
                </Button>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <table className="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Capacity</th>
                                <th>Event Status</th>
                                <th>User Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {afterFilterDetail?.length > 0 ? (
                                afterFilterDetail?.map((attendee, index) => (
                                    <tr key={index}>
                                        <td>{attendee.name || 'N/A'}</td>
                                        <td>{attendee.email || 'N/A'}</td>
                                        <td>{eventRegistantData?.title || 'N/A'}</td>
                                        <td>{eventRegistantData?.date || 'N/A'}</td>
                                        <td>{eventRegistantData?.capacity || 'N/A'}</td>
                                        <td>
                                            <span
                                                className={`badge bg-${eventRegistantData?.eventstatus === 'Upcoming'
                                                        ? 'warning'
                                                        : eventRegistantData?.eventstatus === 'Ongoing'
                                                            ? 'primary'
                                                            : eventRegistantData?.eventstatus === 'Completed'
                                                                ? 'success'
                                                                : 'danger'
                                                    }`}
                                            >
                                                {eventRegistantData?.eventstatus || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge bg-${attendee.statusRegisEvent?.[0]?.status === 'pending'
                                                        ? 'secondary'
                                                        : attendee.statusRegisEvent?.[0]?.status === 'confirmed'
                                                            ? 'success'
                                                            : 'danger'
                                                    }`}
                                            >
                                                {attendee.statusRegisEvent?.[0]?.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedAttendee(attendee);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Set
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No User Register
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p><strong>Name:</strong> {selectedAttendee?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedAttendee?.email || 'N/A'}</p>
                    </div>
                    <div className="form-group mt-3">
                        <label>Select New Status:</label>
                        {selectedAttendee?.statusRegisEvent?.[0]?.status === 'pending' ? (
                            <div className="d-flex gap-2 mt-2">
                                <Button
                                    variant="success"
                                    disabled={loading.confirmed}
                                    onClick={() => handleUpdateStatusEventRegistant('confirmed')}
                                >
                                    {loading.confirmed ? (
                                        <Audio
                                            height="20"
                                            width="20"
                                            radius="4"
                                            color="white"
                                            ariaLabel="loading"
                                            wrapperStyle={{ display: 'inline-block', marginRight: '5px' }}
                                        />
                                    ) : null}
                                    {loading.confirmed ? 'Processing...' : 'Confirmed'}
                                </Button>
                                <Button
                                    variant="danger"
                                    disabled={loading.cancelled}
                                    onClick={() => handleUpdateStatusEventRegistant('cancelled')}
                                >
                                    {loading.cancelled ? (
                                        <Audio
                                            height="20"
                                            width="20"
                                            radius="4"
                                            color="white"
                                            ariaLabel="loading"
                                            wrapperStyle={{ display: 'inline-block', marginRight: '5px' }}
                                        />
                                    ) : null}
                                    {loading.cancelled ? 'Processing...' : 'Cancelled'}
                                </Button>
                            </div>
                        ) : selectedAttendee?.statusRegisEvent?.[0]?.status === 'cancelled' ? (
                            <p className="text-danger mt-2">User has been cancelled</p>
                        ) : selectedAttendee?.statusRegisEvent?.[0]?.status === 'confirmed' ? (
                            <p className="text-danger mt-2">User has been confirmed</p>
                        ) : null}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EventDetail;