import { Post, User } from '@/db/schema'
import {
  CreateUserData,
  UpdateUserData,
  CreatePostData,
  UpdatePostData,
  PostWithAuthor
} from '../types'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }

  return response.json()
}

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}

// Post API
export async function fetchPosts(): Promise<PostWithAuthor[]> {
  const response = await fetch('/api/posts')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return response.json()
}

export async function updatePost(
  id: string,
  data: UpdatePostData
): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  return response.json()
}

export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
}
