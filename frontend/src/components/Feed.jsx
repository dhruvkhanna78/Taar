import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    // Mobile par padding bilkul zero (px-0) honi chahiye
    <div className="w-full px-0 md:px-0">
      <Posts />
    </div>
  );
};

export default Feed;