import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { parseEmailCallback } from './emailCallback';

let refreshing;
let callbackPromise;
let callbackDetected = false;
function consumeEmailCallback() {
  if (callbackPromise) return callbackPromise;
  const callback = parseEmailCallback(window.location.hash, window.location.search);
  if (callback.kind === 'none') return Promise.resolve(false);
  callbackDetected = true;
  const address = new URL(window.location.href); address.hash = ''; address.searchParams.delete('auth');
  window.history.replaceState(null, '', address.pathname + address.search);
  callbackPromise = callback.kind === 'error' ? Promise.reject(new Error(callback.message)) : api('email-session', callback).then(() => true);
  return callbackPromise;
}
async function call(action, data = {}) {
  const res = await fetch('/.netlify/functions/platform', { method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, action }) });
  const result = await res.json().catch(() => ({ error: 'تعذّر الوصول إلى خدمة المنصة.' }));
  return { res, result };
}
export async function api(action, data = {}) {
  let response;
  try { response = await call(action, data); } catch { throw new Error('تعذّر الاتصال. تحققي من الإنترنت وحاولي مجددًا.'); }
  const publicAction = ['login', 'refresh', 'logout', 'status', 'signup', 'recover-password', 'resend-confirmation', 'email-session'].includes(action);
  if (response.res.status === 401 && !publicAction) {
    refreshing ||= call('refresh').finally(() => { refreshing = null; });
    const renewed = await refreshing;
    if (renewed.res.ok) response = await call(action, data);
  }
  if (!response.res.ok) {
    const error = new Error(response.result.error || 'تعذّر إكمال العملية.');
    error.status = response.res.status;
    if (error.status === 401 && !publicAction) window.dispatchEvent(new Event('atqin-session-expired'));
    throw error;
  }
  return response.result;
}

const PlatformContext = createContext(null);
export const usePlatform = () => useContext(PlatformContext);
export function PlatformProvider({ children }) {
  const channel = useRef(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [missing, setMissing] = useState([]);
  const [authCallback, setAuthCallback] = useState(false);
  const [error, setError] = useState('');
  const initialize = async () => {
    setLoading(true); setError('');
    try {
      const status = await api('status');
      setConfigured(status.configured);
      setMissing(status.missing || []);
      if (status.configured) {
        try { await consumeEmailCallback(); } finally { if (callbackDetected) setAuthCallback(true); }
        try { setAccount(await api('me')); } catch (e) { if (e.status !== 401) throw e; }
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    initialize();
    const expire = () => setAccount(null);
    window.addEventListener('atqin-session-expired', expire);
    return () => window.removeEventListener('atqin-session-expired', expire);
  }, []);
  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const authChannel = new BroadcastChannel('atqin-auth'); channel.current = authChannel;
    authChannel.onmessage = async ({ data }) => {
      setAccount(null);
      if (data === 'login') { try { setAccount(await api('me')); } catch { /* remain signed out */ } }
    };
    return () => { authChannel.close(); channel.current = null; };
  }, []);
  const login = async (username, password) => { await api('login', { username, password }); setAccount(await api('me')); channel.current?.postMessage('login'); };
  const logout = async () => { await api('logout'); setAccount(null); channel.current?.postMessage('logout'); };
  const refresh = async () => { const result = await api('me'); setAccount(result); return result; };
  return <PlatformContext.Provider value={{ account, setAccount, loading, configured, missing, authCallback, error, retry: initialize, login, logout, refresh }}>{children}</PlatformContext.Provider>;
}

export function Notice({ children, error = false }) {
  return <div role={error ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm leading-7 ${error ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>{children}</div>;
}
export const fieldClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-moe-teal';
export const buttonClass = 'rounded-xl bg-moe-navy text-white px-5 py-3 text-sm font-bold hover:bg-moe-green disabled:opacity-50 disabled:cursor-wait transition-colors';

export function downloadJson(name, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
