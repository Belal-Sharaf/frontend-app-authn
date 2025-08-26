import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';

import './cogens-hero.scss';
import messages from './messages';

const LargeLayout = () => {
  const { formatMessage } = useIntl();
  // works for /authn/reset, /reset, with/without trailing slash
  const isReset = /(^|\/)reset(\/|$)/.test(window.location?.pathname || '');

  return (
    <div className="cogens-hero-wrapper">
      <div className="cogens-hero">
        <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
          <Image className="logo" alt={getConfig().SITE_NAME} src={getConfig().LOGO_WHITE_URL} />
        </Hyperlink>

        <h1 className="cogens-hero__title">
          {isReset ? (
            <>
              {formatMessage(messages['forgot.password.hero.line1'])}
              <div className="accent">{formatMessage(messages['forgot.password.hero.line2'])}</div>
            </>
          ) : (
            <>
              {formatMessage(messages['start.learning'])}
              <div className="accent">
                {formatMessage(messages['with.site.name'], { siteName: getConfig().SITE_NAME })}
              </div>
            </>
          )}
        </h1>
      </div>
    </div>
  );
};

export default LargeLayout;
