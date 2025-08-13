import React, { useState } from 'react';

const dummyUsers = [
  { id: 1, username: 'john_doe', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: 2, username: 'jane_smith', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { id: 3, username: 'alex_king', name: 'Alex King', avatar: 'https://randomuser.me/api/portraits/men/31.jpg' },
  { id: 4, username: 'lisa_ray', name: 'Lisa Ray', avatar: 'https://randomuser.me/api/portraits/women/41.jpg' }
];

const dummyPosts = [
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
  "https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
];

const Search = () => {
  const [query, setQuery] = useState('');

  const filteredUsers = dummyUsers.filter(user =>
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Suggested Users */}
      {query && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </div>
      )}

      {/* Explore Grid */}
      {!query && (
        <div className="grid grid-cols-3 gap-1">
          {dummyPosts.map((url, index) => (
            <div key={index} className="w-full h-40 overflow-hidden">
              <img
                src={url}
                alt={`Post ${index}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
