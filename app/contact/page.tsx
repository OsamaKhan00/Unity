const socials = [
  {
    name: "LinkedIn",
    handle: "@ApexTalentGroup",
    href: "https://linkedin.com",
    color: "bg-[#0077B5] hover:bg-[#005f90]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "@ApexTalentGroup",
    href: "https://facebook.com",
    color: "bg-[#1877F2] hover:bg-[#1558b8]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@ApexTalentGroup",
    href: "https://instagram.com",
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "Indeed",
    handle: "Apex Talent Group",
    href: "https://indeed.com",
    color: "bg-[#003A9B] hover:bg-[#002d79]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm1.3 15.6c-.1.6-.5 1-1.1 1.2-.2.1-.5.1-.7.1-.9 0-1.6-.6-1.6-1.5 0-.2 0-.4.1-.6l1.1-6.5h2.1l-1.2 6.8c0 .2 0 .3.1.4.1.1.2.1.4.1s.4-.1.5-.2l.3 1.2z"/>
      </svg>
    ),
  },
  {
    name: "Monster",
    handle: "Apex Talent Group",
    href: "https://monster.com",
    color: "bg-[#7B2FBE] hover:bg-[#5e248f]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5c-4.136 0-7.5-3.364-7.5-7.5S7.864 4.5 12 4.5s7.5 3.364 7.5 7.5-3.364 7.5-7.5 7.5z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-14 px-6">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Get In Touch</p>
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Whether you're a company looking to hire or a candidate ready for your next role — we'd love to hear from you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Contact form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold mb-5">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" placeholder="Your name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a…</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option>Candidate looking for work</option>
                <option>Company looking to hire</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} placeholder="How can we help?" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
            <button type="submit" className="w-full bg-brand-600 text-white font-semibold py-3 rounded-lg hover:bg-brand-700 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Info + Socials */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-900">Location:</span> Seattle Metropolitan Area, WA</p>
              <p><span className="font-medium text-gray-900">Email:</span> hello@apextalentgroup.com</p>
              <p><span className="font-medium text-gray-900">Phone:</span> (206) 555-0192</p>
              <p><span className="font-medium text-gray-900">Hours:</span> Mon–Fri, 8:00 AM – 6:00 PM PT</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Find Us Online</h2>
            <div className="space-y-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-white rounded-lg px-4 py-3 transition ${s.color}`}
                >
                  {s.icon}
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs opacity-80">{s.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
