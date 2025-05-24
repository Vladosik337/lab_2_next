'use client'

import { useState } from 'react'
import { User } from '@/db/schema'
import { useUserMutations } from '@/app/hooks/useApi'

// UI Components
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: () => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteUser } = useUserMutations()

  // Handle user deletion
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteUser(user.id)
      onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className='overflow-hidden border border-border dark:bg-secondary/30'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='font-medium'>{user.name}</h3>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
            <p className='text-xs text-muted-foreground'>@{user.username}</p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onEdit(user)}
              className='dark:border-border dark:text-foreground dark:hover:bg-secondary/80'
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              disabled={isDeleting}
              onClick={handleDelete}
              className='dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
