import { useEffect, useState } from 'react';
import { Bell, CalendarPlus, CheckCheck, Trash2, UserCheck } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

const TYPE_ICON = {
  NEW_EVENT: CalendarPlus,
  NEW_REGISTRATION: UserCheck,
  UNREGISTER: UserCheck,
  EVENT_UPDATED: CalendarPlus,
  event_created: CalendarPlus,
  event_updated: CalendarPlus,
  registration_confirmed: UserCheck,
  new_registration: UserCheck,
};

export const NotificationDropdown = ({ unreadCount }) => {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotification();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 transition-all duration-200 ease-in-out hover:bg-gray-100"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <Button variant="secondary" className="h-8 px-3 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={Bell}
                  title="No notifications"
                  description="You are all caught up for now."
                />
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = TYPE_ICON[notification.type] || Bell;
                const isRead = notification.read ?? notification.isRead;
                return (
                  <div
                    key={notification._id}
                    className={`flex gap-3 border-b border-gray-100 px-4 py-3 transition-all duration-200 ease-in-out hover:bg-gray-50 ${
                      isRead ? '' : 'bg-blue-50/70'
                    }`}
                  >
                    <div className="mt-0.5 rounded-full bg-gray-100 p-2 text-gray-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() => !isRead && markAsRead(notification._id)}
                    >
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      className="self-start rounded p-1 text-gray-400 transition-all duration-200 ease-in-out hover:bg-red-50 hover:text-red-600"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="border-t border-gray-100 p-2">
              <Button variant="secondary" className="h-9 w-full text-xs" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
