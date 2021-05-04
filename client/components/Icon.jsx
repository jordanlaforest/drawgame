import React from 'react';
import PropTypes from 'prop-types';

function Icon({icon, style}){
  return (
    <span className="material-icons" style={style}>{icon}</span>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default Icon;