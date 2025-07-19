import React from 'react';
import './Suggestions.css';

const Suggestions = () => {
    const suggestedUsers = ['@kratos', '@thor', '@zeus', '@freya', '@odin'];

    return (
        <div className="suggestions-wrapper">
            <h3 className="suggestions-title">Suggestions for you</h3>
            <ul className="suggestion-list">
                {suggestedUsers.map((user, index) => (
                    <li key={index} className="suggestion-item">
                        <span>{user}</span>
                        <button className="follow-btn">Follow</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Suggestions;
