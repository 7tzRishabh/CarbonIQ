import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Shield, Calendar, Award } from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const { user, ecoPoints } = useAuth();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account and view your green progress.</p>
      </header>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 bg-gray-100 flex-shrink-0">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{user?.displayName || "Eco Warrior"}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
              <Mail className="w-4 h-4" /> {user?.email}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-700">{ecoPoints} Eco Points</span>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="font-medium text-sm">Standard Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">{user?.displayName}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">{user?.email}</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Created</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '-'}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 mt-6">
              <button className="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-colors text-sm">Delete Account Details</button>
          </div>
      </div>
    </div>
  );
}
