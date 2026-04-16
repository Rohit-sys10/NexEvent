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
      <Input
        label="Event Title"
        value={formData.title}
        onChange={(event) => onChange('title', event.target.value)}
        error={errors.title}
        placeholder="Product Launch Summit"
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          value={formData.description}
          onChange={(event) => onChange('description', event.target.value)}
          rows={5}
          className={`w-full rounded-2xl border px-3 py-2 text-sm outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
          placeholder="Describe what attendees should expect from this event."
        />
        {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : null}
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Location"
          value={formData.location}
          onChange={(event) => onChange('location', event.target.value)}
          error={errors.location}
          placeholder="Bangalore, India"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">Category</span>
          <select
            value={formData.category}
            onChange={(event) => onChange('category', event.target.value)}
            className="h-11 w-full rounded-2xl border border-gray-200 px-3 text-sm outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500"
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Image URL"
          value={formData.imageUrl}
          onChange={(event) => onChange('imageUrl', event.target.value)}
          placeholder="https://example.com/event-cover.jpg"
        />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-gray-700">Or Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="h-11 w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-600 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-blue-700"
          />
        </label>
      </div>

      {imagePreview ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <img src={imagePreview} alt="Event preview" className="h-48 w-full object-cover" />
        </div>
      ) : null}

      <Button type="submit" fullWidth loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
};
