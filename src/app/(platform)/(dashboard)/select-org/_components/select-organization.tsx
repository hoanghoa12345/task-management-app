"use client";

import React, { useState } from 'react';
import { useOrganization } from "@/hooks/use-organization";
import { Organization } from '@/components/organization/organization';
import { useOrganizationList } from '@/hooks/use-organization-list';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SelectOrganization: React.FC = () => {
  const { organization } = useOrganization();
  const { usersMemberships } = useOrganizationList();
  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >(organization);
  const organizations = usersMemberships || [];
  const router = useRouter();

  const navigateToOrganization = () => {
    if (selectedOrganization) {
      router.push(`/organization/${selectedOrganization.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Organization</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose the organization you want to manage or view.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization) => (
            <div
              key={organization.id}
              onClick={() => setSelectedOrganization(organization)}
              className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer border-2 ${
                selectedOrganization?.id === organization.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={organization?.imageUrl || ""}
                  alt={organization?.name || ""}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{organization.name}</h2>
                <div className="mt-3 flex items-center justify-between">
                  {selectedOrganization?.id === organization.id && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            disabled={setSelectedOrganization === null}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
              selectedOrganization !== null
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            onClick={navigateToOrganization}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectOrganization;