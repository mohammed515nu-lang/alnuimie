import AsyncStorage from '@react-native-async-storage/async-storage';

export type BunyanAiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  createdAt: string;
};

/** محادثة مؤرشفة (تظهر في «القديمة»). */
export type BunyanAiThread = {
  id: string;
  title: string;
  messages: BunyanAiMessage[];
  updatedAt: string;
};

/** زوج سؤال/جواب محفوظ يدوياً. */
export type BunyanSavedTurn = {
  id: string;
  question: string;
  answer: string;
  source?: string;
  savedAt: string;
};

function keys(userId: string) {
  const u = userId.trim();
  return {
    active: `@bunyan_ai_active_v1_${u}`,
    archives: `@bunyan_ai_archives_v1_${u}`,
    trash: `@bunyan_ai_trash_v1_${u}`,
    saved: `@bunyan_ai_saved_v1_${u}`,
  };
}

export function bunyanGenId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function threadTitleFromMessages(msgs: BunyanAiMessage[]): string {
  const first = msgs.find((m) => m.role === 'user');
  const t = first?.content?.trim() || 'محادثة';
  return t.length > 48 ? `${t.slice(0, 45)}…` : t;
}

export async function loadActiveMessages(userId: string): Promise<BunyanAiMessage[]> {
  if (!userId.trim()) return [];
  try {
    const raw = await AsyncStorage.getItem(keys(userId).active);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => x && typeof x === 'object' && (x as BunyanAiMessage).role && (x as BunyanAiMessage).id);
  } catch {
    return [];
  }
}

export async function saveActiveMessages(userId: string, messages: BunyanAiMessage[]): Promise<void> {
  if (!userId.trim()) return;
  await AsyncStorage.setItem(keys(userId).active, JSON.stringify(messages));
}

export async function loadArchives(userId: string): Promise<BunyanAiThread[]> {
  if (!userId.trim()) return [];
  try {
    const raw = await AsyncStorage.getItem(keys(userId).archives);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as BunyanAiThread[]) : [];
  } catch {
    return [];
  }
}

export async function saveArchives(userId: string, threads: BunyanAiThread[]): Promise<void> {
  if (!userId.trim()) return;
  await AsyncStorage.setItem(keys(userId).archives, JSON.stringify(threads.slice(0, 80)));
}

export async function loadTrash(userId: string): Promise<BunyanAiThread[]> {
  if (!userId.trim()) return [];
  try {
    const raw = await AsyncStorage.getItem(keys(userId).trash);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as BunyanAiThread[]) : [];
  } catch {
    return [];
  }
}

export async function saveTrash(userId: string, threads: BunyanAiThread[]): Promise<void> {
  if (!userId.trim()) return;
  await AsyncStorage.setItem(keys(userId).trash, JSON.stringify(threads.slice(0, 40)));
}

export async function loadSaved(userId: string): Promise<BunyanSavedTurn[]> {
  if (!userId.trim()) return [];
  try {
    const raw = await AsyncStorage.getItem(keys(userId).saved);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as BunyanSavedTurn[]) : [];
  } catch {
    return [];
  }
}

export async function saveSaved(userId: string, items: BunyanSavedTurn[]): Promise<void> {
  if (!userId.trim()) return;
  await AsyncStorage.setItem(keys(userId).saved, JSON.stringify(items.slice(0, 120)));
}

/** أرشفة المحادثة الحالية ومسح النشطة. */
export async function archiveCurrentAndClear(userId: string, messages: BunyanAiMessage[]): Promise<BunyanAiThread[]> {
  if (!userId.trim() || messages.length === 0) {
    await saveActiveMessages(userId, []);
    return loadArchives(userId);
  }
  const archives = await loadArchives(userId);
  const thread: BunyanAiThread = {
    id: bunyanGenId(),
    title: threadTitleFromMessages(messages),
    messages: [...messages],
    updatedAt: new Date().toISOString(),
  };
  const next = [thread, ...archives].slice(0, 80);
  await saveArchives(userId, next);
  await saveActiveMessages(userId, []);
  return next;
}

export async function moveThreadToTrash(userId: string, threadId: string, from: 'archives' | 'saved'): Promise<void> {
  if (!userId.trim()) return;
  if (from === 'archives') {
    const archives = await loadArchives(userId);
    const idx = archives.findIndex((t) => t.id === threadId);
    if (idx < 0) return;
    const [removed] = archives.splice(idx, 1);
    await saveArchives(userId, archives);
    const trash = await loadTrash(userId);
    await saveTrash(userId, [{ ...removed, updatedAt: new Date().toISOString() }, ...trash]);
  } else {
    const saved = await loadSaved(userId);
    const item = saved.find((s) => s.id === threadId);
    if (!item) return;
    const rest = saved.filter((s) => s.id !== threadId);
    await saveSaved(userId, rest);
    const asThread: BunyanAiThread = {
      id: item.id,
      title: item.question.slice(0, 48),
      messages: [
        { id: bunyanGenId(), role: 'user', content: item.question, createdAt: item.savedAt },
        {
          id: bunyanGenId(),
          role: 'assistant',
          content: item.answer,
          source: item.source,
          createdAt: item.savedAt,
        },
      ],
      updatedAt: item.savedAt,
    };
    const trash = await loadTrash(userId);
    await saveTrash(userId, [asThread, ...trash]);
  }
}

export async function restoreThreadFromTrash(userId: string, threadId: string): Promise<void> {
  const trash = await loadTrash(userId);
  const idx = trash.findIndex((t) => t.id === threadId);
  if (idx < 0) return;
  const [removed] = trash.splice(idx, 1);
  await saveTrash(userId, trash);
  const archives = await loadArchives(userId);
  await saveArchives(userId, [{ ...removed, updatedAt: new Date().toISOString() }, ...archives]);
}

export async function purgeTrashThread(userId: string, threadId: string): Promise<void> {
  const trash = await loadTrash(userId);
  await saveTrash(
    userId,
    trash.filter((t) => t.id !== threadId)
  );
}

export async function applyThreadAsActive(userId: string, thread: BunyanAiThread): Promise<void> {
  await saveActiveMessages(userId, thread.messages);
}
