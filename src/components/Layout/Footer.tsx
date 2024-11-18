import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">About</h3>
            <p className="mt-2 text-sm text-gray-500">
              Supporting Year 7 students in their mathematical journey through interactive learning and assessment.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Math Tips</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Practice Tests</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Learning Materials</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Support</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Year 7 Mathematics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}