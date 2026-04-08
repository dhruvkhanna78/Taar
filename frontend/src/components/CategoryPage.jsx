import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Post from "./Post"; // Aapka existing Post component

import {
    Tv,
    Trophy,
    Gamepad2,
    BookOpen,
    Code,
    Palette
} from "lucide-react";

const modes = [
    {
        name: "Entertainment",
        tag: "entertainment",
        icon: Tv,
        accent: "text-purple-600",
        card: "shadow-purple-200",
        bg: "bg-gradient-to-br from-purple-100 via-white to-pink-100"
    },
    {
        name: "Sports",
        tag: "sports",
        icon: Trophy,
        accent: "text-green-600",
        card: "shadow-green-200",
        bg: "bg-gradient-to-br from-green-100 via-white to-emerald-100"
    },
    {
        name: "Gaming",
        tag: "gaming",
        icon: Gamepad2,
        accent: "text-indigo-600",
        card: "shadow-indigo-200",
        bg: "bg-gradient-to-br from-indigo-100 via-white to-blue-100"
    },
    {
        name: "Learning",
        tag: "learning",
        icon: BookOpen,
        accent: "text-yellow-600",
        card: "shadow-yellow-200",
        bg: "bg-gradient-to-br from-yellow-50 via-white to-orange-50"
    },
    {
        name: "Coding",
        tag: "coding",
        icon: Code,
        accent: "text-blue-400",
        card: "shadow-gray-700",
        bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    },
    {
        name: "Art & Literature",
        tag: "art & literature",
        icon: Palette,
        accent: "text-rose-600",
        card: "shadow-rose-200",
        bg: "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100"
    }
];

const CategoryPage = () => {
    const { posts } = useSelector((store) => store.post);
    const { type } = useParams();
    const [activeMode, setActiveMode] = useState(modes[0]);

    useEffect(() => {
        if (type) {
            const selectedMode = modes.find((m) => m.tag === type.toLowerCase());
            if (selectedMode) setActiveMode(selectedMode);
        }
    }, [type]);

    const filteredPosts = posts.filter(
        (post) => post.category?.toLowerCase() === activeMode.tag
    );

    const Icon = activeMode.icon;
    return (
        <div className={`min-h-screen ${activeMode.theme} transition-all duration-700 pb-20`}>
            <div className="max-w-2xl mx-auto p-4 md:pt-10">

                {/* Header Section */}
                <div className="mb-10 text-center">

                    <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-10 h-10 ${activeMode.accent}`} />

                        <h1
                            className={`text-5xl font-black uppercase tracking-tighter ${activeMode.accent}`}
                        >
                            {activeMode.name}
                        </h1>
                    </div>
                    <div className={`h-1.5 w-24 mx-auto mt-3 rounded-full ${activeMode.accent.replace('text', 'bg')}`} />
                </div>

                {/* Using your Post Component */}
                <div className="flex flex-col gap-6">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center p-16 bg-white/20 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-400/50">
                            <p className="text-xl font-semibold opacity-70">
                                No posts in {activeMode.name} yet!
                            </p>
                            <p className="text-sm opacity-50 mt-1">Do you have something to post?</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div key={post._id} className="transform transition-transform">
                                {/* Aapka Post Component yahan render ho raha hai */}
                                <Post post={post} theme={activeMode}/>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;