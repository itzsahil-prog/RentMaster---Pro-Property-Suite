
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, User } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';

const PropertyDetails: React.FC<{ user: User | null; properties: Property[] }> = ({ user, properties }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const [bookingDate, setBookingDate] = useState('');
  const [agreementDraft, setAgreementDraft] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!property) return <div className="text-center py-20">Property not found.</div>;

  const handleGenerateAgreement = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoadingAi(true);
    const draft = await geminiService.generateRentalAgreement(property, user.name, property.price);
    setAgreementDraft(draft);
    setLoadingAi(false);
  };

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-[450px] relative">
                <img src={property.imageUrl} className="w-full h-full object-cover" alt={property.name} />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 uppercase shadow-xl">{property.type}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">{property.name}</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                      <Icons.Map />
                      <span>{property.address}, {property.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
                    <Icons.Star />
                    <span className="text-lg font-bold">{property.rating}</span>
                    <span className="text-slate-400">({property.reviewsCount})</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none mb-10">
                  <h3 className="text-xl font-bold mb-4">About this property</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{property.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-xl font-bold mb-6">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.amenities.map(a => (
                      <div key={a} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-700 font-semibold group hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Icons.Check />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {agreementDraft && (
              <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-blue-200 shadow-sm animate-in slide-in-from-bottom duration-500">
                <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <Icons.Search /> AI-Generated Draft Agreement
                </h3>
                <div className="bg-slate-50 p-6 rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700 border border-slate-200">
                  {agreementDraft}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                   <button onClick={() => setAgreementDraft('')} className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600">Dismiss</button>
                   <button className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Proceed to e-Sign</button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-24">
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900">${property.price}</span>
                <span className="text-slate-400 font-medium mb-1">/month</span>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Check-in Date</label>
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Room Preference</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <option>Standard Unit</option>
                    <option>Premium Unit (+$200)</option>
                    <option>Shared Unit (-$300)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
                  Book This Space
                </button>
                <button 
                  onClick={handleGenerateAgreement}
                  disabled={loadingAi}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  {loadingAi ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  )}
                  Preview Agreement (AI)
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <img src={`https://picsum.photos/seed/${property.ownerId}/100/100`} className="w-14 h-14 rounded-2xl" alt="" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Owner</p>
                    <p className="text-lg font-bold text-slate-900">Sarah Landlord</p>
                  </div>
                </div>
                <button className="w-full p-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                   <Icons.MessageSquare /> Contact Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
