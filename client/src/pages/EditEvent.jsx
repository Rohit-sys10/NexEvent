import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { EventForm } from '../components/event/EventForm';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { eventService } from '../services/eventService';
import { useToast } from '../hooks/useToast';

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ''));

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !isValidObjectId(id)) {
        setEvent(null);
        setError('Invalid event id.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await eventService.getById(id);
        setEvent(response?.event || null);

        if (!response?.event) {
          setError('Event not found.');
        }
      } catch (error) {
        setEvent(null);
        setError(error.message || 'Failed to load event.');
        showToast(error.message || 'Failed to load event.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, showToast]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      await eventService.update(id, payload);
      showToast('Event updated successfully.', 'success');
      navigate(`/events/${id}`);
    } catch (error) {
      showToast(error.message || 'Failed to update event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen page-fade-in">
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-600">Manage details without affecting existing registrations.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <EmptyState
            title="Unable to load event"
            description={error}
            action={
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to dashboard
              </Button>
            }
          />
        ) : (
          <Card className="p-6">
            <EventForm
              onSubmit={handleSubmit}
              loading={saving}
              initialData={event}
              submitLabel="Save Changes"
            />
          </Card>
        )}
      </main>
    </div>
  );
};
