import * as React from 'react';
import * as style from './style.css';

export class Root extends React.Component<any, any> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
  }

  render() {
    return (
      <div className={style.container}>
        {this.props.children}
        {this.renderDevTool()}
      </div>
    );
  }
}
