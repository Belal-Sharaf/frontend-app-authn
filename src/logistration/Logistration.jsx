// src/logistration/Logistration.jsx
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { getAuthService } from '@edx/frontend-platform/auth';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import BaseContainer from '../base-container';
import messages from '../common-components/messages';
import { LOGIN_PAGE, REGISTER_PAGE } from '../data/constants';
import { updatePathWithQueryParams } from '../data/utils';

import { LoginPage } from '../login';
import { RegistrationPage } from '../register';
import { backupLoginForm } from '../login/data/actions';
import { backupRegistrationForm } from '../register/data/actions';
import { clearThirdPartyAuthContextErrorMessage } from '../common-components/data/actions';

const Logistration = ({
  selectedPage,
  backupLoginForm,
  backupRegistrationForm,
  clearThirdPartyAuthContextErrorMessage,
}) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  // Ensure CSRF is available
  useEffect(() => {
    const s = getAuthService();
    if (s) {
      s.getCsrfTokenService().getCsrfToken(getConfig().LMS_BASE_URL);
    }
  }, []);

  // Which form to show inside the card
  const [mode, setMode] = useState(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  useEffect(() => {
    setMode(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  }, [selectedPage]);

  const disablePublicAccountCreation = getConfig().ALLOW_PUBLIC_ACCOUNT_CREATION === false;

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

  return (
    <BaseContainer>
      <section className="c-card-only page-safe-area">
        <div className="c-card">
          <div className="c-card__inner">
            {/* Blue hero panel (left) */}
            <aside className="c-card__hero">
              <div className="c-card__mark" aria-hidden />
              <h3 className="c-card__title">
                Start<br />learning<br /><span className="accent">with Cogens</span>
              </h3>
              <p className="c-card__subtitle">High-quality courses, taught by experts.</p>

              {/* CTAs replace old tabs */}
              <div className="c-card__ctas">
                {mode === 'login' ? (
                  !disablePublicAccountCreation && (
                    <button type="button" className="btn btn-outline-light btn-lg" onClick={goRegister}>
                      {formatMessage(messages['create.account.for.free.button'])}
                    </button>
                  )
                ) : (
                  <button type="button" className="btn btn-outline-light btn-lg" onClick={goLogin}>
                    {formatMessage(messages['sign.in.button'])}
                  </button>
                )}
              </div>
            </aside>

            {/* Form area (right) */}
            <main className="c-card__form">
              {mode === 'login' ? (
                <LoginPage institutionLogin={false} handleInstitutionLogin={() => {}} />
              ) : (
                <RegistrationPage institutionLogin={false} handleInstitutionLogin={() => {}} />
              )}
            </main>
          </div>
        </div>
      </section>
    </BaseContainer>
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
