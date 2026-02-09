import Link from "next/link";
import { person } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-brown-200/50 bg-cream-100/30 mt-20">
      <div className="flex w-full flex-col gap-4 py-8 text-sm text-brown-600 md:flex-row md:items-center md:justify-between">
        <p className="text-brown-700 font-medium">{person.fullName}</p>
        <div className="flex flex-wrap gap-6 text-xs md:text-sm">
          <Link className="hover:text-brown-900 transition-colors" href="/work">
            Work
          </Link>
          <Link className="hover:text-brown-900 transition-colors" href="/education">
            Education
          </Link>
          <Link className="hover:text-brown-900 transition-colors" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

