import React, { PropTypes } from 'react'
import ClickableLink from './ClickableLink'

const EmailList = ({ emails, onEmailClick }) => (
  <ul>
    {emails.map(email =>
      <li key={email.id}>
        <ClickableLink
          {...email}
          onClick={() => onEmailClick(email)}
        >
          {email.snippet}
        </ClickableLink>
      </li>
    )}
  </ul>
)

EmailList.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    snippet: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onEmailClick: PropTypes.func.isRequired
}

export default EmailList
