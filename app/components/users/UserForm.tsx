'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@/db/schema'
import { useUserMutations } from '@/app/hooks/useApi'
import { UserFormValues } from '@/app/types'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

// Form schema
export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-z0-9_-]+$/,
      'Username can only contain letters, numbers, - and _'
    ),
  password: z.string().optional()
})

interface UserFormProps {
  user?: User
  onSuccess: () => void
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const isEditing = !!user
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createUser, updateUser } = useUserMutations()

  // Setup form with React Hook Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      password: '' // We don't include password in edit mode
    }
  })

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true)

    try {
      if (isEditing && user) {
        // We don't need password for update
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = data
        await updateUser(user.id, updateData)
      } else {
        await createUser(data)
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
        <CardTitle>{isEditing ? 'Edit User' : 'Create User'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update an existing user'
            : 'Add a new user to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Full name'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Email address'
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
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium'>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Username'
                      {...field}
                      className='dark:bg-secondary/50'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Password'
                        {...field}
                        className='dark:bg-secondary/50'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='flex gap-2 pt-2'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90'
              >
                {isSubmitting
                  ? 'Submitting...'
                  : isEditing
                    ? 'Update User'
                    : 'Create User'}
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
