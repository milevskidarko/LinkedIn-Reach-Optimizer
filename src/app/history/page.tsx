"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

interface Post {
    id: string;
    text: string;
    tone: string;
    emoji_level: number;
    analysis?: string;
    created_at: string;
}

export default function HistoryPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setPosts(data as Post[]);
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPosts();
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await supabase.from("posts").delete().eq("id", id);
        fetchPosts();
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-zinc-900 dark:via-black dark:to-purple-900 px-4 py-12 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300/30 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

            <nav className="max-w-5xl mx-auto mb-8 flex justify-between relative z-10">
                <Link href="/" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all">
                    ← Back
                </Link>
                <h1 className="font-bold text-2xl text-indigo-700 dark:text-indigo-400">History</h1>
            </nav>

            <div className="max-w-5xl mx-auto space-y-4 relative z-10">
                {loading && <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>}

                {!loading && posts.length === 0 && (
                    <div className="text-zinc-500 dark:text-zinc-400">No analyses yet.</div>
                )}

                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl shadow-xl p-5 border border-zinc-200 dark:border-zinc-700 transition hover:shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(post.created_at).toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="text-red-500 hover:text-red-600 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <p className="text-sm mb-2 text-zinc-700 dark:text-zinc-200">
                            {post.text}
                        </p>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                            Tone: {post.tone} · Emoji: {post.emoji_level}
                        </p>

                        {post.analysis && (
                            <div className="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-sm whitespace-pre-line shadow-sm">
                                <div className="font-semibold text-blue-700 dark:text-blue-200 mb-2">AI Suggestions</div>
                                <div className="text-blue-900 dark:text-blue-100 leading-relaxed">{post.analysis}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
