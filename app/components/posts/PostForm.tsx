'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@/db/schema'
import { usePostMutations } from '@/app/hooks/useApi'
import { PostWithAuthor, PostFormValues } from '@/app/types'

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

// Form schema
export const postFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  author_id: z.string().uuid('Please select an author')
})

interface PostFormProps {
  post?: PostWithAuthor
  users: User[]
  onSuccess: () => void
}

export default function PostForm({ post, users, onSuccess }: PostFormProps) {
  const isEditing = !!post
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createPost, updatePost } = usePostMutations()

  // Setup form with React Hook Form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      author_id: post?.author_id || ''
    }
  })

  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true)

    try {
      if (isEditing && post) {
        await updatePost(post.id, data)
      } else {
        await createPost(data)
      }

      // Reset form and notify parent
      form.reset()
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='border border-border shadow-sm dark:shadow-md dark:shadow-black/20'>
      <CardHeader className='pb-2'>
        <CardTitle>{isEditing ? 'Edit Post' : 'Create Post'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update an existing post'
            : 'Add a new post to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Post title'
                      {...field}
                      className='dark:bg-secondary/50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your post content here...'
                      className='min-h-32 dark:bg-secondary/50'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='author_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Author</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='dark:bg-secondary/50 dark:border-border'>
                        <SelectValue placeholder='Select an author' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='dark:bg-card dark:border-border'>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} (@{user.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2 pt-2'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90'
              >
                {isSubmitting
                  ? 'Submitting...'
                  : isEditing
                    ? 'Update Post'
                    : 'Create Post'}
              </Button>

              {isEditing && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    form.reset()
                    onSuccess()
                  }}
                  className='dark:border-border dark:text-foreground dark:hover:bg-secondary/80'
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
