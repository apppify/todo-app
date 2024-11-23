'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circule-progress"
import { getSprintsWithTeam } from "@/lib/db/queries"
import Link from 'next/link'
import { use } from "react"

type SprintListProps = {
  sprintsPromise: ReturnType<typeof getSprintsWithTeam>
}

export const SprintList: React.FC<SprintListProps> = ({ sprintsPromise }) => {
  const sprints = use(sprintsPromise)

  return (
    <>
      {sprints.map((sprint) => (
        <Link href={`/${sprint.id}`} key={sprint.id}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CircularProgress value={35} strokeWidth={5} size="sm" />
                <div className="flex-1 flex-col">
                  <CardTitle>{sprint.name}</CardTitle>
                  <CardDescription>{sprint.team?.name} team</CardDescription>
                </div>
              </div>
            </CardHeader>
            {/* <CardContent>
              <p>Click to view team tasks</p>
            </CardContent> */}
          </Card>
        </Link>
      ))}
    </>
  )
}
