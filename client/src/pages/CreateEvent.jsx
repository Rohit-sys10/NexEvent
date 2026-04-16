import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { eventService } from '../services/eventService';
import { EventForm } from '../components/event/EventForm';
import { useToast } from '../hooks/useToast';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);

    try {
      await eventService.create(payload);
      showToast('Event created successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Failed to create event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-8 md:px-10 lg:px-16 lg:py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Event</h1>
          <p className="max-w-2xl text-sm text-gray-500">Build an event page that looks professional and converts attendees.</p>
        </div>

        <div className="max-w-5xl">
          <EventForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
};
