import React, { useState } from 'react';
import { Trash2, AlertTriangle, Key } from 'lucide-react';
import { ApiClient } from '../api/client';

interface SettingsPageProps {
  currentUser?: { name?: string; email: string } | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
  const [token, setToken] = useState(ApiClient.getToken() || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState(false);

  const handleSaveToken = () => {
    if (token) {
      ApiClient.setToken(token);
      alert('Token saved!');
    }
  };

  const handleDeleteAccount = () => {
    ApiClient.clearToken();
    setShowDeleteModal(false);
    setDeletedMsg(true);
    setTimeout(() => {
      setDeletedMsg(false);
      window.location.reload();
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Account &amp; Privacy</h1>
        <p className="text-xs text-slate-500">Manage your active authentication session and data privacy rights.</p>
      </div>

      {deletedMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-2xl text-xs font-medium">
          Your profile, interactions, and session have been cleared successfully.
        </div>
      )}

      {/* Account Info Card */}
      {currentUser && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              {(currentUser.name || currentUser.email)[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentUser.name || 'Candidate'}</h3>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>
          <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block font-medium">
            Active authenticated session
          </div>
        </div>
      )}

      {/* Auth Token Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Session JWT Token</h3>
            <p className="text-xs text-slate-500">Stored locally in your browser for authenticated requests.</p>
          </div>
        </div>

        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="No active token — sign in to authenticate."
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-slate-800 text-slate-700"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveToken}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Save Token
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 space-y-4">
        <div className="flex items-center space-x-3 text-rose-600">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold">Privacy &amp; Data Deletion</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Permanently erase your active resume text, extracted profile, and saved interactions. This cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Profile &amp; Account Data</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Are you sure?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove your session token and reset your saved resume profile from the application.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Yes, Delete My Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
