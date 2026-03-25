import { useState, useEffect } from 'react';
import Link from 'next/link';

'use client';


export default function TagPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tags from your API or data source
        const fetchTags = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/tags');
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return <div className="p-8">Loading tags...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Tags</h1>
            <div className="flex flex-wrap gap-4">
                {tags.map((tag) => (
                    <Link key={tag.id} href={`/blogs/tag/${tag.slug}`}>
                        <span className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer">
                            {tag.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}