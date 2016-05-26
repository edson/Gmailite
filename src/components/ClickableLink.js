import React, { PropTypes } from 'react'

const ClickableLink = ({ selected, children, onClick }) => {
  if (selected) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}

ClickableLink.propTypes = {
  selected: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ClickableLink
