import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-espressoy text-creamy w-full py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Holidaze</h2>
          <p className="text-sm text-creamy/80">
            Where your next adventure begins. Explore, book, and relax with venues made for wanderers.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-creamy uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline hover:text-sunny">Home</a></li>
            <li><a href="#" className="hover:underline hover:text-sunny">Venues</a></li>
            <li><a href="#" className="hover:underline hover:text-sunny">Bookings</a></li>
            <li><a href="#" className="hover:underline hover:text-sunny">My Account</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="font-semibold text-creamy uppercase tracking-wide text-sm">Follow Us</h3>
          <div className="flex gap-4 text-creamy text-lg">
            <a href="#" aria-label="Facebook" className="hover:text-sunny">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-sunny">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sunny">
              <FaTwitter />
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-sunny">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-creamy/20 text-sm text-center text-creamy/60">
        <p>© {new Date().getFullYear()} Holidaze. All rights reserved.</p>
        <p className="italic text-xs">Still snooping, huh? We see you 👀</p>
      </div>
    </footer>
  );
}
