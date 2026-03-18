import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = React.useState("");
    const changeEventHAndler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        } else{
            setText("");
        }
    }

    const sendMessageHandler = async () => {
        alert("Message sent: " + text);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='max-w-none  w-[90vw] p-0 flex flex-col h-auto'>
                <div className='flex gap-4 pr-2'>
                    <div className='select-none w-full md:w-1/3 hidden md:block'>
                        <img src="https://cdn.pixabay.com/photo/2025/08/17/10/46/bird-9779577_1280.png" alt="post_img" className='w-full h-full object-cover rounded-l-lg' />
                    </div>
                    <div className='w-full md:w-2/3 flex flex-col justify-between'>
                        <div className='flex items-center justify-between caret-transparent '>
                            <div className='flex items-center gap-2 py-4 pl-0'>
                                <Link>
                                    <Avatar className='select-none'>
                                        <AvatarImage src='' alt='post_image' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs select-text' >Username</Link>
                                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                                </div>
                            </div>
                            <Dialog >
                                <DialogTrigger asChild className='cursor-pointer item-center flex flex-col text-sm text-center caret-transparent select-none'>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className='cursor-pointer w-xs item-center flex flex-col text-sm text-center caret-transparent select-none'>
                                    <div className='font-bold text-red-500'>
                                        Unfollow
                                    </div>
                                    <div>
                                        Add to favourites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto h-96 p-4'>
                            Comments!
                        </div>
                        <div className='p-4'>
                            <div className='flex gap-2 items-center'>
                                <input type="text" value={text} onChange={changeEventHAndler} placeholder='Add a comment...' className='w-full outline-none border border-gray-300 p-2 rounded'/>
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
