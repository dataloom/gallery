import styled from 'styled-components';

const BG_COLORS = {
  default: {
    normal: '#ffffff',
    hover: '#eeeeee',
    disabled: '#ffffff'
  },
  purple: {
    normal: '#4203c5',
    hover: '#2e0289',
    disabled: '#2e0289'
  },
  red: {
    normal: '#e53935',
    hover: '#c62828',
    disabled: '#c62828'
  }
};

const BORDER_COLORS = {
  default: {
    normal: '#bdbdbd',
    hover: '#9e9e9e',
    disabled: '#bdbdbd'
  },
  purple: {
    normal: '#4203c5',
    hover: '#2e0289',
    disabled: '#2e0289'
  },
  red: {
    normal: '#b71c1c',
    hover: '#c62828',
    disabled: ''
  }
};

const TEXT_COLORS = {
  default: {
    normal: '#333333',
    hover: '#333333',
    disabled: '#9e9e9e'
  },
  purple: {
    normal: '#ffffff',
    hover: '#ffffff',
    disabled: '#ffffff'
  },
  red: {
    normal: '#ffffff',
    hover: '#ffffff',
    disabled: '#ffffff'
  }
};

function getColor(colors, color, effect) {

  if (color) {
    return colors[color][effect];
  }

  return colors.default[effect];
}

const StyledButton = styled.button`
  background-color: ${(props) => {
    return getColor(BG_COLORS, props.scStyle, 'normal');
  }};
  border-color: ${(props) => {
    return getColor(BORDER_COLORS, props.scStyle, 'normal');
  }};
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  color: ${(props) => {
    return getColor(TEXT_COLORS, props.scStyle, 'normal');
  }};
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    background-color: ${(props) => {
      return getColor(BG_COLORS, props.scStyle, 'hover');
    }};
    border-color: ${(props) => {
      return getColor(BORDER_COLORS, props.scStyle, 'hover');
    }};
    color: ${(props) => {
      return getColor(TEXT_COLORS, props.scStyle, 'hover');
    }};
  }
  &:disabled {
    background-color: ${(props) => {
      return getColor(BG_COLORS, props.scStyle, 'disabled');
    }};
    border-color: ${(props) => {
      return getColor(BORDER_COLORS, props.scStyle, 'disabled');
    }};
    color: ${(props) => {
      return getColor(TEXT_COLORS, props.scStyle, 'disabled');
    }};
    cursor: default;
  }
`;

export default StyledButton;
