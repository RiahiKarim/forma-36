import { cx } from 'emotion';
import React from 'react';
import { Box, Stack, ExpandProps } from '@contentful/f36-core';
import getStyles from './ButtonGroup.styles';
import type { ButtonGroupProps } from './types';

function _ButtonGroup(
  props: ExpandProps<ButtonGroupProps>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    variant = 'merged',
    withDivider,
    testId = 'cf-ui-button-group',
    children,
    className,
    spacing,
  } = props;
  const styles = getStyles({ withDivider });

  if (variant === 'spaced') {
    return (
      <Stack
        isInline
        flexDirection="row"
        testId={testId}
        ref={ref}
        spacing={spacing}
      >
        {children}
      </Stack>
    );
  }

  return (
    <Box
      testId={testId}
      ref={ref}
      className={cx(styles.buttonGroup, className)}
    >
      {React.Children.map(children, (child, key) => {
        if (!child) {
          return null;
        }
        return React.cloneElement(child, {
          key,
          className: cx(styles.groupContent, child.props.className),
        });
      })}
    </Box>
  );
}

export const ButtonGroup = React.forwardRef(_ButtonGroup);
