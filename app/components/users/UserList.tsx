'use client'

import { User } from '@/db/schema'

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Components
import UserCard from './UserCard'

interface UserListProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onRefresh: () => void
}

export default function UserList({
  users,
  loading,
  onEdit,
  onRefresh
}: UserListProps) {
  return (
    <Card className='border border-border shadow-sm dark:shadow-md dark:shadow-black/20'>
      <CardHeader className='pb-2'>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your users</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='space-y-2'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        ) : users.length === 0 ? (
          <p className='text-center py-4 text-muted-foreground'>
            No users found
          </p>
        ) : (
          <div className='space-y-4'>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onRefresh}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
