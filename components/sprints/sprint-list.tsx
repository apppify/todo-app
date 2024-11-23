'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
              <CardTitle>{sprint.name}</CardTitle>
              <CardDescription>{sprint.team?.name} team</CardDescription>
              <CardDescription>{'xx'} tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Click to view team tasks</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  )
}
