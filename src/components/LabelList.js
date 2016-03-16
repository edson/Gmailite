import React, { PropTypes } from 'react'
import Label from './Label'

const LabelList = ({ labels, onLabelClick }) => (
  <ul>
    {labels.map(label =>
      <li key={label.id}>
        <Label
          {...label}
          onClick={() => onLabelClick(label)}
        >
          {label.name}
        </Label>
      </li>
    )}
  </ul>
)

LabelList.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    name: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onLabelClick: PropTypes.func.isRequired
}

export default LabelList
