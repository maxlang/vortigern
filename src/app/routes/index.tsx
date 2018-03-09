import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, AboutConnected, VideoConnected, Counter, Stars } from 'containers';

export default (
  <Route>
    <Route path="/video" component={VideoConnected}/>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={AboutConnected} />
      <Route path="counter" component={Counter} />
      <Route path="stars" component={Stars} />
    </Route>
  </Route>
);
