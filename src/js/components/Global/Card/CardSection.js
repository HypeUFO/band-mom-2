import React from 'react';

const CardSection = (props) => (
    <div style={styles.sectionStyle} className="card__section">
      {props.children}
    </div>
);

const styles = {
  sectionStyle: {
    // borderBottomWidth: 1,
    // padding: 5,
    // backgroundColor: '#fff',
    // justifyContent: 'flex-start',
    // flexDirection: 'row',
    // borderColor: '#ddd',
    // position: 'relative',
    // width: '100%',
  }
};

export default CardSection;
