/**
 * Mock data for NFC Attendance Tracking System
 *
 * Schema per person:
 * - id: string | number
 * - name: string
 * - image: string (ui-avatars.com url)
 * - role: 'Member' | 'Lead'
 * - leadPosition: string | null (e.g. 'President', 'Tech Lead', 'Design Lead', 'Vice President', 'Event Lead')
 * - user: boolean (true = checked in, false = checked out)
 * - checkInDate: string | null (e.g. '2026-08-16')
 * - checkInTime: number | null (timestamp in ms)
 * - checkOutTime: number | null (timestamp in ms)
 * - totalDuration: number (accumulated seconds)
 */

export const INITIAL_PEOPLE = [
  {
    id: 'p-1',
    name: 'Alex Rivera',
    image: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=ffffff&size=200&bold=true',
    role: 'Lead',
    leadPosition: 'President',
    user: false,
    checkInDate: null,
    checkInTime: null,
    checkOutTime: null,
    totalDuration: 14400, // 4 hours accumulated previously
  },
  {
    id: 'p-2',
    name: 'Sarah Chen',
    image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=a855f7&color=ffffff&size=200&bold=true',
    role: 'Lead',
    leadPosition: 'Tech Lead',
    user: true,
    checkInDate: new Date(Date.now() - 3720000).toISOString().split('T')[0],
    checkInTime: Date.now() - 3720000, // checked in ~1h 2m ago for immediate live timer demonstration
    checkOutTime: null,
    totalDuration: 28800, // 8 hours
  },
  {
    id: 'p-3',
    name: 'Marcus Vance',
    image: 'https://ui-avatars.com/api/?name=Marcus+Vance&background=3b82f6&color=ffffff&size=200&bold=true',
    role: 'Lead',
    leadPosition: 'Design Lead',
    user: false,
    checkInDate: null,
    checkInTime: null,
    checkOutTime: null,
    totalDuration: 18000, // 5 hours
  },
  {
    id: 'p-4',
    name: 'Elena Rostova',
    image: 'https://ui-avatars.com/api/?name=Elena+Rostova&background=ec4899&color=ffffff&size=200&bold=true',
    role: 'Lead',
    leadPosition: 'Vice President',
    user: false,
    checkInDate: null,
    checkInTime: null,
    checkOutTime: null,
    totalDuration: 21600, // 6 hours
  },
  {
    id: 'p-5',
    name: 'Devon Miller',
    image: 'https://ui-avatars.com/api/?name=Devon+Miller&background=10b981&color=ffffff&size=200&bold=true',
    role: 'Member',
    leadPosition: null,
    user: true,
    checkInDate: new Date(Date.now() - 1560000).toISOString().split('T')[0],
    checkInTime: Date.now() - 1560000, // checked in ~26m ago
    checkOutTime: null,
    totalDuration: 7200, // 2 hours
  },
  {
    id: 'p-6',
    name: 'Aria Thorne',
    image: 'https://ui-avatars.com/api/?name=Aria+Thorne&background=f59e0b&color=ffffff&size=200&bold=true',
    role: 'Member',
    leadPosition: null,
    user: false,
    checkInDate: null,
    checkInTime: null,
    checkOutTime: null,
    totalDuration: 10800, // 3 hours
  },
];

export const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    personId: 'p-2',
    name: 'Sarah Chen',
    role: 'Lead',
    leadPosition: 'Tech Lead',
    image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=a855f7&color=ffffff&size=200&bold=true',
    checkInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkInTime: Date.now() - 86400000,
    checkOutTime: Date.now() - 86400000 + 14400000,
    duration: 14400, // 4 hrs
  },
  {
    id: 'hist-2',
    personId: 'p-1',
    name: 'Alex Rivera',
    role: 'Lead',
    leadPosition: 'President',
    image: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=ffffff&size=200&bold=true',
    checkInDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    checkInTime: Date.now() - 86400000 + 3600000,
    checkOutTime: Date.now() - 86400000 + 18000000,
    duration: 14400, // 4 hrs
  },
  {
    id: 'hist-3',
    personId: 'p-6',
    name: 'Aria Thorne',
    role: 'Member',
    leadPosition: null,
    image: 'https://ui-avatars.com/api/?name=Aria+Thorne&background=f59e0b&color=ffffff&size=200&bold=true',
    checkInDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    checkInTime: Date.now() - 172800000,
    checkOutTime: Date.now() - 172800000 + 10800000,
    duration: 10800, // 3 hrs
  },
  {
    id: 'hist-4',
    personId: 'p-4',
    name: 'Elena Rostova',
    role: 'Lead',
    leadPosition: 'Vice President',
    image: 'https://ui-avatars.com/api/?name=Elena+Rostova&background=ec4899&color=ffffff&size=200&bold=true',
    checkInDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    checkInTime: Date.now() - 172800000 + 7200000,
    checkOutTime: Date.now() - 172800000 + 21600000,
    duration: 14400, // 4 hrs
  },
  {
    id: 'hist-5',
    personId: 'p-5',
    name: 'Devon Miller',
    role: 'Member',
    leadPosition: null,
    image: 'https://ui-avatars.com/api/?name=Devon+Miller&background=10b981&color=ffffff&size=200&bold=true',
    checkInDate: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    checkInTime: Date.now() - 259200000,
    checkOutTime: Date.now() - 259200000 + 7200000,
    duration: 7200, // 2 hrs
  },
];
