import * as React from 'react';
import { getStars } from 'modules/stars';
import { IStars, IStarsAction } from 'models/stars';
// const { connect } = require('react-redux');
const { asyncConnect } = require('redux-connect');
const style = require('./style.css');

interface IProps {
  stars: IStars;
  getStars: Redux.ActionCreator<IStarsAction>;
}

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    console.log('u kno u wnat me');
    return dispatch(getStars());
    // return {};
  },
}], // )
// @connect(
  (state) => ({ stars: state.stars }),
)
class Stars extends React.Component<IProps, {}> {
  public render() {
    const { stars } = this.props;

    return (
      <div className={style.Stars}>
        sters: {stars.isFetching ? 'Fetching Stars' : stars.count}
      </div>
    );
  }
}

export { Stars }
