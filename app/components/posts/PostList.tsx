'use client'

import { PostWithAuthor } from '@/app/types'

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
import PostCard from './PostCard'

interface PostListProps {
  posts: PostWithAuthor[]
  loading: boolean
  onEdit: (post: PostWithAuthor) => void
  onRefresh: () => void
}

export default function PostList({
  posts,
  loading,
  onEdit,
  onRefresh
}: PostListProps) {
  return (
    <Card className='border border-border shadow-sm dark:shadow-md dark:shadow-black/20'>
      <CardHeader className='pb-2'>
        <CardTitle>Posts</CardTitle>
        <CardDescription>Manage your posts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='space-y-2'>
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
          </div>
        ) : posts.length === 0 ? (
          <p className='text-center py-4 text-muted-foreground'>
            No posts found
          </p>
        ) : (
          <div className='space-y-4'>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
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
