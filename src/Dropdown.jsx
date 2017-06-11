import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const triggerKeys = {
  OPEN_MENU: ['ArrowDown', 'Space'],
  CLOSE_MENU: ['Escape'],
  NAVIGATE_DOWN: ['ArrowDown', 'Tab'],
  NAVIGATE_UP: ['ArrowUp'],
};

class Dropdown extends React.Component {
  static isTriggerKey(action, keyName) {
    return triggerKeys[action].indexOf(keyName) > -1;
  }

  constructor(props) {
    super(props);

    this.addEvents = this.addEvents.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleToggleKeyDown = this.handleToggleKeyDown.bind(this);
    this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.toggle = this.toggle.bind(this);

    this.menuItems = [];
    this.state = {
      open: false,
      focusIndex: 0,
    };
  }

  componentWillUpdate(_, nextState) {
    if (nextState.open) {
      this.addEvents();
    } else {
      this.removeEvents();
    }
  }

  componentDidUpdate() {
    if (this.state.open) {
      this.menuItems[this.state.focusIndex].focus();
    }
  }

  addEvents() {
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  removeEvents() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  handleDocumentClick(e) {
    if (this.container && this.container.contains(e.target) && this.container !== e.target) {
      return;
    }
    this.toggle();
  }

  handleMenuKeyDown(e) {
    e.preventDefault();
    if (this.isTriggerKey('CLOSE_MENU', e.key)) {
      this.toggle();
    } else if (this.isTriggerKey('NAVIGATE_DOWN', e.key)) {
      this.setState({
        focusIndex: (this.state.focusIndex + 1) % this.props.menuItems.length,
      });
    } else if (this.isTriggerKey('NAVIGATE_UP', e.key)) {
      this.setState({
        focusIndex: ((this.state.focusIndex - 1) + this.props.menuItems.length) %
                    this.props.menuItems.length,
      });
    }
  }

  handleToggleKeyDown(e) {
    if (!this.state.open && this.isTriggerKey('OPEN_MENU', e.key)) {
      this.toggle();
    } else if (this.state.open && this.isTriggerKey('CLOSE_MENU', e.key)) {
      this.toggle();
      this.toggleElem.focus();
    }
  }

  toggle() {
    this.setState({
      open: !this.state.open,
      focusIndex: 0,
    });
  }

  generateMenuItems(menuItems) {
    return menuItems.map((menuItem, i) => (
      <li className={this.props.classes.menuItem} key={i}>
        <a
          role="menuitem"
          href={menuItem.href}
          onKeyDown={this.handleMenuKeyDown}
          ref={(item) => {
            this.menuItems[i] = item;
          }}
          tabIndex="-1"
        >
          {menuItem.label}
        </a>
      </li>
    ));
  }

  render() {
    const menuItems = this.generateMenuItems(this.props.menuItems);
    const classes = this.props.classes;

    return (
      <div
        className={classNames([
          classes.dropdown,
        { [classes.show]: this.state.open },
        ])}
        ref={(container) => { this.container = container; }}
      >
        <button
          aria-expanded={this.state.open}
          aria-haspopup="true"
          className={classNames([
            classes.toggle,
            { [classes.active]: this.state.open },
          ])}
          onClick={this.toggle}
          onKeyDown={this.handleToggleKeyDown}
          type="button"
          ref={(toggleElem) => { this.toggleElem = toggleElem; }}
        >
          {this.props.title}
        </button>
        <ul
          aria-label={this.props.title}
          aria-hidden={!this.state.open}
          className={classes.menu}
          role="menu"
        >
          {menuItems}
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    href: PropTypes.string,
  })).isRequired,
  classes: PropTypes.shape().optional,
};

Dropdown.defaultProps = {
  classes: {
    dropdown: 'dropdown',
    active: 'active',
    toggle: 'btn dropdown-toggle',
    screenreader: 'sr-only',
    show: 'show',
    menu: 'dropdown-menu',
    menuItem: 'dropdown-item',
  },
};

export default Dropdown;