
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Property, PropertyType } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';

const SearchPage: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.city.toLowerCase().includes(query.toLowerCase());
      const matchesType = selectedType === 'All' || p.type === selectedType;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesType && matchesPrice;
    });
  }, [properties, query, selectedType, maxPrice]);

  const handleAiAsk = async () => {
    if (!query) return;
    setAiLoading(true);
    const rec = await geminiService.recommendProperties(query, properties);
    setAiRecommendation(rec);
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                {Object.values(PropertyType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Max Budget</label>
                <span className="text-sm font-bold text-blue-600">${maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Amenities</label>
              {['WiFi', 'Parking', 'Pool', 'Gym'].map(amenity => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-grow">
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Icons.Search />
            </div>
            <input 
              type="text"
              placeholder="Search by city, name, or describe your ideal home..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiAsk()}
              className="w-full pl-12 pr-24 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
            />
            <button 
              onClick={handleAiAsk}
              disabled={aiLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              )}
              Ask AI
            </button>
          </div>

          {aiRecommendation && (
            <div className="mb-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-900 relative animate-in slide-in-from-top duration-300">
              <button onClick={() => setAiRecommendation('')} className="absolute top-4 right-4 text-blue-400 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold mb-2">RentMaster AI Concierge</h3>
                  <p className="text-sm leading-relaxed">{aiRecommendation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500 font-medium">{filteredProperties.length} results found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select className="bg-transparent font-semibold outline-none cursor-pointer text-slate-900">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(p => (
                <Link key={p.id} to={`/property/${p.id}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase">{p.type}</span>
                    </div>
                    <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-slate-600 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{p.name}</h3>
                      <div className="flex items-center gap-1">
                        <Icons.Star />
                        <span className="text-sm font-bold">{p.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <Icons.Map />
                      <span>{p.city}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <div>
                        <span className="text-xl font-bold text-slate-900">${p.price}</span>
                        <span className="text-slate-400 text-xs">/month</span>
                      </div>
                      <div className="flex gap-1">
                        {p.amenities.slice(0, 3).map(a => (
                          <div key={a} className="p-1.5 bg-slate-50 rounded-md text-slate-400" title={a}>
                            <Icons.Check />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-slate-300 mb-4 flex justify-center"><Icons.Search /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
