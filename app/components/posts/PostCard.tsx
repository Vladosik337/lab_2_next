'use client'

import { useState } from 'react'
import { usePostMutations } from '@/app/hooks/useApi'
import { PostWithAuthor } from '@/app/types'
import { Edit, Trash2, Clock, User } from 'lucide-react'

// UI Components
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  post: PostWithAuthor
  onEdit: (post: PostWithAuthor) => void
  onDelete: () => void
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deletePost } = usePostMutations()

  // Handle post deletion
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePost(post.id)
      onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className='overflow-hidden border border-border dark:bg-secondary/30 transition-all duration-200 hover:shadow-md dark:hover:shadow-secondary/10 group'>
      <CardContent className='p-5'>
        <div className='space-y-3'>
          <div className='flex justify-between items-start gap-4'>
            <h3 className='font-semibold text-lg group-hover:text-primary transition-colors duration-200'>
              {post.title}
            </h3>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onEdit(post)}
                className='h-8 w-8 text-muted-foreground hover:text-primary'
                aria-label='Edit post'
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                disabled={isDeleting}
                onClick={handleDelete}
                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                aria-label='Delete post'
              >
                <Trash2
                  className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`}
                />
              </Button>
            </div>
          </div>

          <div className='relative'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {post.content.length > 150
                ? `${post.content.substring(0, 150)}...`
                : post.content}
            </p>
            {post.content.length > 150 && (
              <div className='absolute bottom-0 right-0 bg-gradient-to-l from-background dark:from-secondary/30 to-transparent w-16 h-full'></div>
            )}
          </div>
        </div>
      </CardContent>

      <Separator className='dark:bg-border opacity-50' />

      <CardFooter className='p-4 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <User className='h-3.5 w-3.5 text-muted-foreground' />
          <p className='text-xs text-muted-foreground'>
            {post.author?.name || post.author_id}
          </p>
        </div>

        <Badge variant='outline' className='text-xs font-normal px-2 py-0 h-5'>
          <Clock className='h-3 w-3 mr-1' />
          {new Date().toLocaleDateString()}
        </Badge>
      </CardFooter>
    </Card>
  )
}
