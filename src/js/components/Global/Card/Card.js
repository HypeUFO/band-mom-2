import React from 'react';

const Card = (props) => (
    <div style={styles.cardStyle} album={props.album} key={props.index} className={props.className} >
      { props.children }
    </div>
);

const styles = {
  cardStyle: {
    // borderWidth: 1,
    // borderRadius: 2,
    // borderColor: '#ddd',
    // borderBottomWidth: 0,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // justifyContent: 'center',
    // alignItems: 'center',
    // elevation: 1,
    // marginLeft: 5,
    // marginRight: 5,
    // marginTop: 10,
  }
};

export default Card;
