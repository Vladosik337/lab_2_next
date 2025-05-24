import { db, users } from '@/db/schema/prepare'
import { userInsertSchema } from '@/db/schema/user.schema'
import { desc, isNull } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
      .from(users)
      .orderBy(desc(users.created_at))
      .where(isNull(users.deleted_at))

    console.log(allUsers)

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = userInsertSchema.parse(body)

    const newUser = await db.insert(users).values(validatedData).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      username: users.username,
      created_at: users.created_at
    })

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    )
  }
}
