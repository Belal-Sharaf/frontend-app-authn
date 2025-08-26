import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';

import './cogens-hero.scss';
import messages from './messages';

const MediumLayout = () => {
  const { formatMessage } = useIntl();
  const isReset = /(^|\/)reset(\/|$)/.test(window.location?.pathname || '');

  return (
    <div className="cogens-hero-wrapper cogens-hero-wrapper--md">
      <div className="cogens-hero">
        <Hyperlink destination={getConfig().MARKETING_SITE_BASE_URL}>
          <Image className="logo" alt={getConfig().SITE_NAME} src={getConfig().LOGO_WHITE_URL} />
        </Hyperlink>

        <h1 className="cogens-hero__title">
          {isReset ? (
            <>
              {formatMessage(messages['forgot.password.hero.line1'])}{' '}
              <span className="accent">{formatMessage(messages['forgot.password.hero.line2'])}</span>
            </>
          ) : (
            <>
              {formatMessage(messages['start.learning'])}{' '}
              <span className="accent">
                {formatMessage(messages['with.site.name'], { siteName: getConfig().SITE_NAME })}
              </span>
            </>
          )}
        </h1>
      </div>
    </div>
  );
};

export default MediumLayout;
