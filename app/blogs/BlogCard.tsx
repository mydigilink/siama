// app/blog/BlogCard.tsx

import Link from "next/link"
import { BlogPost } from "./types"

interface Props {
  post: BlogPost
}

export default function BlogCard({ post }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
      <img
        src={post.featuredImage}
        alt={post.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">
        {post.isSticky && (
          <span className="text-xs bg-yellow-400 px-2 py-1 rounded mr-2">
            Sticky
          </span>
        )}

        {post.isFeatured && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            Featured
          </span>
        )}

        <h2 className="text-xl font-bold mt-3 mb-2">
          <Link href={`/blogs/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-3">{post.excerpt}</p>

        <div className="text-sm text-gray-500 mb-3">
          By {post.author.name} • {post.createdAt} • {post.readingTime} min read
        </div>

        <div className="flex flex-wrap gap-2">
          {post.categories.map((cat) => (
            <span key={cat.id} className="text-xs bg-gray-200 px-2 py-1 rounded">
              {cat.name}
            </span>
          ))}
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {post.commentsCount} Comments
        </div>
      </div>
    </div>
  )
}