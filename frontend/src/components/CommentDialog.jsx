import { Dialog, DialogContent } from '@/components/ui/dialog';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

const CommentDialog = ({ open, setOpen, commentHandler, text, setText, post }) => {

    const changeEventHandler = (e) => {
        setText(e.target.value);
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return "now";

        const diff = Date.now() - new Date(timestamp).getTime();

        if (isNaN(diff)) return "now";

        const seconds = Math.floor(diff / 1000);

        const intervals = [
            { label: "y", seconds: 31536000 },
            { label: "mo", seconds: 2592000 },
            { label: "w", seconds: 604800 },
            { label: "d", seconds: 86400 },
            { label: "h", seconds: 3600 },
            { label: "m", seconds: 60 },
        ];

        for (let i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count}${i.label}`;
        }

        return "now";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-row overflow-hidden border-none shadow-2xl bg-white">

                {/* LEFT MEDIA */}
                <div className="hidden md:flex w-[45%] bg-black items-center justify-center border-r border-gray-100">
                    {post?.image?.length > 0 ? (
                        <img
                            src={post.image[0]}
                            alt="preview"
                            className="w-full h-full object-contain"
                        />
                    ) : post?.video ? (
                        <video
                            src={post.video}
                            controls
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-gray-500">No Media Available</div>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-[55%] flex flex-col h-full bg-white">

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-4 border-b shrink-0">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border">
                                <AvatarImage src={post?.author?.profilePicture} />
                                <AvatarFallback>
                                    {post?.author?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <span className="font-bold text-sm leading-none">
                                    {post?.author?.username}
                                </span>
                                <span className="text-[12px] text-gray-500 mt-1">
                                    Original Post
                                </span>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>

                    {/* COMMENTS */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {post?.comments?.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p className="text-sm font-medium">No comments yet</p>
                                <p className="text-xs">
                                    Be the first one to share your thoughts!
                                </p>
                            </div>
                        ) : (
                            post.comments.map((c, i) => {

                                const timeAgo = formatTimeAgo(c.createdAt);

                                return (
                                    <div key={i} className="flex items-start gap-4">

                                        <Avatar className="w-9 h-9 shrink-0 shadow-sm">
                                            <AvatarImage src={c.author?.profilePicture} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col flex-1">

                                            <p className="text-sm leading-relaxed">
                                                <span className="font-bold mr-2 text-black hover:underline cursor-pointer">
                                                    {c.author?.username}
                                                </span>

                                                <span className="text-gray-700">
                                                    {c.text}
                                                </span>
                                            </p>

                                            <div className="flex gap-4 mt-2 text-[11px] text-gray-400 font-bold uppercase tracking-tight">

                                                <span
                                                    title={
                                                        c.createdAt
                                                            ? new Date(c.createdAt).toLocaleString()
                                                            : ""
                                                    }
                                                    className="hover:text-gray-600 cursor-default"
                                                >
                                                    {timeAgo}
                                                </span>

                                                <span className="hover:text-black cursor-pointer transition-colors">
                                                    Reply
                                                </span>

                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}

                    </div>

                    {/* INPUT */}
                    <div className="p-4 border-t bg-gray-50/30">
                        <div className="flex gap-3 items-center">

                            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-1.5 shadow-sm">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={changeEventHandler}
                                    placeholder="Write a comment..."
                                    className="w-full outline-none text-sm py-2 bg-transparent text-gray-800"
                                />
                            </div>

                            <Button
                                disabled={!text.trim()}
                                onClick={commentHandler}
                                variant="ghost"
                                className="text-blue-600 font-bold hover:bg-blue-50 hover:text-blue-700 transition-colors px-4"
                            >
                                Post
                            </Button>

                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentDialog;