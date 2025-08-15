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

  // Ensure CSRF token exists
  useEffect(() => {
    const s = getAuthService();
    if (s) s.getCsrfTokenService().getCsrfToken(getConfig().LMS_BASE_URL);
  }, []);

  // Which form to show
  const [mode, setMode] = useState(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  useEffect(() => {
    setMode(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  }, [selectedPage]);

  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;
  const canRegister = !disablePublicAccountCreation;

  const goLogin = () => {
    sendTrackEvent('edx.bi.login_form.toggled', { from: 'hero', category: 'user-engagement' });
    clearThirdPartyAuthContextErrorMessage();
    backupRegistrationForm();
    setMode('login');
    navigate(updatePathWithQueryParams(LOGIN_PAGE), { replace: true });
  };

  const goRegister = () => {
    sendTrackEvent('edx.bi.register_form.toggled', { from: 'hero', category: 'user-engagement' });
    clearThirdPartyAuthContextErrorMessage();
    backupLoginForm();
    setMode('register');
    navigate(updatePathWithQueryParams(REGISTER_PAGE), { replace: true });
  };

  return (
    <div className="c-shell">
      <div className="c-card">
        <div className="c-card__inner">
          {/* LEFT: blue hero panel (no logo square) */}
          <aside className="c-card__hero" aria-label="Welcome">
            <h3 className="c-card__title">
              {mode === 'login' ? (
                <>Welcome<br />Back!</>
              ) : (
                <>Start<br />learning<br /><span className="accent">with Cogens</span></>
              )}
            </h3>

            <p className="c-card__subtitle">
              High-quality courses, taught by experts.
            </p>

            {/* Switch buttons (replace the old top tabs) */}
            <div className="c-card__ctas">
              {mode === 'login' ? (
                canRegister && (
                  <button
                    type="button"
                    className="c-cta c-cta--light"
                    onClick={goRegister}
                  >
                    {formatMessage(registerMessages['create.account.for.free.button'])}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  className="c-cta c-cta--light"
                  onClick={goLogin}
                >
                  {formatMessage(loginMessages['sign.in.button'])}
                </button>
              )}
            </div>
          </aside>

          {/* RIGHT: form (we hide any built-in header via CSS) */}
          <main className="c-card__form">
            {mode === 'login' ? (
              <LoginPage institutionLogin={false} handleInstitutionLogin={() => { }} />
            ) : (
              <RegistrationPage institutionLogin={false} handleInstitutionLogin={() => { }} />
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

Logistration.defaultProps = {
  selectedPage: LOGIN_PAGE,
};

export default connect(null, {
  backupLoginForm,
  backupRegistrationForm,
  clearThirdPartyAuthContextErrorMessage,
})(Logistration);
