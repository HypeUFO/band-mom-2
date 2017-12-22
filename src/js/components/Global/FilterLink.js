import React from 'react';

const FilterLink = ({
        filter,
        value,
        currentFilter,
        children,
        action
    }) => {
        if (filter === currentFilter) {
            return <span className="filter__link filter__link--active">{children}</span>;
        }
        return (
          <a href="#"
            className="filter__link"
            onClick={e => {
            e.preventDefault();
            action(filter)
            }} >
            {children}
          </a>
        );
    };

export default FilterLink
