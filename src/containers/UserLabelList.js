import { connect } from 'react-redux'
import { actions as gmailActions } from 'redux/modules/gmail'
import LabelList from 'components/LabelList'

const mapStateToProps = (state) => ({
  labels: state.gmail.labels
    .filter((l) => l.type === 'user')
    .sort((a, b) => {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    })
    .map((l) => {
      l.selected = !!state.gmail.currentLabel && l.id === state.gmail.currentLabel.id
      return l
    })
})

const actions = Object.assign({}, {
  onLabelClick: gmailActions.selectLabel
})

export default connect(mapStateToProps, actions)(LabelList)
