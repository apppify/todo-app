import { Suspense } from 'react';

import { getAllTeams, getSprintsWithTeam } from '@/lib/db/queries';

import { AddSprintModal } from './add-sprint-modal';
import { SprintList } from './sprint-list';
import { SprintOptionsDropdown } from './sprint-options-dropdown';
import { TeamCombo } from './team-combo';

export const Sprints = () => {
  const teams = getAllTeams();
  const sprints = getSprintsWithTeam();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sprints</h1>

        <div className="inline-flex items-center gap-3">
          <AddSprintModal teams={teams} />

          <Suspense>
            <TeamCombo teams={teams} />
          </Suspense>

          <SprintOptionsDropdown />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          <SprintList sprintsPromise={sprints} />
        </Suspense>
      </div>
    </div>
  );
};
