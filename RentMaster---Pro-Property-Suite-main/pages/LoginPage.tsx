
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Icons } from '../constants';

const LoginPage: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    onLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-200">
            <Icons.Home />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Choose your account type to continue</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleLogin(UserRole.TENANT)}
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icons.User />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">I am a Tenant</p>
                <p className="text-sm text-slate-500">Find and manage your home</p>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-blue-600">&rarr;</div>
          </button>

          <button 
            onClick={() => handleLogin(UserRole.OWNER)}
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icons.Home />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">I am a Property Owner</p>
                <p className="text-sm text-slate-500">List and manage your units</p>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-blue-600">&rarr;</div>
          </button>
        </div>

        <p className="text-center text-slate-400 mt-10 text-sm">
          New to RentMaster? <a href="#" className="text-blue-600 font-bold hover:underline">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
