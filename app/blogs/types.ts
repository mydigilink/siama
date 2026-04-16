// app/blog/types.ts

export interface Author {
  id: number
  name: string
  avatar: string
  bio: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface SEO {
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  author: Author
  categories: Category[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
  readingTime: number
  commentsCount: number
  isFeatured: boolean
  isSticky: boolean
  status: "draft" | "published"
  seo: SEO
}