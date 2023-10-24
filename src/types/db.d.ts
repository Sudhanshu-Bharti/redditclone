import { Post, Subreddit, User, Vote } from "@prisma/client"
export type ExtendedPost = POST & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}