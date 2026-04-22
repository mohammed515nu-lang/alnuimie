import type { AuthUser, Connection } from '../api/types';

export type ConnectedPerson = { id: string; name: string; role: string };

/** الطرف الآخر في اتصال مقبول */
export function otherInConnection(c: Connection, myId: string): { id: string; name: string; role: string } {
  if (c.fromUserId === myId) {
    return { id: c.toUserId, name: c.toUserName, role: String(c.toUserRole) };
  }
  return { id: c.fromUserId, name: c.fromUserName, role: String(c.fromUserRole) };
}

/** مقاولون متصلون بالعميل (اتصال مقبول) — لشاشة الدفع */
export function acceptedContractorsForClient(me: AuthUser, connections: Connection[]): ConnectedPerson[] {
  if (me.role !== 'client') return [];
  const out: ConnectedPerson[] = [];
  for (const c of connections) {
    if (c.status !== 'accepted') continue;
    const o = otherInConnection(c, me._id);
    if (o.role === 'contractor') out.push({ id: o.id, name: o.name, role: o.role });
  }
  return out;
}

/** عملاء متصلون بالمقاول — يمكن لاحقاً لاختيار مستلم دفعات */
export function acceptedClientsForContractor(me: AuthUser, connections: Connection[]): ConnectedPerson[] {
  if (me.role !== 'contractor') return [];
  const out: ConnectedPerson[] = [];
  for (const c of connections) {
    if (c.status !== 'accepted') continue;
    const o = otherInConnection(c, me._id);
    if (o.role === 'client') out.push({ id: o.id, name: o.name, role: o.role });
  }
  return out;
}
