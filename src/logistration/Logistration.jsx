// src/logistration/Logistration.jsx
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { getAuthService } from '@edx/frontend-platform/auth';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';

import { LoginPage } from '../login';
import loginMessages from '../login/messages';
import { RegistrationPage } from '../register';
import registerMessages from '../register/messages';

import { LOGIN_PAGE, REGISTER_PAGE } from '../data/constants';
import { updatePathWithQueryParams } from '../data/utils';

import { backupLoginForm } from '../login/data/actions';
import { backupRegistrationForm } from '../register/data/actions';
import { clearThirdPartyAuthContextErrorMessage } from '../common-components/data/actions';

const SLIDE_MS = 420; // keep in sync with SCSS var --slide-dur

const Logistration = ({
  selectedPage,
  backupLoginForm,
  backupRegistrationForm,
  clearThirdPartyAuthContextErrorMessage,
}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  // Ensure CSRF is available
  useEffect(() => {
    const s = getAuthService();
    if (s) s.getCsrfTokenService().getCsrfToken(getConfig().LMS_BASE_URL);
  }, []);

  // Current page mode
  const [mode, setMode] = useState(selectedPage === REGISTER_PAGE ? 'register' : 'login');

  // Where the sliding overlay should go (controls CSS state)
  const [slideTo, setSlideTo] = useState(mode);

  useEffect(() => {
    const next = selectedPage === REGISTER_PAGE ? 'register' : 'login';
    setMode(next);
    setSlideTo(next); // snap overlay when landing directly on a route
  }, [selectedPage]);

  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;

  const performRouteSwap = (nextMode) => {
    if (nextMode === 'login') {
      sendTrackEvent('edx.bi.login_form.toggled', { from: 'hero', category: 'user-engagement' });
      clearThirdPartyAuthContextErrorMessage();
      backupRegistrationForm();
      setMode('login');
      navigate(updatePathWithQueryParams(LOGIN_PAGE), { replace: true });
    } else {
      sendTrackEvent('edx.bi.register_form.toggled', { from: 'hero', category: 'user-engagement' });
      clearThirdPartyAuthContextErrorMessage();
      backupLoginForm();
      setMode('register');
      navigate(updatePathWithQueryParams(REGISTER_PAGE), { replace: true });
    }
  };

  const startTransition = (e, nextMode) => {
    if (e) e.preventDefault();
    setSlideTo(nextMode); // kick off CSS transition
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReduced ? 0 : SLIDE_MS;
    window.setTimeout(() => performRouteSwap(nextMode), delay);
  };

  return (
    <div className="c-shell">
      <div className="c-card">
        <div
          className={['c-card__inner', slideTo === 'login' ? 'is-login' : 'is-register'].join(' ')}
          style={{ '--slide-dur': `${SLIDE_MS}ms` }}
        >
          {/* Sliding blue overlay */}
          <div className="c-card__slide" aria-hidden="true" />

          {/* LEFT — hero + single CTA (triggers the slide) */}
          <aside className="c-card__hero" aria-label="Welcome">
            <h3 className="c-card__title">
              Start<br />learning<br /><span className="accent">with Cogens</span>
            </h3>
            <p className="c-card__subtitle">High-quality courses, taught by experts.</p>

            <div className="c-card__cta">
              {mode === 'login' ? (
                !disablePublicAccountCreation && (
                  <Link
                    to={REGISTER_PAGE}
                    onClick={(e) => startTransition(e, 'register')}
                    className="btn btn-outline-light btn-pill"
                  >
                    {formatMessage(registerMessages['create.account.for.free.button'])}
                  </Link>
                )
              ) : (
                <Link
                  to={LOGIN_PAGE}
                  onClick={(e) => startTransition(e, 'login')}
                  className="btn btn-outline-light btn-pill"
                >
                  {formatMessage(loginMessages['sign.in.button'])}
                </Link>
              )}
            </div>
          </aside>

          {/* RIGHT — form only (titles are inside the pages) */}
          <main className="c-card__form">
            {mode === 'login'
              ? <LoginPage withinShell institutionLogin={false} handleInstitutionLogin={() => {}} />
              : <RegistrationPage withinShell institutionLogin={false} handleInstitutionLogin={() => {}} />
            }
          </main>
        </div>
      </div>
    </div>
  );
};

Logistration.propTypes = {
  selectedPage: PropTypes.string,
  backupLoginForm: PropTypes.func.isRequired,
  backupRegistrationForm: PropTypes.func.isRequired,
  clearThirdPartyAuthContextErrorMessage: PropTypes.func.isRequired,
};

Logistration.defaultProps = { selectedPage: LOGIN_PAGE };

export default connect(null, {
  backupLoginForm,
  backupRegistrationForm,
  clearThirdPartyAuthContextErrorMessage,
})(Logistration);
