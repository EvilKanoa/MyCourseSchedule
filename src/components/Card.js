import React from 'react';
import cx from 'classnames';

import './Card.scss';

export default ({ className, children, ...rest }) => (
    <div {...rest} className={cx('card', className)}>
        { children }
    </div>
);
