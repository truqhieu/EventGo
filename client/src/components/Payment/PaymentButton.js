import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentButton = ({ event }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!event || !event._id) {
      alert('Thông tin sự kiện không hợp lệ');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Bạn cần đăng nhập để thực hiện chức năng này');
      return;
    }

    setLoading(true);
    try {
      if (event.isPaid) {
        // Tạo yêu cầu thanh toán
        const response = await axios.post(
          '/api/payment/create',
          { eventId: event._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const paymentUrl = response.data.paymentUrl;
        if (paymentUrl) {
          // Chuyển hướng tới trang thanh toán (mở cùng tab)
          window.location.href = paymentUrl;
        } else {
          alert('Không lấy được đường dẫn thanh toán. Vui lòng thử lại.');
        }
      } else {
        // Đăng ký sự kiện miễn phí
        await axios.post(
          '/api/user/registerevent',
          { eventId: event._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Đăng ký sự kiện thành công!');
        navigate('/registration-success');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleRegister} disabled={loading}>
      {loading ? 'Đang xử lý...' : event.isPaid ? 'Thanh toán ngay' : 'Đăng ký miễn phí'}
    </button>
  );
};

export default PaymentButton;
