import React from 'react'

const SearchPage = () => {
  return (
    <div
                className="bg-[#3B9DF8] py-4 w-full md:w-[80%] px-5 flex items-center justify-center rounded-full cursor-pointer relative">
                <IoSearch className="text-[1.3rem] text-white ml-auto"/>

                <input
                    type="text"
                    placeholder="Search..."
                    className="border dark:bg-slate-900 dark:border-none dark:placeholder:text-slate-500 dark:text-[#abc2d3] border-[#e5eaf2] absolute top-[2px] left-[3px] h-[90%] w-[85%] py-3 px-4 outline-none rounded-full"
                />
            </div>
  )
}

export default SearchPage