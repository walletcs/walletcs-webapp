import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import EnterIcon from './EnterIcon';
import ToolTipsWCS from '../ToolTipsWCS';

const styles = theme => ({
  iconButton: {
    padding: '8px !important',
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
    '& span' : {
      width: 16,
    },
  },
});

const RedirectButtonWCS = ({ className, ...props }) => {
  const { classes, onClick } = props;

  return (
    <ToolTipsWCS {...props}>
       <IconButton aria-label="Enter button" className={classes.iconButton} onClick={onClick}>
        <EnterIcon/>
      </IconButton>
    </ToolTipsWCS>
  );
};

RedirectButtonWCS.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.object,
};

export default withStyles(styles)(RedirectButtonWCS);
