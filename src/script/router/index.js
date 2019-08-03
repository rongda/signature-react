import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import routers from './routers'
import storage from '../utils/storage'
import { loginSuccess } from '../store/actions'

@connect(
  null,
  {
    loginSuccess
  }
)
class RouterConfig extends React.Component {
  componentDidMount() {
    storage.getToken() && this.props.loginSuccess({
      token: storage.getToken(),
      ...storage.getUserName()
    })
  }
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {<Switch>
            {routers.map((item, index) => <Route
              key={index}
              path={item.path}
              component={item.component}
              exact
            />)}
            <Redirect to='/index' />
          </Switch>}
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default RouterConfig
