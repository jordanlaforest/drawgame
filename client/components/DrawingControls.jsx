import React, { useState } from 'react';

import Panel from 'react-bootstrap/lib/Panel';
import { HexColorPicker } from 'react-colorful';

import Icon from './Icon.jsx';

import './styles/drawingControls.css';

const DrawingControls = () => {
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(12);
  const iconStyle = {fontSize: size + 'px'};
  console.log('Rendered DrawingControls with size: ' + iconStyle);
  return (
    <Panel className="drawingControls">
      <Panel.Heading>Drawing Controls</Panel.Heading>
      <Panel.Body>
        <HexColorPicker color={color} onChange={setColor} />
        <span className="brushSizeContainer">
          <input type="range" min={1} max={36} value={size} onChange={e => setSize(e.target.value)} />
          <span className="brushSizeBg"><Icon icon="circle" style={iconStyle}/></span>
        </span>
      </Panel.Body>
    </Panel>
  );
};

export default DrawingControls;
