import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <input 
      type="text" 
      placeholder="Search items..." 
      className="w-full p-2 border rounded"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchBar;