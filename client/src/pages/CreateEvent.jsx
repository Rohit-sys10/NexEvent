import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { eventService } from '../services/eventService';
import { EventForm } from '../components/event/EventForm';
import { Card } from '../components/ui/Card';
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
    <div className="min-h-screen page-fade-in">
      <Navbar />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
          <p className="text-sm text-gray-600">Build an event page that looks professional and converts attendees.</p>
        </div>

        <Card className="p-6">
          <EventForm onSubmit={handleSubmit} loading={loading} />
        </Card>
      </main>
    </div>
  );
};
