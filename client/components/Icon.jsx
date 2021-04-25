import React from 'react';
import PropTypes from 'prop-types';

function Icon({icon}){
  return (
    <span className="material-icons">{icon}</span>
  );
}

Icon.propTypes = {
  icon: PropTypes.string
};

export default Icon;