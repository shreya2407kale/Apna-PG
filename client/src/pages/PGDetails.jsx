import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pgService, bookingService, reviewService } from '../services';
import { Alert, LoadingSpinner, EmptyState } from '../components/Common';
import { useAuth } from '../hooks';

export default function PGDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [pg, setPG] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgRes, roomsRes, reviewsRes] = await Promise.all([
          pgService.getPGById(id),
          pgService.getPGRooms(id),
          reviewService.getPGReviews(id),
        ]);

        setPG(pgRes.data.pg);
        setRooms(roomsRes.data.rooms || []);
        setReviews(reviewsRes.data.reviews || []);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load PG details',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedRoom || !bookingDates.checkInDate || !bookingDates.checkOutDate) {
      setAlert({ type: 'error', message: 'Please select a room and dates' });
      return;
    }

    try {
      await bookingService.createBooking({
        roomId: selectedRoom._id,
        checkInDate: bookingDates.checkInDate,
        checkOutDate: bookingDates.checkOutDate,
        bookingType: 'Daily',
      });

      setAlert({ type: 'success', message: 'Booking created! Awaiting owner approval.' });
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Booking failed',
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!pg) {
    return <EmptyState icon="❌" title="PG Not Found" description="The PG you're looking for doesn't exist" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* PG Header */}
      <div className="card mb-8">
        {pg.thumbnail && (
          <img
            src={pg.thumbnail}
            alt={pg.name}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{pg.name}</h1>
            <p className="text-gray-600">
              {pg.address.street}, {pg.address.city}, {pg.address.state}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ⭐ {pg.averageRating.toFixed(1)} / 5
            </div>
            <p className="text-gray-600">({pg.reviewCount} reviews)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 py-4 border-t border-b">
          <div>
            <span className="text-gray-600 text-sm">Gender Policy</span>
            <p className="font-bold">{pg.genderAllowed}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Verification</span>
            <p className="font-bold">{pg.isVerified ? '✅ Verified' : '⏳ Pending'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Daily Stay</span>
            <p className="font-bold">{pg.allowsDailyStay ? '✅ Available' : '❌ Not Available'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Owner</span>
            <p className="font-bold">{pg.owner?.fullName}</p>
          </div>
        </div>

        <p className="mt-4 text-gray-700">{pg.description}</p>
      </div>

      {/* Amenities */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Amenities</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(pg.amenities || {}).map(([key, value]) => (
            <div key={key} className="flex items-center">
              {value ? '✅' : '❌'} {key}
            </div>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
        {rooms.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedRoom(room)}
              >
                <h3 className="font-bold">{room.roomType} - Room {room.roomNumber}</h3>
                <p className="text-gray-600 mb-2">
                  {room.bedCount} bed(s) • {room.availability.vacantBeds} vacant
                </p>
                <p className="text-lg font-bold text-blue-600 mb-2">₹{room.dailyPrice}/night</p>
                {selectedRoom?._id === room._id && (
                  <span className="text-green-600 font-bold">✓ Selected</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No rooms available</p>
        )}
      </div>

      {/* Booking Section */}
      {selectedRoom && (
        <div className="card mb-8 bg-blue-50 border-2 border-blue-400">
          <h2 className="text-2xl font-bold mb-4">Book This Room</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Check-in Date</label>
              <input
                type="date"
                value={bookingDates.checkInDate}
                onChange={(e) =>
                  setBookingDates({ ...bookingDates, checkInDate: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Check-out Date</label>
              <input
                type="date"
                value={bookingDates.checkOutDate}
                onChange={(e) =>
                  setBookingDates({ ...bookingDates, checkOutDate: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleBooking} className="btn-primary w-full">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">{review.user.fullName}</p>
                    <p className="text-gray-600 text-sm">⭐ {review.overallRating}/5</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <h4 className="font-semibold mb-1">{review.title}</h4>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="📝" title="No Reviews Yet" description="Be the first to review this PG" />
        )}
      </div>
    </div>
  );
}
