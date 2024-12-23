import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ZodError } from 'zod';
import axios from 'axios';
import { Role } from '../../types/auth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, role: selectedRole });
      const intendedPath = location.state?.from?.pathname || '/';
      navigate(intendedPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof ZodError) {
        setError('Please check your email and password format');
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center space-x-4 mb-8">
          {['Student', 'Parent', 'Tutor', 'Admin'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role as Role)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                selectedRole === role
                  ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-indigo-200'
              }`}
            >
              <UserCircle className={`h-6 w-6 mb-2 ${
                selectedRole === role ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <span className="text-sm font-medium">{role}</span>
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {location.state?.message && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{location.state.message}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <div className="flex items-center justify-center">
                  Sign in as {selectedRole}
                  <LogIn className="ml-2 -mr-1 h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}