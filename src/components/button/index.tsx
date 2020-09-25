/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { FunctionComponent, memo } from 'react';

type ButtonProps = {
  type: 'cta' | 'contained' | 'outlined' | 'text';
  /** Size of button */
  size: 'large' | 'medium' | 'small';
  /** The button's label text */
  label: string;
  /** Click handler */
  onClick: (event: React.MouseEvent) => void;
};

const baseStyles = css`
  display: inline-block;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus:not(:focus-visible) {
    outline: none;
    color: red;
  }
`;

const buttonTypeStyles: Record<ButtonProps['type'], SerializedStyles> = {
  'cta': css`
    background: rgb(248,142,24);
    background: linear-gradient(180deg, rgba(248,142,24,1) 0%, rgba(196,111,7,1) 100%);
    color: #fff;
    border: 1px solid #f8aa56;
  `,
  'contained': css`
    background: #1c4cff;
    color: white;
    border: 1px solid #1c4cff;
  `,
  'outlined': css`
    background: transparent;
    color: #1c4cff;
    border: 1px solid #1c4cff;
  `,
  'text': css`
    background: transparent;
    color: #1c4cff;
    border: 1px solid transparent;
  `
};

const buttonSizeStyles: Record<ButtonProps['size'], SerializedStyles> = {
  large: css`
    padding: 15px 32px;
    font-size: 16px;
    display: block;
    width: 100%;
  `,
  medium: css`
    padding: 10px 20px;
    font-size: 14px;
  `,
  small: css`
    padding: 7px 14px;
    font-size: 12px;
  `
};

const Button: FunctionComponent<ButtonProps> = ({
  type, size, label, onClick
}) => {
  return (
    <button
      onClick={onClick}
      css={[
        baseStyles,
        buttonTypeStyles[type],
        buttonSizeStyles[size]
      ]}
    >
      {label}
    </button>
  );
};

export default memo(Button);
