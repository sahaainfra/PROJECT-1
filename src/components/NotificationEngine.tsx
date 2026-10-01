import { useState } from 'react';
import {
  notificationTemplates,
  notificationCategories,
  notifications,
  userPreferences,
  deliveryLogs,
  socketRooms,
  eventCatalogue,
  presenceData,
  protocolControlPoints,
  notificationStats
} from '../data/notificationData';

export function NotificationEngine() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'centre', label: 'Notification Centre', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'rooms', label: 'Socket Rooms', icon: '🌐' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Real-Time Notification & Collaboration</h1>
          <p className="text-sm text-slate-500 mt-1">Part 18 — Notification engine with Socket.IO, templates, and multi-channel delivery</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">
            ff.rt
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'centre' && <NotificationCentreTab />}
      {activeTab === 'preferences' && <PreferencesTab />}
      {activeTab === 'templates' && <TemplatesTab />}
      {activeTab === 'rooms' && <SocketRoomsTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Notifications"
          value={notificationStats.totalNotifications}
          subtitle={`${notificationStats.unreadNotifications} unread`}
          icon="🔔"
          color="pink"
        />
        <StatCard
          title="Active Connections"
          value={notificationStats.totalActiveConnections}
          subtitle={`${notificationStats.totalRooms} rooms`}
          icon="🌐"
          color="blue"
        />
        <StatCard
          title="Delivery Success"
          value={`${notificationStats.deliverySuccessRate}%`}
          subtitle="Last 24 hours"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Critical Alerts"
          value={notificationStats.criticalNotifications}
          subtitle="Require attention"
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.slice(0, 5).map(notif => (
            <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
              notif.priority === 'critical' ? 'bg-red-50 border-red-200' :
              notif.priority === 'high' ? 'bg-orange-50 border-orange-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notif.priority === 'critical' ? 'bg-red-500' :
                notif.priority === 'high' ? 'bg-orange-500' :
                notif.priority === 'normal' ? 'bg-blue-500' :
                'bg-slate-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{notif.title}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    notif.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    notif.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {notif.priority}
                  </span>
                  {!notif.readAt && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{notif.body}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Control Points</h3>
        <div className="space-y-3">
          {protocolControlPoints.map(cp => (
            <div key={cp.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-2xl">🛡️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-900">{cp.id}</span>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded">
                    {cp.stage}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                    {cp.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{cp.control}</p>
                <p className="text-xs text-slate-500 mt-1">Enforcement: {cp.enforcement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Presence */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Presence</h3>
        <div className="space-y-3">
          {presenceData.map((presence, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">
                  {presence.entityType}: {presence.entityId}
                </span>
                <span className="text-xs text-slate-500">
                  {presence.users.length} viewer{presence.users.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {presence.users.map(user => (
                  <div key={user.userId} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${user.isEditing ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <span className="text-xs text-slate-700">{user.userName}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationCentreTab() {
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    const matchesRead = filter === 'all' ? true : 
                       filter === 'unread' ? !n.readAt : 
                       !!n.readAt;
    const matchesPriority = priorityFilter === 'all' ? true : n.priority === priorityFilter;
    return matchesRead && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mr-2">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mr-2">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="px-4 py-1.5 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
              Mark All Read
            </button>
            <button className="px-4 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300">
              Archive Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Notifications ({filteredNotifications.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredNotifications.map(notif => (
            <div key={notif.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notif.priority === 'critical' ? 'bg-red-500' :
                  notif.priority === 'high' ? 'bg-orange-500' :
                  notif.priority === 'normal' ? 'bg-blue-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      notif.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      notif.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      notif.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {notif.priority}
                    </span>
                    {!notif.readAt && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{notif.body}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                    <span>Category: {notif.category}</span>
                    <span>Entity: {notif.entityType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.readAt && (
                    <button className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded hover:bg-pink-700">
                      Mark Read
                    </button>
                  )}
                  <button className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const userPrefs = userPreferences.filter(p => p.userId === 'usr_pm_001');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
        <p className="text-sm text-slate-600 mb-6">
          Configure how you receive notifications for each category
        </p>

        <div className="space-y-4">
          {userPrefs.map(pref => {
            const category = notificationCategories.find(c => c.code === pref.category);
            return (
              <div key={pref.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{category?.name}</h4>
                    <p className="text-xs text-slate-500">{category?.description}</p>
                  </div>
                  {category?.mandatory && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Mandatory
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-2 block">Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {['in_app', 'email', 'push', 'sms'].map(channel => (
                        <label key={channel} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={pref.channels.includes(channel)}
                            disabled={category?.mandatory && pref.channels.includes(channel)}
                            className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="text-xs text-slate-700 capitalize">{channel.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-2 block">Digest</label>
                    <select
                      value={pref.digest}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="none">None (Immediate)</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-2 block">Quiet Hours</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pref.quietHours.enabled}
                        className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-xs text-slate-700">
                        {pref.quietHours.start} - {pref.quietHours.end}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplatesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Notification Templates</h3>
          <button className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700">
            + New Template
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Subject</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Mandatory</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Version</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {notificationTemplates.map(template => (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-pink-700">{template.code}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{template.module}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {template.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{template.subject}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {template.isMandatoryCategory ? (
                      <span className="text-red-600">✓</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">v{template.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 bg-pink-600 text-white text-xs font-medium rounded hover:bg-pink-700">
                        Edit
                      </button>
                      <button className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300">
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Template Preview</h3>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-700 mb-2 block">Subject</label>
            <p className="text-sm text-slate-900">New Approval Required: {'{{docNumber}}'}</p>
          </div>
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-700 mb-2 block">Body</label>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              You have been assigned to approve {'{{docType}}'} {'{{docNumber}}'} submitted by {'{{submitterName}}'}. Amount: {'{{amount}}'}. Due: {'{{dueDate}}'}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-2 block">Variables</label>
            <div className="flex flex-wrap gap-2">
              {['docNumber', 'docType', 'submitterName', 'amount', 'dueDate'].map(variable => (
                <span key={variable} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded font-mono">
                  {'{{'}{variable}{'}}'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocketRoomsTab() {
  return (
    <div className="space-y-6">
      {/* Room Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={notificationStats.totalRooms}
          subtitle="Active"
          icon="🌐"
          color="blue"
        />
        <StatCard
          title="Total Members"
          value={notificationStats.totalActiveConnections}
          subtitle="Connected"
          icon="👥"
          color="green"
        />
        <StatCard
          title="Event Types"
          value={notificationStats.totalEvents}
          subtitle="Registered"
          icon="📡"
          color="purple"
        />
        <StatCard
          title="Presence Sessions"
          value={presenceData.length}
          subtitle="Active"
          icon="👁️"
          color="amber"
        />
      </div>

      {/* Socket Rooms */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Socket.IO Rooms</h3>
          <p className="text-sm text-slate-500 mt-1">Active real-time communication channels</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Room Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Members</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Permission</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {socketRooms.map(room => (
                <tr key={room.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-blue-700">{room.name}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-900">{room.members}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-slate-600">{room.permission}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(room.createdAt).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Catalogue */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Event Catalogue</h3>
          <p className="text-sm text-slate-500 mt-1">Registered real-time events and their routing</p>
        </div>
        <div className="divide-y divide-slate-200">
          {eventCatalogue.map(event => (
            <div key={event.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono text-pink-700 font-semibold">{event.event}</code>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                      {event.module}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{event.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Target Rooms:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {event.rooms.map((room, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Payload:</span>
                  <code className="block mt-1 text-slate-700 font-mono text-[10px]">
                    {event.payload}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Delivery Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Deliveries"
          value={deliveryLogs.length}
          subtitle="Last 24 hours"
          icon="📤"
          color="blue"
        />
        <StatCard
          title="Success Rate"
          value={`${notificationStats.deliverySuccessRate}%`}
          subtitle="Delivered"
          icon="✓"
          color="green"
        />
        <StatCard
          title="Failed"
          value={deliveryLogs.filter(d => d.status === 'failed').length}
          subtitle="Need attention"
          icon="✗"
          color="red"
        />
        <StatCard
          title="Avg Attempts"
          value={(deliveryLogs.reduce((sum, d) => sum + d.attempts, 0) / deliveryLogs.length).toFixed(1)}
          subtitle="Per delivery"
          icon="🔄"
          color="amber"
        />
      </div>

      {/* Delivery Logs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Delivery Logs</h3>
          <p className="text-sm text-slate-500 mt-1">Notification delivery attempts and status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Notification</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Provider</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deliveryLogs.map(log => {
                const notif = notifications.find(n => n.id === log.notificationId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{notif?.title}</p>
                        <p className="text-xs text-slate-500">{log.notificationId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        {log.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{log.provider}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        log.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        log.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        log.status === 'queued' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-900">{log.attempts}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failed Deliveries */}
      {deliveryLogs.filter(d => d.status === 'failed').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Failed Deliveries
          </h3>
          <div className="space-y-3">
            {deliveryLogs.filter(d => d.status === 'failed').map(log => {
              const notif = notifications.find(n => n.id === log.notificationId);
              return (
                <div key={log.id} className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{notif?.title}</p>
                      <p className="text-xs text-slate-500">Channel: {log.channel} | Provider: {log.provider}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Failed
                    </span>
                  </div>
                  {log.error && (
                    <p className="text-xs text-red-600 mt-2">Error: {log.error}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">Attempts: {log.attempts}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    pink: 'bg-pink-50 border-pink-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    amber: 'bg-amber-50 border-amber-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
