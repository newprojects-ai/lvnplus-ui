import React, { useState } from 'react';
import { PlusCircle, Pencil, UserCircle } from 'lucide-react';
import { ChildProfile } from '../../types/parent';
import { ChildProfileForm } from './ChildProfileForm';

export function ChildProfiles() {
  const [showForm, setShowForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);

  const handleSave = (profile: ChildProfile) => {
    if (selectedChild) {
      setProfiles(profiles.map(p => 
        p.id === profile.id ? profile : p
      ));
    } else {
      setProfiles([...profiles, profile]);
    }
    setShowForm(false);
    setSelectedChild(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Child Profiles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5" />
          Add Child
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <ChildProfileForm
              initialData={selectedChild}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedChild(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <UserCircle className="h-12 w-12 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">Grade {profile.gradeLevel}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedChild(profile);
                  setShowForm(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">School</h4>
                <p className="text-sm text-gray-600">{profile.school}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Curriculum</h4>
                <p className="text-sm text-gray-600">{profile.curriculum}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Subjects</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.subjects.map(subject => (
                    <span
                      key={subject.id}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                    >
                      {subject.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}