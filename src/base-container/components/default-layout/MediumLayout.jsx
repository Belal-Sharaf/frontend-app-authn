import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';
import { useLocation } from 'react-router-dom';

import './cogens-hero.scss';
import messages from './messages';

const MediumLayout = () => {
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
    <>
      <div className="w-100 medium-screen-top-stripe" />
      <div className="w-100 p-0 mb-3 d-flex">
        {/* Blue hero */}
        <div className="col-md-10 cogens-hero">
          <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
            <Image alt={getConfig().SITE_NAME} className="logo" src={getConfig().LOGO_WHITE_URL} />
          </Hyperlink>

          <h1 className="cogens-hero__title">
            {line1} <span className="accent">{line2}</span>
          </h1>
        </div>

        {/* Right wedge (hidden via CSS) */}
        <div className="col-md-2 bg-white p-0">
          <svg className="w-100 h-100 medium-screen-svg-primary" preserveAspectRatio="xMaxYMin meet">
            <g transform="skewX(168)">
              <rect x="0" y="0" height="100%" width="100%" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default MediumLayout;
