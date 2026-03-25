import Link from 'next/link';

export default function TagPage({ params }) {
    const { slug } = params;

    // TODO: Fetch posts filtered by tag from your data source
    const posts = [];

    return (
        <div className="container mx-auto mt-5 mb-5 px-4 py-8">
            <div className="mb-5">
                <h1 className="text-4xl font-bold mb-2">
                    Posts tagged with: <span className="text-blue-600">{slug}</span>
                </h1>
                <p className="text-gray-600">
                    {posts.length} post{posts.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {posts.length > 0 ? (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <article key={post.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                            <Link href={`/blogs/${post.slug}`}>
                                <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-gray-600 mt-2">{post.excerpt}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                {new Date(post.date).toLocaleDateString()}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg">No posts found with this tag.</p>
            )}

            <div className="mt-8">
                <Link href="/blogs" className="text-blue-600 hover:underline">
                    ← Back to all posts
                </Link>
            </div>
        </div>
    );
}