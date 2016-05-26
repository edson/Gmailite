import { connect } from 'react-redux'
// import { actions as gmailActions } from 'redux/modules/gmail'
import EmailList from 'components/EmailList'

const mapStateToProps = (state) => ({
  emails: state.gmail.emails
})

const actions = Object.assign({}, {
  onEmailClick: () => {}
})

export default connect(mapStateToProps, actions)(EmailList)
