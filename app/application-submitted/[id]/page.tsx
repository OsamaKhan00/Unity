'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const applicationId = params.id as string;
  const jobTitle = searchParams.get('job') ?? 'the position';
  const firstName = searchParams.get('name') ?? '';
  const email = searchParams.get('email') ?? '';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Application Submitted!</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {firstName ? `Thanks ${firstName} — we` : 'We'}&apos;ve received your application and will be in touch soon.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Position</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">{jobTitle}</span>
            </div>
            {email && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Confirmation sent to</span>
                <span className="font-medium text-gray-900">{email}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{applicationId}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 text-sm text-gray-500">
            A confirmation email has been sent to your inbox. You can track the status of this application at any time from <strong>My Applications</strong>.
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              href="/my-applications"
              className="flex-1 text-center bg-brand-600 text-white font-semibold py-2.5 rounded-lg hover:bg-brand-700 transition text-sm"
            >
              Track My Application
            </Link>
            <Link
              href="/careers"
              className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSubmittedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
