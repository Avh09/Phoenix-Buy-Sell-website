import React from 'react';

const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onToggle 
}) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold mb-2">Categories</h3>
      {categories.map(category => (
        <div key={category} className="flex items-center mb-1">
          <input 
            type="checkbox" 
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => onToggle(category)}
            className="mr-2"
          />
          <label htmlFor={category}>{category}</label>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;