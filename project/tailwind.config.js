/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-indigo-100',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-900/70',
    'text-indigo-600',
    'bg-emerald-100',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-emerald-900/70',
    'text-emerald-600',
    'border-indigo-100',
    'border-indigo-500',
    'border-emerald-100',
    'border-emerald-500',
  ],
  plugins: [],
};
