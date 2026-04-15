"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about",    label: "About"    },
  { href: "/services", label: "Services" },
  { href: "/people",   label: "People"   },
  { href: "/projects", label: "Projects" },
  { href: "/culture",  label: "Culture"  },
  { href: "/careers",  label: "Careers"  },
  { href: "/contact",  label: "Contact"  },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-700 shrink-0">
          Apex Talent Group
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-gray-600 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap hover:text-brand-700 transition ${
                pathname === l.href ? "text-brand-700 font-semibold" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/careers"
            className="shrink-0 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition ml-2"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
