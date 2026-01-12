import { useEffect, useState } from 'react';
import type { Departure } from '../types';
import './DepartureRow.css';

interface DepartureRowProps {
  departure: Departure;
}

const DepartureRow: React.FC<DepartureRowProps> = ({ departure }) => {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const calculateDaysUntil = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const departureDate = new Date(departure.date);
      departureDate.setHours(0, 0, 0, 0);

      const diffTime = departureDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysUntil(diffDays);

      if (diffDays < 0) {
        setStatus('DEPARTED');
      } else if (diffDays === 0) {
        setStatus('DEPARTED');
      } else if (diffDays === 1) {
        setStatus('TOMORROW');
      } else {
        setStatus('ON TIME');
      }
    };

    calculateDaysUntil();
    const interval = setInterval(calculateDaysUntil, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [departure.date]);

  const getStatusClass = () => {
    if (status === 'DEPARTED') return 'status-departed';
    if (status === 'TOMORROW') return 'status-tomorrow';
    return 'status-ontime';
  };

  return (
    <div className="departure-row">
      <div className="departure-info">
        <div className="description">{departure.description}</div>
        <div className="date">{new Date(departure.date).toLocaleDateString()}</div>
      </div>
      <div className="countdown">
        {daysUntil !== null && daysUntil > 0 && (
          <div className="days-count">{daysUntil} {daysUntil === 1 ? 'DAY' : 'DAYS'}</div>
        )}
      </div>
      <div className={`status ${getStatusClass()}`}>
        {status}
      </div>
    </div>
  );
};

export default DepartureRow;
