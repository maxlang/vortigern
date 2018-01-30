import * as React from 'react';
import { getPeople } from 'modules/people';
import { IPeople, IPeopleAction } from 'models/people';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

const style = require('./style.css');

interface IProps {
  people: IPeople;
  getPeople: Redux.ActionCreator<IPeopleAction>;
}

// @asyncConnect([{
//   promise: ({ store: { dispatch } }) => {
//     return dispatch(getPeople());
//   },
// }])
// @connect(
//   (state) => ({ people: state.people }),
// )
class People extends React.Component<IProps, {}> {
  public render() {
    const { people } = this.props;

    console.log('people', this);

    return (
      <div className={style}>
        <h3>People</h3>
        <div>{people.isFetching ? 'Fetching People' : JSON.stringify(people.people, undefined, 2)}</div>
      </div>
    );
  }
}

console.log('pls');
const PeopleConnected = asyncConnect(
  [{
    promise: ({ store: { dispatch } }) => {
      console.log('do you even get here...?');
      return dispatch(getPeople());
    },
  }],
)(
  connect((state) => {
    console.log('hiii');
    return ({ people: state.people});
   })(People),
);

export { PeopleConnected };
