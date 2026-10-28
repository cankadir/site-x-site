import styled from "styled-components";
import { system } from "styled-system";
import {
  compose,
  space,
  color,
  border,
  layout,
  typography,
  position,
  background,
  shadow,
  grid,
} from "styled-system";

const customProps = () => {
  return system({ whiteSpace: true });
};

const Box = styled.div(
  {
    boxSizing: "border-box",
    display: "block",
  },
  compose(
    space,
    color,
    border,
    layout,
    typography,
    position,
    background,
    shadow,
    grid,
  ),
  customProps()
);

export default Box;
