'use client';

import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Small delay to give tactile feedback
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error ?? 'Login failed.');
      }
      setIsSubmitting(false);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/machine-logo.png"
            alt="The Machine"
            width={135}
            height={24}
            className="h-[21px] w-auto"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-aeonik-fono text-brand-orange text-xs tracking-[0.2em] uppercase text-center mb-8">
          Visit California RFP Agent
        </h1>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-aeonik-fono text-gray-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
              className="w-full bg-dark-grey border border-grey-line rounded-lg px-4 py-3 text-sm text-white font-beausite placeholder:text-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-aeonik-fono text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full bg-dark-grey border border-grey-line rounded-lg px-4 py-3 text-sm text-white font-beausite placeholder:text-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm font-aeonik-fono" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-orange hover:bg-orange-700 disabled:opacity-50 text-white font-aeonik-fono text-sm uppercase tracking-wider py-3 rounded-lg transition-colors mt-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs font-aeonik-fono mt-8">
          Access is limited to authorized organizations.
        </p>
      </div>
    </div>
  );
}
