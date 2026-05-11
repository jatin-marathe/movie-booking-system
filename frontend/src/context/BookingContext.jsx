import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingDetails, setBookingDetails] = useState(null); // {movie, theater, date, time}
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const initBooking = useCallback((movie, theater, date, time) => {
    setBookingDetails({ movie, theater, date, time });
    setSelectedSeats([]);
  }, []);

  const fetchBookedSeats = useCallback(async (movieId, theater, date, time) => {
    const { data } = await api.get('/bookings/booked-seats', { params: { movieId, theater, date, time } });
    setBookedSeats(data.bookedSeats);
    return data.bookedSeats;
  }, []);

  const toggleSeat = useCallback((seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  }, []);

  const confirmBooking = useCallback(async (totalPrice) => {
    const { movie, theater, date, time } = bookingDetails;
    const { data } = await api.post('/bookings/book-seat', {
      movieId: movie._id,
      theater,
      seats: selectedSeats,
      date,
      time,
      totalPrice,
    });
    setSelectedSeats([]);
    return data.booking;
  }, [bookingDetails, selectedSeats]);

  const fetchMyBookings = useCallback(async () => {
    const { data } = await api.get('/bookings/my-bookings');
    setMyBookings(data.bookings);
    return data.bookings;
  }, []);

  const clearBooking = useCallback(() => {
    setBookingDetails(null);
    setSelectedSeats([]);
    setBookedSeats([]);
  }, []);

  return (
    <BookingContext.Provider value={{
      bookingDetails, selectedSeats, bookedSeats, myBookings,
      initBooking, fetchBookedSeats, toggleSeat, confirmBooking,
      fetchMyBookings, clearBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
};
