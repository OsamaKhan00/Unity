'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobFormData {
  title: string;
  company: string;
  type: string;
  vertical: string;
  salary: string;
  description: string;
}

interface Props {
  jobId?: string;
  initialData?: JobFormData;
}

const defaultForm: JobFormData = {
  title: '',
  company: '',
  type: 'Full-time',
  vertical: 'IT & Software',
  salary: '',
  description: '',
};

export default function JobForm({ jobId, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<JobFormData>(initialData ?? defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof JobFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(
        jobId ? `/api/admin/jobs/${jobId}` : '/api/admin/jobs',
        {
          method: jobId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error('Failed to save');
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className={inputClass}
          placeholder="e.g. Senior Software Engineer (Full Stack)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Company / Location
        </label>
        <input
          type="text"
          required
          value={form.company}
          onChange={(e) => set('company', e.target.value)}
          className={inputClass}
          placeholder="e.g. Confidential — Seattle, WA"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className={inputClass}
          >
            <option>Full-time</option>
            <option>Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Vertical</label>
          <select
            value={form.vertical}
            onChange={(e) => set('vertical', e.target.value)}
            className={inputClass}
          >
            <option>IT &amp; Software</option>
            <option>Data Center</option>
            <option>Pharmaceutical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary / Rate</label>
        <input
          type="text"
          required
          value={form.salary}
          onChange={(e) => set('salary', e.target.value)}
          className={inputClass}
          placeholder="e.g. $130K–$170K or $90–$110/hr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description</label>
        <textarea
          required
          rows={7}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Describe the role, responsibilities, and requirements…"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition"
        >
          {saving ? 'Saving…' : jobId ? 'Update Job' : 'Create Job'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
