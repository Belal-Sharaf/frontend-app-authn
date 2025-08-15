// src/logistration/Logistration.jsx
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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

  // Initial mode derived from route
  const [mode, setMode] = useState(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  useEffect(() => {
    setMode(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  }, [selectedPage]);

  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;

  // Toggle helpers (hero buttons replace the old tabs)
  const goLogin = () => {
    sendTrackEvent('edx.bi.login_form.toggled', { from: 'card', category: 'user-engagement' });
    clearThirdPartyAuthContextErrorMessage();
    backupRegistrationForm();
    setMode('login');
    navigate(updatePathWithQueryParams(LOGIN_PAGE), { replace: true });
  };

  const goRegister = () => {
    sendTrackEvent('edx.bi.register_form.toggled', { from: 'card', category: 'user-engagement' });
    clearThirdPartyAuthContextErrorMessage();
    backupLoginForm();
    setMode('register');
    navigate(updatePathWithQueryParams(REGISTER_PAGE), { replace: true });
  };

  // Themable logo from your theme (served by LMS theming endpoint)
  const LMS = (getConfig().LMS_BASE_URL || '').replace(/\/+$/, '');
  const logoUrl = `${LMS}/theming/asset/images/logo.png`;

  return (
    <div className="c-shell">
      <div className="c-card">
        <div className="c-card__inner">
          {/* Blue hero panel */}
          <aside className="c-card__hero" aria-label="Welcome">
            <div className="c-card__mark" aria-hidden="true">
              <img src={logoUrl} alt="Cogens" className="c-card__logo" />
            </div>

            <h3 className="c-card__title">
              Start<br />learning<br /><span className="accent">with Cogens</span>
            </h3>
            <p className="c-card__subtitle">High-quality courses, taught by experts.</p>

            <div className="c-card__ctas">
              {mode === 'login' ? (
                !disablePublicAccountCreation && (
                  <button type="button" className="btn btn-outline-light btn-lg" onClick={goRegister}>
                    {formatMessage(registerMessages['create.account.for.free.button'])}
                  </button>
                )
              ) : (
                <button type="button" className="btn btn-outline-light btn-lg" onClick={goLogin}>
                  {formatMessage(loginMessages['sign.in.button'])}
                </button>
              )}
            </div>
          </aside>

          {/* Right side form area */}
          <main className="c-card__form">
            <header className="c-card__formHead">
              <h1>Start learning<br />with Cogens</h1>
              <p>High-quality courses, taught by experts.</p>
            </header>

            {/* No more faux button above inputs – it is removed */}
            {mode === 'login' ? (
              <LoginPage institutionLogin={false} handleInstitutionLogin={() => {}} />
            ) : (
              <RegistrationPage institutionLogin={false} handleInstitutionLogin={() => {}} />
            )}
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
