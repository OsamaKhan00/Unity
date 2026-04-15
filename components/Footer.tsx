import Link from "next/link";

const links = [
  { label: "About",    href: "/about"    },
  { label: "Services", href: "/services" },
  { label: "People",   href: "/people"   },
  { label: "Projects", href: "/projects" },
  { label: "Culture",  href: "/culture"  },
  { label: "Careers",  href: "/careers"  },
  { label: "Contact",  href: "/contact"  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">Apex Talent Group</p>
            <p className="text-sm max-w-xs">
              Precision recruitment across IT, Data Center, and Pharmaceutical industries. Based in Seattle, WA.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Navigation</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-3">Contact</p>
            <div className="space-y-1.5 text-sm">
              <p>Seattle Metropolitan Area, WA</p>
              <p>hello@apextalentgroup.com</p>
              <p>(206) 555-0192</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} Apex Talent Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
