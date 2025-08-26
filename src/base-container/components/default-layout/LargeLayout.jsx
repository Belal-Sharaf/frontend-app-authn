import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';
import { useLocation } from 'react-router-dom';

import './cogens-hero.scss';
import messages from './messages';

const LargeLayout = () => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();

  const isReset = pathname && pathname.startsWith('/authn/reset');

  const line1 = isReset
    ? formatMessage(messages['forgot.password.hero.line1'])
    : formatMessage(messages['start.learning']);

  const line2 = isReset
    ? formatMessage(messages['forgot.password.hero.line2'])
    : formatMessage(messages['with.site.name'], { siteName: getConfig().SITE_NAME });

  return (
    <div className="w-50 d-flex">
      {/* Blue hero */}
      <div className="col-md-9 cogens-hero">
        <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
          <Image className="logo position-absolute" alt={getConfig().SITE_NAME} src={getConfig().LOGO_WHITE_URL} />
        </Hyperlink>

        <h1 className="cogens-hero__title">
          {line1}
          <div className="accent">{line2}</div>
        </h1>
      </div>

      {/* Right wedge (hidden via CSS but kept for layout integrity) */}
      <div className="col-md-3 bg-white p-0">
        <svg className="ml-n1 w-100 h-100 large-screen-svg-primary" preserveAspectRatio="xMaxYMin meet">
          <g transform="skewX(171.6)">
            <rect x="0" y="0" height="100%" width="100%" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LargeLayout;
