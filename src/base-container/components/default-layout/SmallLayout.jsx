import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';
import { useLocation } from 'react-router-dom';

import './cogens-hero.scss';
import messages from './messages';

const SmallLayout = () => {
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
    <span className="w-100 cogens-hero">
      <div className="col-md-12 small-screen-top-stripe" />
      <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
        <Image className="logo-small" alt={getConfig().SITE_NAME} src={getConfig().LOGO_WHITE_URL} />
      </Hyperlink>

      <h1 className="cogens-hero__title">
        {line1} <span className="accent">{line2}</span>
      </h1>
    </span>
  );
};

export default SmallLayout;
