import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getCities, createBooking } from '../lib/api';
import { Package, MapPin, User, Phone, ArrowRight, Bus, CheckCircle2, Shield, X, Lock } from 'lucide-react';

export const BookingPage = () => {
  const [scope, setScope] = useState<'INTERCITY' | 'LOCAL'>('INTERCITY');
  const [cities, setCities] = useState<any[]>([]);
  
  // Selections
  const [originCityId, setOriginCityId] = useState('');
  const [destCityId, setDestCityId] = useState('');
  
  const [originDepots, setOriginDepots] = useState<any[]>([]);
  const [destDepots, setDestDepots] = useState<any[]>([]);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const [routes, setRoutes] = useState<any[]>([]);
  const [routeId, setRouteId] = useState('');

  const [weight, setWeight] = useState(1);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment Modal state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'CARD_ENTRY' | 'PROCESSING' | 'SUCCESS'>('CARD_ENTRY');

  const navigate = useNavigate();

  useEffect(() => {
    getCities().then(res => setCities(res.data)).catch(console.error);
  }, []);

  // When scope changes, reset everything
  useEffect(() => {
    setOriginCityId('');
    setDestCityId('');
    setOrigin('');
    setDestination('');
    setRoutes([]);
    setRouteId('');
  }, [scope]);

  // If local, keep destCity in sync with originCity
  useEffect(() => {
    if (scope === 'LOCAL') {
      setDestCityId(originCityId);
    }
  }, [originCityId, scope]);

  // Fetch Depots when cities change
  useEffect(() => {
    setOrigin('');
    setOriginDepots([]);
    if (originCityId) {
      api.get(`/depots?cityId=${originCityId}&mode=${scope}`).then(res => setOriginDepots(res.data)).catch(console.error);
    }
  }, [originCityId, scope]);

  useEffect(() => {
    setDestination('');
    setDestDepots([]);
    if (destCityId) {
      api.get(`/depots?cityId=${destCityId}&mode=${scope}`).then(res => setDestDepots(res.data)).catch(console.error);
    }
  }, [destCityId, scope]);

  // Fetch routes when depots are selected
  useEffect(() => {
    setRoutes([]);
    setRouteId('');
    if (origin && destination) {
      api.get(`/routes?type=${scope}&originDepotId=${origin}&destDepotId=${destination}`)
        .then(res => {
          setRoutes(res.data);
          if (res.data.length > 0) setRouteId(res.data[0].id); // Auto-select top scored route
        }).catch(console.error);
    }
  }, [origin, destination, scope]);

  // Pricing logic
  const base = scope === 'INTERCITY' ? 50 : 25;
  const perKg = scope === 'INTERCITY' ? 15 : 8;
  const platformFee = scope === 'INTERCITY' ? 20 : 10;
  const maxWeight = scope === 'INTERCITY' ? 20 : 8;

  const weightCharge = weight * perKg;
  const total = base + weightCharge + platformFee;
  const transitShare = Math.round(total * 0.6);
  const platformShare = Math.round(total * 0.3);
  const agentShare = Math.round(total * 0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin === destination) { setError('Origin and destination cannot be the same.'); return; }
    setShowPayment(true);
    setPaymentStep('CARD_ENTRY');
  };

  const processPayment = async () => {
    setPaymentStep('PROCESSING');
    
    // Simulate network delay for payment processing
    await new Promise(r => setTimeout(r, 2000));
    setPaymentStep('SUCCESS');
    
    // Briefly show success before calling API
    await new Promise(r => setTimeout(r, 1000));
    setLoading(true);
    setError('');
    try {
      const res = await createBooking({
        originDepotId: origin,
        destDepotId: destination,
        routeId,
        weight,
        receiverName,
        receiverPhone,
        serviceType: scope
      });
      sessionStorage.setItem(`otp_${res.data.parcel.trackingId}`, res.data.otp);
      sessionStorage.setItem(`qr_${res.data.parcel.trackingId}`, res.data.qrData);
      navigate(`/sender/booking/${res.data.parcel.trackingId}`);
    } catch (err: any) {
      setShowPayment(false);
      setError(err?.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableCities = scope === 'LOCAL' 
    ? cities.filter(c => ['METRO', 'TIER2'].includes(c.type)) 
    : cities;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fadeInUp">
      <div className="mb-8">
        <h2 className="page-header flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-teal-400" />
          </div>
          Book a Parcel
        </h2>
        <p className="page-subheader">Select your service mode and arrange your shipment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl p-6 shadow-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> 1. Select service
                </h3>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setScope('INTERCITY')}
                    className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${scope === 'INTERCITY' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                    <Bus className="w-6 h-6" />
                    <span className="text-sm font-medium">Inter-City (MSRTC)</span>
                    <span className="text-xs opacity-75">Long haul, max {maxWeight}kg</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setScope('LOCAL')}
                    className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${scope === 'LOCAL' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                    <Bus className="w-6 h-6" />
                    <span className="text-sm font-medium">Local City (PMPML)</span>
                    <span className="text-xs opacity-75">Same-day, max {maxWeight}kg</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> 2. Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-xs text-gray-500">Origin City</label>
                    <select value={originCityId} onChange={e => setOriginCityId(e.target.value)} required className="select-field">
                      <option value="">Select Origin City</option>
                      {availableCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    
                    {originCityId && (
                      <>
                        <label className="block text-xs text-gray-500">Origin Depot/Stop</label>
                        <select value={origin} onChange={e => setOrigin(e.target.value)} required className="select-field">
                          <option value="">Select Origin</option>
                          {originDepots.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-xs text-gray-500">Destination City</label>
                    <select value={destCityId} onChange={e => setDestCityId(e.target.value)} required disabled={scope === 'LOCAL'} className="select-field disabled:opacity-50">
                      <option value="">Select Destination City</option>
                      {availableCities.filter(c => scope === 'LOCAL' || c.id !== originCityId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {destCityId && (
                      <>
                        <label className="block text-xs text-gray-500">Destination Depot/Stop</label>
                        <select value={destination} onChange={e => setDestination(e.target.value)} required className="select-field">
                          <option value="">Select Destination</option>
                          {destDepots.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {origin && destination && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <label className="block text-xs text-slate-400 mb-2">Suggested Route</label>
                  {routes.length === 0 ? (
                    <p className="text-sm text-red-400">No {scope} route available between these points. Try another pair.</p>
                  ) : (
                    <div className="space-y-2">
                      {routes.map((r, i) => (
                        <label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${routeId === r.id ? 'border-teal-500 bg-teal-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                          <input type="radio" name="route" value={r.id} checked={routeId === r.id} onChange={(e) => setRouteId(e.target.value)} className="text-teal-500 focus:ring-teal-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{r.name}</p>
                            {i === 0 && <p className="text-xs text-teal-400 mt-0.5">Best match (Score: {r.score?.toFixed(2)})</p>}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-400" /> 3. Parcel & Receiver Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Weight (kg)</label>
                    <input type="number" min="0.1" max={maxWeight} step="0.1" value={weight}
                      onChange={e => {
                        let w = Number(e.target.value);
                        if (w > maxWeight) w = maxWeight;
                        setWeight(w);
                      }} required className="input-field" />
                    <p className="text-xs text-slate-500 mt-1">Max {maxWeight}kg per booking</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Receiver Name</label>
                    <input type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)}
                      placeholder="Full name" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Receiver Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX" required className="input-field pl-10" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading || !routeId} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading
                  ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  : <><ArrowRight className="w-4 h-4" /> Confirm & Pay ₹{total}</>
                }
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-6 border border-teal-500/20 shadow-xl glow-teal">
            <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">Price Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Base Fare</span><span>₹{base}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weight ({weight}kg)</span><span>₹{weightCharge}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Platform Fee</span><span>₹{platformFee}</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between font-bold text-xl text-white">
                <span>Total</span><span className="text-teal-400">₹{total}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Revenue Split</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-teal-400">{scope === 'INTERCITY' ? 'MSRTC' : 'PMPML'} Transit</span><span>₹{transitShare}</span></div>
                <div className="h-1.5 bg-slate-700 rounded-full"><div className="h-1.5 bg-teal-500 rounded-full" style={{ width: '60%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-blue-400">Platform</span><span>₹{platformShare}</span></div>
                <div className="h-1.5 bg-slate-700 rounded-full"><div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '30%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-purple-400">Agent</span><span>₹{agentShare}</span></div>
                <div className="h-1.5 bg-slate-700 rounded-full"><div className="h-1.5 bg-purple-500 rounded-full" style={{ width: '10%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-bounceIn">
            
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-gray-900">Secure Checkout</span>
              </div>
              {paymentStep === 'CARD_ENTRY' && (
                <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              {paymentStep === 'CARD_ENTRY' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Amount to Pay</p>
                    <p className="text-4xl font-bold text-gray-900 mt-1">₹{total}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">Pay by Cash at Depot</h4>
                      <p className="text-xs text-blue-800 mt-1">
                        You can drop off your parcel and pay the amount directly in cash to the depot staff.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={processPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-6 flex items-center justify-center gap-2">
                    Confirm Cash Booking
                  </button>
                </div>
              )}

              {paymentStep === 'PROCESSING' && (
                <div className="text-center py-10 animate-fadeIn flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Processing Payment...</h3>
                  <p className="text-sm text-gray-500 mt-2">Please do not close this window.</p>
                </div>
              )}

              {paymentStep === 'SUCCESS' && (
                <div className="text-center py-10 animate-fadeIn flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Booking Confirmed!</h3>
                  <p className="text-sm text-gray-500 mt-2">Generating your booking receipt...</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> 256-bit SSL Encryption
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
