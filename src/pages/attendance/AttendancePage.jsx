import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceAPI, memberAPI } from '../../services/api';
import { PageHeader, Card, Avatar, StatusBadge, SearchBar, Tabs } from '../../components/ui';
import {
  UserCheck, UserX, Users, Activity, ClipboardCheck,
  Search, RefreshCw, Loader2, Clock, CheckCircle, Circle
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function AttendancePage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('checkin');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [pendingIds, setPendingIds] = useState(new Set()); // loading state per member

  // ─── Live presence (currently inside) ─────────────────────────────────────
  const { data: liveData, isLoading: liveLoading } = useQuery({
    queryKey: ['live-attendance'],
    queryFn: () => attendanceAPI.getLive(),
    refetchInterval: tab === 'checkin' ? 20000 : false,
  });

  // ─── All members for this branch (for check-in list) ──────────────────────
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-for-attendance', search],
    queryFn: () => memberAPI.getAll({
      limit: 100,
      status: 'active',
      search: search || undefined
    }),
    staleTime: 60000,
  });

  // ─── Attendance log for selected date ─────────────────────────────────────
  const { data: logData, isLoading: logLoading } = useQuery({
    queryKey: ['attendance-log', date],
    queryFn: () => attendanceAPI.getAll({ date, memberType: 'member', limit: 200 }),
    enabled: tab === 'log',
  });

  // Today's attendance records for member status lookup
  const { data: todayData } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => attendanceAPI.getAll({
      date: dayjs().format('YYYY-MM-DD'),
      memberType: 'member',
      limit: 500
    }),
    refetchInterval: 30000,
  });

  // Build a lookup: memberId → attendance record for today
  const todayMap = {};
  (todayData?.data || []).forEach(att => {
    if (att.member?._id) todayMap[att.member._id] = att;
  });

  const currentlyIn = liveData?.data?.currentlyPresent || [];
  const currentlyInIds = new Set(currentlyIn.map(a => a.member?._id));

  // ─── Check-in mutation ────────────────────────────────────────────────────
  const checkInMutation = useMutation({
    mutationFn: (memberId) => attendanceAPI.manualCheckIn({ memberObjectId: memberId }),
    onMutate: (memberId) => { setPendingIds(s => new Set([...s, memberId])); },
    onSettled: (_, __, memberId) => { setPendingIds(s => { const n = new Set(s); n.delete(memberId); return n; }); },
    onSuccess: (res, memberId) => {
      toast.success(`✅ ${res.data?.member?.name || 'Member'} checked in!`);
      qc.invalidateQueries(['live-attendance']);
      qc.invalidateQueries(['attendance-today']);
    },
    onError: (err, memberId) => { toast.error(err.message || 'Check-in failed'); }
  });

  // ─── Check-out mutation ───────────────────────────────────────────────────
  const checkOutMutation = useMutation({
    mutationFn: (attendanceId) => attendanceAPI.checkOut(attendanceId),
    onSuccess: (res) => {
      toast.success('Checked out successfully');
      qc.invalidateQueries(['live-attendance']);
      qc.invalidateQueries(['attendance-today']);
    },
    onError: (err) => { toast.error(err.message || 'Check-out failed'); }
  });

  const handleCheckIn = (member) => {
    if (pendingIds.has(member._id)) return;
    checkInMutation.mutate(member._id);
  };

  const handleCheckOut = (member) => {
    const att = todayMap[member._id] || currentlyIn.find(a => a.member?._id === member._id);
    if (!att?._id) { toast.error('No attendance record found'); return; }
    checkOutMutation.mutate(att._id);
  };

  const members = membersData?.data || [];
  const live = liveData?.data;

  // Member status for today
  const getMemberStatus = (memberId) => {
    const att = todayMap[memberId];
    if (!att) return 'not_in'; // Not yet checked in
    if (att.checkOut) return 'checked_out'; // Was here, left
    return 'checked_in'; // Currently inside
  };

  const logColumns_date = date === dayjs().format('YYYY-MM-DD') ? 'Today' : dayjs(date).format('DD MMM YYYY');

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Attendance"
        subtitle={`${live?.currentCount || 0} members currently present`}
        actions={
          <button onClick={() => { qc.invalidateQueries(['live-attendance']); qc.invalidateQueries(['attendance-today']); }}
            className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw size={14} />Refresh
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{live?.currentCount || 0}</p>
            <p className="text-xs text-gray-400">Currently Inside</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ClipboardCheck size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{live?.totalToday || 0}</p>
            <p className="text-xs text-gray-400">Total Today</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{members.length}</p>
            <p className="text-xs text-gray-400">Active Members</p>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { value: 'checkin', label: '✅ Check-in Board' },
          { value: 'live', label: '🟢 Live View' },
          { value: 'log', label: '📋 Log' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ─── CHECK-IN BOARD ────────────────────────────────────────── */}
      {tab === 'checkin' && (
        <Card noPadding>
          {/* Search */}
          <div className="p-4 border-b border-surface-border">
            <div className="flex items-center gap-3">
              <SearchBar value={search} onChange={setSearch} placeholder="Search by name, phone, or member ID..." />
              <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />Inside</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500" />Checked out</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-surface-border" />Not in</span>
              </div>
            </div>
          </div>

          {/* Member list */}
          {membersLoading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="shimmer-line h-16 w-full rounded-xl" />)}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p>{search ? `No members match "${search}"` : 'No active members found'}</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border/50">
              {members.map(member => {
                const status = getMemberStatus(member._id);
                const isInside = status === 'checked_in';
                const wasHere = status === 'checked_out';
                const isPending = pendingIds.has(member._id);
                const attRecord = todayMap[member._id];
                const daysLeft = member.membership?.endDate
                  ? Math.ceil((new Date(member.membership.endDate) - new Date()) / 86400000)
                  : null;

                return (
                  <div key={member._id}
                    className={`flex items-center justify-between px-5 py-3 transition-colors
                      ${isInside ? 'bg-emerald-500/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    {/* Member info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <Avatar name={member.name} photo={member.photo} size="md" />
                        {/* Status dot */}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F0F1A]
                          ${isInside ? 'bg-emerald-400' : wasHere ? 'bg-gray-400' : 'bg-surface-border'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-500">{member.memberId}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-xs text-gray-500">{member.phone}</span>
                          {member.membership?.plan?.name && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-gray-500">{member.membership.plan.name}</span>
                            </>
                          )}
                          {daysLeft !== null && daysLeft <= 7 && daysLeft >= 0 && (
                            <span className="badge badge-yellow text-[10px]">⚠ {daysLeft}d left</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Time info + Action */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {isInside && attRecord?.checkIn && (
                        <div className="hidden sm:flex flex-col items-end text-xs">
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Clock size={11} />In at {dayjs(attRecord.checkIn).format('hh:mm A')}
                          </span>
                          <span className="text-gray-500">{dayjs(attRecord.checkIn).fromNow()}</span>
                        </div>
                      )}
                      {wasHere && attRecord && (
                        <div className="hidden sm:flex flex-col items-end text-xs">
                          <span className="text-gray-400 font-medium">{attRecord.duration || 0} min</span>
                          <span className="text-gray-500">
                            {dayjs(attRecord.checkIn).format('hh:mm')} – {dayjs(attRecord.checkOut).format('hh:mm A')}
                          </span>
                        </div>
                      )}

                      {/* Action button */}
                      {isPending ? (
                        <div className="w-28 flex justify-center">
                          <Loader2 size={18} className="animate-spin text-primary" />
                        </div>
                      ) : isInside ? (
                        <button
                          onClick={() => handleCheckOut(member)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <UserX size={14} />Check Out
                        </button>
                      ) : wasHere ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 bg-surface-card/50 border border-surface-border">
                          <CheckCircle size={14} className="text-gray-500" />Done
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(member)}
                          disabled={member.membership?.status !== 'active'}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <UserCheck size={14} />Check In
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {members.length > 0 && (
            <div className="px-5 py-3 border-t border-surface-border bg-surface-card/20 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {members.length} active members</span>
              <span className="flex items-center gap-3">
                <span className="text-emerald-400">{Object.values(todayMap).filter(a => !a.checkOut).length} inside</span>
                <span>{Object.values(todayMap).filter(a => a.checkOut).length} checked out</span>
                <span>{members.length - Object.keys(todayMap).length} not in yet</span>
              </span>
            </div>
          )}
        </Card>
      )}

      {/* ─── LIVE VIEW ─────────────────────────────────────────────── */}
      {tab === 'live' && (
        <Card title={`Currently Present — ${live?.currentCount || 0} members`} noPadding>
          {liveLoading ? (
            <div className="p-8 flex justify-center"><Loader2 size={28} className="animate-spin text-primary" /></div>
          ) : currentlyIn.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Activity size={40} className="mx-auto mb-3 opacity-30" />
              <p>No members currently inside</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border/50">
              {currentlyIn.map(att => (
                <div key={att._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={att.member?.name} photo={att.member?.photo} />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F0F1A] animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{att.member?.name}</p>
                      <p className="text-xs text-gray-500">
                        In since {dayjs(att.checkIn).format('hh:mm A')} · {dayjs(att.checkIn).fromNow()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => checkOutMutation.mutate(att._id)}
                    disabled={checkOutMutation.isPending}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <UserX size={12} />Check Out
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ─── ATTENDANCE LOG ────────────────────────────────────────── */}
      {tab === 'log' && (
        <Card noPadding>
          <div className="p-4 border-b border-surface-border flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white">{logColumns_date} — Attendance Log</p>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={dayjs().format('YYYY-MM-DD')}
              className="input py-1.5 text-sm w-44"
            />
          </div>

          {logLoading ? (
            <div className="p-6 space-y-2">{[1,2,3,4].map(i => <div key={i} className="shimmer-line h-14 w-full" />)}</div>
          ) : !logData?.data?.length ? (
            <div className="text-center py-16 text-gray-500">
              <ClipboardCheck size={36} className="mx-auto mb-3 opacity-30" />
              <p>No attendance records for {dayjs(date).format('DD MMM YYYY')}</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-surface-border/50">
                {logData.data.map(att => (
                  <div key={att._id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={att.member?.name} photo={att.member?.photo} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-white">{att.member?.name}</p>
                        <p className="text-xs text-gray-500">{att.member?.memberId} · {att.member?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-emerald-400 font-medium">{dayjs(att.checkIn).format('hh:mm A')}</p>
                        <p className="text-xs text-gray-500">Check In</p>
                      </div>
                      <div className="text-center">
                        {att.checkOut
                          ? <><p className="text-red-400 font-medium">{dayjs(att.checkOut).format('hh:mm A')}</p><p className="text-xs text-gray-500">Check Out</p></>
                          : <><p className="text-amber-400 text-xs font-medium">Still Inside</p><p className="text-xs text-gray-500">—</p></>
                        }
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-white font-medium">{att.duration ? `${att.duration} min` : '—'}</p>
                        <p className="text-xs text-gray-500">Duration</p>
                      </div>
                      <span className={`badge text-[10px] ${att.checkInMethod === 'qr' ? 'badge-blue' : 'badge-gray'}`}>
                        {att.checkInMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-surface-border bg-surface-card/20 text-xs text-gray-500 flex justify-between">
                <span>{logData.data.length} records</span>
                <span>Avg duration: {Math.round(logData.data.filter(a => a.duration).reduce((s, a) => s + a.duration, 0) / (logData.data.filter(a => a.duration).length || 1))} min</span>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
