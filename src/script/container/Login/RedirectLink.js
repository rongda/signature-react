import React from 'react'

class RedirectLink extends React.Component {
  componentDidMount() {
    window.location.href = this.props.href
  }
  render() {
    return null
  }
}

export default RedirectLink
