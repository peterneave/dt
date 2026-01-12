import { useEffect, useState } from 'react';
import type { Departure } from '../types';
import DepartureRow from './DepartureRow';
import './DepartureBoard.css';

const DepartureBoard: React.FC = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        const response = await fetch('/departures.json');
        if (!response.ok) {
          throw new Error('Failed to load departures');
        }
        const data = await response.json();
        setDepartures(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchDepartures();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="loading">Loading departures...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="departure-board-container">
      <div className="board-header">
        <h1 className="board-title">DEPARTURES</h1>
        <div className="current-time">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </div>
      </div>
      <div className="board-labels">
        <div className="label-destination">DESTINATION</div>
        <div className="label-countdown">COUNTDOWN</div>
        <div className="label-status">STATUS</div>
      </div>
      <div className="departure-list">
        {departures.map((departure) => (
          <DepartureRow key={departure.id} departure={departure} />
        ))}
      </div>
    </div>
  );
};

export default DepartureBoard;
