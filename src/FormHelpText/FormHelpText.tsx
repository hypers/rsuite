import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import Whisper from '../Whisper';
import Icon from '../Icon';
import { useClassNames } from '../utils';
import { StandardProps } from '../@types/common';

export interface FormHelpTextProps extends StandardProps, React.HTMLAttributes<HTMLSpanElement> {
  /** Whether to show through the Tooltip component */
  tooltip?: boolean;
}

const FormHelpText = React.forwardRef(
  (props: FormHelpTextProps, ref: React.Ref<HTMLSpanElement>) => {
    const {
      as: Component = 'span',
      classPrefix = 'form-help-text',
      className,
      tooltip,
      children,
      ...rest
    } = props;

    const { withClassPrefix, merge } = useClassNames(classPrefix);
    const classes = merge(className, withClassPrefix({ tooltip }));

    if (tooltip) {
      return (
        <Whisper placement="topEnd" speaker={<Tooltip {...rest}>{children}</Tooltip>}>
          <Component ref={ref} className={classes}>
            <Icon icon="question-circle2" />
          </Component>
        </Whisper>
      );
    }

    return (
      <Component {...rest} ref={ref} className={classes}>
        {children}
      </Component>
    );
  }
);

FormHelpText.displayName = 'FormHelpText';
FormHelpText.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.bool,
  children: PropTypes.node,
  classPrefix: PropTypes.string
};

export default FormHelpText;
