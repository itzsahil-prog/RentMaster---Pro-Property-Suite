
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property, PropertyType } from '../types';
import { Icons } from '../constants';

const PropertyTypeCard: React.FC<{ type: PropertyType; icon: React.ReactNode }> = ({ type, icon }) => (
  <Link to={`/search?type=${type}`} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
    <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-4">
      {icon}
    </div>
    <span className="font-semibold text-slate-700">{type}</span>
  </Link>
);

const LandingPage: React.FC<{ properties: Property[] }> = ({ properties }) => {
  const featured = properties.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-slate-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="hero"
        />
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            Find Your Next <br/><span className="text-blue-400 underline decoration-blue-500">Living Space</span>
          </h1>
          <p className="text-xl text-slate-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Streamline your rental search with RentMaster. From cozy PGs to luxury apartments, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/search" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl">
              Start Searching
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-xl">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Property Type</h2>
            <p className="text-slate-500">Choose the living experience that fits your lifestyle</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <PropertyTypeCard type={PropertyType.HOTEL} icon={<Icons.Home />} />
            <PropertyTypeCard type={PropertyType.HOSTEL} icon={<Icons.Home />} />
            <PropertyTypeCard type={PropertyType.PG} icon={<Icons.Home />} />
            <PropertyTypeCard type={PropertyType.APARTMENT} icon={<Icons.Home />} />
            <PropertyTypeCard type={PropertyType.HOME} icon={<Icons.Home />} />
            <PropertyTypeCard type={PropertyType.FLAT} icon={<Icons.Home />} />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Recommendations</h2>
              <p className="text-slate-500">Hand-picked premium listings for you</p>
            </div>
            <Link to="/search" className="text-blue-600 font-semibold hover:underline">View All &rarr;</Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((p) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="relative h-64 overflow-hidden rounded-2xl mb-4">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase">
                    {p.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white">
                    ${p.price}/mo
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <Icons.Map />
                  <span>{p.city}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icons.Star />
                    <span className="font-bold text-slate-900">{p.rating}</span>
                  </div>
                  <span className="text-slate-400">({p.reviewsCount} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold mb-2">15k+</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">50k+</div>
              <div className="text-blue-100">Happy Tenants</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">200+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">24/7</div>
              <div className="text-blue-100">Support Availability</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
