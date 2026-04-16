import { useState } from 'react';
import { Building2, CalendarDays, FileText, Globe, Info, MapPin, MonitorSmartphone, Sparkles, UploadCloud } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEventForm } from '../../hooks/useEventForm';

export const EventForm = ({ onSubmit, loading = false, initialData = null, submitLabel = 'Create Event' }) => {
  const {
    formData,
    errors,
    onChange,
    validate,
    setPreviewUrl,
    imagePreview,
    payload,
  } = useEventForm(initialData);
  const [locationType, setLocationType] = useState('physical');

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || '');
      setPreviewUrl(data);
      onChange('imageUrl', data);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <p className="text-sm text-gray-500">Define the title, category, and capacity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Input
              label="Event Title"
              value={formData.title}
              onChange={(event) => onChange('title', event.target.value)}
              error={errors.title}
              placeholder="Product Launch Summit"
            />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">Category</span>
            <select
              value={formData.category}
              onChange={(event) => onChange('category', event.target.value)}
              className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="networking">Networking</option>
              <option value="other">Other</option>
            </select>
          </label>

          <Input
            type="number"
            label="Max Capacity"
            value={formData.maxCapacity}
            onChange={(event) => onChange('maxCapacity', event.target.value)}
            error={errors.maxCapacity}
            placeholder="Optional"
          />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
            <p className="text-sm text-gray-500">Set the event time and registration deadline.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            type="datetime-local"
            label="Date & Time"
            value={formData.date}
            onChange={(event) => onChange('date', event.target.value)}
            error={errors.date}
          />
          <Input
            type="datetime-local"
            label="Registration Deadline"
            value={formData.registrationDeadline}
            onChange={(event) => onChange('registrationDeadline', event.target.value)}
            error={errors.registrationDeadline}
          />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            <p className="text-sm text-gray-500">Describe the experience and define the venue type.</p>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea
              value={formData.description}
              onChange={(event) => onChange('description', event.target.value)}
              rows={5}
              className={`w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-400' : ''}`}
              placeholder="Describe what attendees should expect from this event."
            />
            {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : null}
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Location Type</span>
            <div className="flex gap-3">
              {[
                { key: 'physical', label: 'Physical', icon: Building2 },
                { key: 'virtual', label: 'Virtual', icon: MonitorSmartphone },
                { key: 'hybrid', label: 'Hybrid', icon: Globe },
              ].map(({ key, label, icon: Icon }) => {
                const selected = locationType === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLocationType(key)}
                    className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-200 ${selected ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(event) => onChange('location', event.target.value)}
            error={errors.location}
            placeholder="Bangalore, India"
          />
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Media</h2>
            <p className="text-sm text-gray-500">Add the visual identity for the event card.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={(event) => onChange('imageUrl', event.target.value)}
            placeholder="https://example.com/event-cover.jpg"
          />

          <label className="group block cursor-pointer space-y-2">
            <span className="text-sm font-medium text-gray-700">Or Upload Image</span>
            <div className="flex h-12 items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
              <span className="text-sm text-gray-500">Drop or choose a file</span>
              <UploadCloud className="h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-blue-600" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>

        {imagePreview ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img src={imagePreview} alt="Event preview" className="h-56 w-full object-cover" />
          </div>
        ) : null}
      </section>

      <div className="flex justify-center pt-2">
        <Button type="submit" loading={loading} className="w-full max-w-sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
