import { NextRequest, NextResponse } from 'next/server'
import { db, posts, users } from '@/db/schema/prepare'
import { desc, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'

// Post schema for validation
const postInsertSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  author_id: z.string().uuid()
})

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author_id: posts.author_id,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author: {
          id: users.id,
          name: users.name,
          username: users.username
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.author_id, users.id))
      .where(isNull(posts.deleted_at))
      .orderBy(desc(posts.created_at))

    return NextResponse.json(allPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = postInsertSchema.parse(body)

    // Insert the new post
    const newPost = await db.insert(posts).values(validatedData).returning({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      author_id: posts.author_id,
      created_at: posts.created_at
    })

    return NextResponse.json(newPost[0], { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    )
  }
}
