import { Post as SchemaPost, User } from '@/db/schema'
import { z } from 'zod'
import { postFormSchema } from '../components/posts/PostForm'
import { userFormSchema } from '../components/users/UserForm'

// Extended types
export type PostWithAuthor = SchemaPost & {
  author?: User
}

// Form value types
export type UserFormValues = z.infer<typeof userFormSchema>
export type PostFormValues = z.infer<typeof postFormSchema>

// API mutation types
export type CreateUserData = UserFormValues
export type UpdateUserData = Omit<UserFormValues, 'password'>
export type CreatePostData = PostFormValues
export type UpdatePostData = PostFormValues

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}
