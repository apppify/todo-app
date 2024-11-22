
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NewSprintModal from '@/components/sprints/teams-modal'
import { TeamCombo } from './team-combo'
import { SprintOptionsDropdown } from './sprint-options-dropdown'

// This would be replaced with actual database calls
const mockTeams = [
  { id: '1', name: 'Development Team', taskCount: 10 },
  { id: '2', name: 'Marketing Team', taskCount: 5 },
  { id: '3', name: 'Design Team', taskCount: 8 },
]

export const Sprints = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sprints</h1>

        <div className="inline-flex items-center gap-3">
          <NewSprintModal />
          <TeamCombo />
          <SprintOptionsDropdown />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map((team) => (
          <Link href={`/${team.id}`} key={team.id}>
            <Card>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>{team.taskCount} tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Click to view team tasks</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
