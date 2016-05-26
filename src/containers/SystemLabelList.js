import { connect } from 'react-redux'
import { actions as gmailActions } from 'redux/modules/gmail'
import LabelList from 'components/LabelList'

const mapStateToProps = (state) => ({
  labels: state.gmail.labels
    .filter((l) => l.type === 'system')
    .map((l) => {
      l.selected = !!state.gmail.currentLabel && l.id === state.gmail.currentLabel.id
      return l
    })
})

const actions = Object.assign({}, {
  onLabelClick: gmailActions.listEmailsByLabel
})

export default connect(mapStateToProps, actions)(LabelList)
