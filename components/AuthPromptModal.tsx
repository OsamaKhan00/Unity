'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestClick: () => void;
  context: 'home' | 'apply';
}

export default function AuthPromptModal({ isOpen, onClose, onGuestClick, context }: AuthPromptModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isApply = context === 'apply';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid sm:grid-cols-2">
          {/* Left: Sign Up */}
          <div className="flex flex-col items-center text-center p-8 gap-5 border-b sm:border-b-0 sm:border-r border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isApply ? 'Already a Member?' : 'Join Our Platform'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isApply
                ? 'Sign up or sign in to apply and track your applications in one place.'
                : 'Create an account to save jobs and get matched with the right opportunities.'}
            </p>
            <button
              onClick={() => { onClose(); router.push('/register'); }}
              className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-700 transition text-sm tracking-widest uppercase"
            >
              Sign Up
            </button>
          </div>

          {/* Right: Guest */}
          <div className="flex flex-col items-center text-center p-8 gap-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {isApply ? 'Apply as a Guest' : 'Just Browsing?'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isApply
                ? 'Not ready for a commitment yet? Submit your resume as a guest.'
                : 'No commitment needed. Explore our open positions at your own pace.'}
            </p>
            <button
              onClick={onGuestClick}
              className="w-full border-2 border-gray-900 text-gray-900 font-semibold py-3 px-6 rounded-full hover:bg-gray-50 transition text-sm tracking-widest uppercase"
            >
              {isApply ? 'Apply as Guest' : 'Continue as Guest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
