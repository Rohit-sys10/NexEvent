import { useMemo, useState } from 'react';

const INITIAL_FORM = {
  title: '',
  description: '',
  date: '',
  registrationDeadline: '',
  location: '',
  category: 'other',
  maxCapacity: '',
  imageUrl: '',
};

const toInputDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const tzDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return tzDate.toISOString().slice(0, 16);
};

const validateForm = (formData) => {
  const errors = {};

  if (!formData.title.trim()) errors.title = 'Title is required.';
  if (!formData.description.trim()) errors.description = 'Description is required.';
  if (!formData.date) errors.date = 'Date and time is required.';
  if (!formData.registrationDeadline) {
    errors.registrationDeadline = 'Registration deadline is required.';
  }
  if (formData.registrationDeadline && formData.date) {
    const deadline = new Date(formData.registrationDeadline).getTime();
    const eventTime = new Date(formData.date).getTime();
    if (deadline > eventTime) {
      errors.registrationDeadline = 'Deadline must be before event date/time.';
    }
  }
  if (!formData.location.trim()) errors.location = 'Location is required.';
  if (formData.maxCapacity && Number(formData.maxCapacity) < 1) {
    errors.maxCapacity = 'Capacity must be at least 1.';
  }

  return errors;
};

export const useEventForm = (initialData = null) => {
  const seededData = useMemo(() => {
    if (!initialData) return INITIAL_FORM;
    return {
      title: initialData.title || '',
      description: initialData.description || '',
      date: toInputDateTime(initialData.dateTime || initialData.date),
      registrationDeadline: toInputDateTime(
        initialData.registrationDeadline || initialData.dateTime || initialData.date
      ),
      location: initialData.location || '',
      category: initialData.category || 'other',
      maxCapacity: initialData.maxCapacity || '',
      imageUrl: initialData.imageUrl || initialData.image || '',
    };
  }, [initialData]);

  const [formData, setFormData] = useState(seededData);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');

  const imagePreview = useMemo(() => previewUrl || formData.imageUrl, [previewUrl, formData.imageUrl]);

  const onChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const payload = {
    ...formData,
    dateTime: formData.date,
    maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : null,
  };

  return {
    formData,
    errors,
    onChange,
    validate,
    previewUrl,
    setPreviewUrl,
    imagePreview,
    payload,
  };
};
