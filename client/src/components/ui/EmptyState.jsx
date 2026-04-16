import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title,
  description,
  action,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};
