import React from 'react';

const Spinner = () => {
  return (
    <div className="spinner__wrapper">
      <svg className="spinner" width="95px" height="95px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="path" fill="none" strokeWidth="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  )
}

export default Spinner;