import React from 'react';

export function Alert({ type, message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

  return (
    <div className={`${bgColor} p-4 rounded-lg mb-4 flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-xl">
        ×
      </button>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function PGCard({ pg, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer transform hover:scale-105 transition-transform"
    >
      {pg.thumbnail && (
        <img src={pg.thumbnail} alt={pg.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      )}
      <h3 className="text-lg font-bold mb-2">{pg.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{pg.address.city}</p>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-blue-600">
          ⭐ {pg.averageRating} ({pg.reviewCount} reviews)
        </span>
        <span className="text-sm text-gray-500">{pg.genderAllowed}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">₹{pg.minPrice}/night</span>
        {pg.isVerified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>}
      </div>
    </div>
  );
}

export function BookingCard({ booking, onAction }) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    CheckedIn: 'bg-green-100 text-green-800',
    CheckedOut: 'bg-gray-100 text-gray-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{booking.pg.name}</h3>
          <p className="text-sm text-gray-600">Booking #{booking.bookingId}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <p>
          <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{booking.finalPrice}
        </p>
      </div>
      {onAction && (
        <button onClick={() => onAction(booking._id)} className="btn-primary w-full">
          View Details
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
