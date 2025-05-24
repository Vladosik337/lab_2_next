import 'dotenv/config'

import { db } from '@/db/db'
import { users } from '@/db/schema/user.schema'
import { posts } from '@/db/schema/post.schema'
import chalk from 'chalk'
import { hash } from 'bcrypt'
import { seed } from 'drizzle-seed'

async function main() {
  console.log(chalk.blue('🌱 Starting database seeding...'))

  try {
    // Reset the database first
    console.log(chalk.yellow('Resetting database...'))
    await db.delete(posts)
    await db.delete(users)
    console.log(chalk.green('✔ Database reset complete'))

    // Seed the database using drizzle-seed
    console.log(chalk.yellow('Seeding database...'))

    const hashedPassword = await hash('password123', 10)

    await seed(db, {
      users,
      posts
    }).refine((f) => ({
      users: {
        count: 5,
        columns: {
          name: f.fullName({
            isUnique: true
          }),
          username: f.string({
            isUnique: true
          }),
          email: f.email(),
          password: f.default({ defaultValue: hashedPassword }),
          deleted_at: f.default({ defaultValue: null })
        },
        with: {
          posts: [
            { weight: 0.4, count: [1, 2] }, // 40% users have 1-2 posts
            { weight: 0.3, count: [3, 4] }, // 30% users have 3-4 posts
            { weight: 0.2, count: [5, 6] }, // 20% users have 5-6 posts
            { weight: 0.1, count: [7, 8] } // 10% users have 7-8 posts
          ]
        }
      },
      posts: {
        columns: {
          title: f.loremIpsum({ sentencesCount: 1 }),
          content: f.loremIpsum({ sentencesCount: 10 }),
          deleted_at: f.default({ defaultValue: null })
        }
      }
    }))

    console.log(
      chalk.green.bold('\n✨ Database seeding completed successfully!')
    )
  } catch (error) {
    console.error(chalk.red('\n❌ Error seeding database:'), error)
    process.exit(1)
  }
}

main()
  .catch((error) => {
    console.error(chalk.red('\n❌ Fatal error:'), error)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
