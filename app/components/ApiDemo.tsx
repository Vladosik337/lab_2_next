'use client'

import { useState } from 'react'
import { User } from '@/db/schema'
import { useUsers, usePosts } from '@/app/hooks/useApi'
import { PostWithAuthor } from '@/app/types'
import UserForm from './users/UserForm'
import UserList from './users/UserList'
import PostForm from './posts/PostForm'
import PostList from './posts/PostList'
import { Toaster } from '@/components/ui/sonner'

export default function ApiDemo() {
  const { users, isLoading: usersLoading, mutate: refreshUsers } = useUsers()
  const { posts, isLoading: postsLoading, mutate: refreshPosts } = usePosts()

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingPost, setEditingPost] = useState<PostWithAuthor | null>(null)

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleEditPost = (post: PostWithAuthor) => {
    setEditingPost(post)
  }

  const handleUserSuccess = () => {
    setEditingUser(null)
    refreshUsers()
  }

  const handlePostSuccess = () => {
    setEditingPost(null)
    refreshPosts()
  }

  return (
    <div className='container mx-auto p-4 space-y-8'>
      <Toaster />
      <h1 className='text-3xl font-bold text-center'>API Demo</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Users Section */}
        <div className='space-y-6'>
          <UserForm
            user={editingUser || undefined}
            onSuccess={handleUserSuccess}
          />

          <UserList
            users={users}
            loading={usersLoading}
            onEdit={handleEditUser}
            onRefresh={refreshUsers}
          />
        </div>

        {/* Posts Section */}
        <div className='space-y-6'>
          <PostForm
            post={editingPost || undefined}
            users={users}
            onSuccess={handlePostSuccess}
          />

          <PostList
            posts={posts}
            loading={postsLoading}
            onEdit={handleEditPost}
            onRefresh={refreshPosts}
          />
        </div>
      </div>
    </div>
  )
}
