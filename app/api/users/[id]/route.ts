import { NextRequest, NextResponse } from 'next/server'
import { db, users } from '@/db/schema/prepare'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// User schema for validation
const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).optional()
})

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PATCH /api/users/[id] - Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()

    // Check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate the request body
    const validatedData = userUpdateSchema.parse(body)

    // Update the user
    const updatedUser = await db
      .update(users)
      .set({
        ...validatedData,
        updated_at: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        updated_at: users.updated_at
      })

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 400 }
    )
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Soft delete the user by setting deleted_at
    await db
      .update(users)
      .set({
        deleted_at: new Date()
      })
      .where(eq(users.id, userId))

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
