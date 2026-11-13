'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { 
  CheckCircle2, CreditCard, Loader2, ArrowLeft, Calendar, 
  Clock, MapPin, Users, Briefcase, Car, Download, Phone
} from 'lucide-react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { formatDateTime, money, STATUS_LABEL } from '@/lib/format';
import type { PublicBooking } from '@/lib/types';

function messageOf(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

export function BookingView({ reference }: { reference: string }) {
  const search = useSearchParams();
  const paymentFlag = search.get('payment');
  const storageKey = `limo:access:${reference}`;

  const [token, setToken] = useState<string | null>(null);
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const load = useCallback(
    async (accessToken: string) => {
      try {
        const res = await api<{ data: PublicBooking }>(`/public/bookings/${reference}`, {
          token: accessToken,
          cache: 'no-store',
        });
        setBooking(res.data);
        setError(null);
      } catch (e) {
        setError(
          e instanceof ApiError && e.status === 404
            ? 'We could not find this booking with the link you used.'
            : 'We could not load your booking. Please refresh the page.',
        );
      } finally {
        setLoading(false);
      }
    },
    [reference],
  );

  useEffect(() => {
    const fromUrl = search.get('token');
    const accessToken = fromUrl ?? sessionStorage.getItem(storageKey);

    if (fromUrl) {
      sessionStorage.setItem(storageKey, fromUrl);
      const keep = paymentFlag ? `?payment=${paymentFlag}` : '';
      window.history.replaceState(null, '', `${window.location.pathname}${keep}`);
    }

    setToken(accessToken);

    if (!accessToken) {
      setLoading(false);
      setError('Open the link from your confirmation email to view this booking.');
      return;
    }

    load(accessToken);
  }, [storageKey, load]);

  useEffect(() => {
    if (!token || !booking || booking.status !== 'pending_payment' || paymentFlag !== 'success') return;
    const timer = setInterval(() => load(token), 3000);
    return () => clearInterval(timer);
  }, [token, booking, paymentFlag, load]);

  async function payNow() {
    if (!token) return;
    setPaying(true);
    setError(null);

    try {
      const res = await api<{ data: { checkout_url: string } }>(`/public/bookings/${reference}/checkout`, {
        method: 'POST',
        token,
      });
      window.location.assign(res.data.checkout_url);
    } catch (e) {
      setError(messageOf(e));
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#eab308]" size={32} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl max-w-md">
          <p className="font-serif text-2xl font-bold text-[#0f172a]">Booking unavailable</p>
          <p className="mt-4 text-sm text-gray-500">{error}</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-6 py-2 text-sm font-bold text-black hover:shadow-lg transition-all">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const outbound = booking.legs.find((l) => l.direction === 'outbound') ?? booking.legs[0];

  return (
    <div className="rounded-2xl bg-white p-4 md:p-5 border border-gray-300 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)]">
      
      <div className="text-center mb-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-md mb-2">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#0f172a] mb-0.5">Your Booking is Confirmed!</h2>
        <p className="text-xs text-gray-500">Thank you for choosing Swiss Aero Transfer. Your booking reference is below.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-green-50 border border-green-200 rounded-xl p-2.5 mb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700">
            <Car size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Booking Reference</p>
            <p className="font-mono text-base font-bold text-[#0f172a] tracking-wider">{booking.reference}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm border border-green-200">
          <CheckCircle2 size={14} className="text-green-600" />
          <span className="text-xs font-bold text-green-700">{STATUS_LABEL[booking.status]}</span>
        </div>
      </div>

      {paymentFlag === 'success' && booking.status === 'pending_payment' && (
        <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs text-yellow-800">
          Thank you. We are confirming your payment. This page updates automatically.
        </div>
      )}

      {booking.status === 'pending_payment' && booking.payment_method === 'online' && (
        <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-bold text-yellow-800">Action Required: Complete your payment</p>
          <p className="text-xs text-yellow-700 text-center">Your booking is held, but we have not received your payment yet.</p>
          <button 
            onClick={payNow} 
            disabled={paying}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-8 py-2 text-sm font-bold text-black shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <CreditCard size={16} /> {paying ? 'Opening secure payment…' : 'Pay Now (Secure Checkout)'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#0f172a] px-3 py-1.5 flex items-center gap-2">
            <Briefcase size={12} className="text-[#eab308]" />
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Booking Summary</h3>
          </div>
          <div className="p-2.5 space-y-1 text-[11px]">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><Car size={12} /> Service</span>
              <span className="font-semibold text-[#0f172a]">Transfer / Ride</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><MapPin size={12} /> From</span>
              <span className="font-semibold text-[#0f172a] text-right truncate max-w-[120px]">{outbound?.pickup ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><MapPin size={12} /> To</span>
              <span className="font-semibold text-[#0f172a] text-right truncate max-w-[120px]">{outbound?.dropoff ?? '—'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><Calendar size={12} /> Travel Date</span>
              <span className="font-semibold text-[#0f172a]">{outbound?.starts_at ? formatDateTime(outbound.starts_at).split(',')[0] : '—'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><Clock size={12} /> Pickup Time</span>
              <span className="font-semibold text-[#0f172a]">{outbound?.starts_at ? formatDateTime(outbound.starts_at).split(',')[1] : '—'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><Users size={12} /> Passengers</span>
              <span className="font-semibold text-[#0f172a]">{booking.passengers}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-black flex items-center gap-1.5"><Briefcase size={12} /> Luggage</span>
              <span className="font-semibold text-[#0f172a]">{booking.luggage} Bags</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-black flex items-center gap-1.5"><Car size={12} /> Vehicle</span>
              <span className="font-semibold text-[#0f172a] text-right truncate max-w-[120px]">{booking.vehicle.name ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#0f172a] px-3 py-1.5 flex items-center gap-2">
            <MapPin size={12} className="text-[#eab308]" />
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Your Journey</h3>
          </div>
          <div className="p-2.5">
            <div className="flex items-center justify-between mb-3 relative mt-1">
              <div className="flex flex-col items-center z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white">
                  <MapPin size={16} />
                </div>
                <p className="mt-1 text-[10px] font-bold text-[#0f172a] text-center max-w-[80px] leading-tight truncate">{outbound?.pickup}</p>
              </div>
              <div className="absolute left-0 right-0 top-4 h-px border-t-2 border-dashed border-gray-300 z-0"></div>
              <div className="flex flex-col items-center z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white">
                  <Car size={16} />
                </div>
              </div>
              <div className="flex flex-col items-center z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white">
                  <MapPin size={16} />
                </div>
                <p className="mt-1 text-[10px] font-bold text-[#0f172a] text-center max-w-[80px] leading-tight truncate">{outbound?.dropoff}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                <Calendar size={14} className="text-[#0f172a]" />
                <div>
                  <p className="text-[8px] text-black uppercase tracking-wider">Date</p>
                  <p className="text-[10px] font-bold text-[#0f172a]">{outbound?.starts_at ? formatDateTime(outbound.starts_at).split(',')[0] : '—'}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                <Clock size={14} className="text-[#0f172a]" />
                <div>
                  <p className="text-[8px] text-black uppercase tracking-wider">Pickup Time</p>
                  <p className="text-[10px] font-bold text-[#0f172a]">{outbound?.starts_at ? formatDateTime(outbound.starts_at).split(',')[1] : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-gray-50 transition-all w-full sm:w-auto"
        >
          <ArrowLeft size={12} /> Back to Home
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-gray-50 transition-all w-full sm:w-auto">
            <Download size={12} /> Download
          </button>
          <a 
            href="https://wa.me/41791234567" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full border border-green-500 bg-white px-3 py-1.5 text-[11px] font-bold text-green-600 hover:bg-green-50 transition-all w-full sm:w-auto"
          >
            <Phone size={12} /> WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
