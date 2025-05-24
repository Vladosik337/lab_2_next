'use client'

import useSWR from 'swr'
import { toast } from 'sonner'
import { User } from '@/db/schema'
import * as api from '../services/api'
import {
  PostWithAuthor,
  CreateUserData,
  UpdateUserData,
  CreatePostData,
  UpdatePostData
} from '../types'

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>('/api/users')

  return {
    users: data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export function usePosts() {
  const { data, error, isLoading, mutate } =
    useSWR<PostWithAuthor[]>('/api/posts')

  return {
    posts: data || [],
    isLoading,
    isError: error,
    mutate
  }
}

export function useUserMutations() {
  const { mutate } = useUsers()

  const createUser = async (data: CreateUserData) => {
    try {
      await api.createUser(data)
      mutate()
      toast.success('User created successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  const updateUser = async (id: string, data: UpdateUserData) => {
    try {
      await api.updateUser(id, data)
      mutate()
      toast.success('User updated successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await api.deleteUser(id)
      mutate()
      toast.success('User deleted successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  return {
    createUser,
    updateUser,
    deleteUser
  }
}

export function usePostMutations() {
  const { mutate } = usePosts()

  const createPost = async (data: CreatePostData) => {
    try {
      await api.createPost(data)
      mutate()
      toast.success('Post created successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  const updatePost = async (id: string, data: UpdatePostData) => {
    try {
      await api.updatePost(id, data)
      mutate()
      toast.success('Post updated successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  const deletePost = async (id: string) => {
    try {
      await api.deletePost(id)
      mutate()
      toast.success('Post deleted successfully')
      return true
    } catch (error) {
      toast.error((error as Error).message)
      return false
    }
  }

  return {
    createPost,
    updatePost,
    deletePost
  }
}
