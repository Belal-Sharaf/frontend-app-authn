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
import { RegistrationPage } from '../register';

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
  const { formatMessage } = useIntl(); // kept in case messages are needed later
  const navigate = useNavigate();

  // Ensure CSRF is available
  useEffect(() => {
    const s = getAuthService();
    if (s) s.getCsrfTokenService().getCsrfToken(getConfig().LMS_BASE_URL);
  }, []);

  // Which form to show
  const [mode, setMode] = useState(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  useEffect(() => {
    setMode(selectedPage === REGISTER_PAGE ? 'register' : 'login');
  }, [selectedPage]);

  // Tab replacement handlers (kept for future use if you re-enable CTA switching)
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

  // Use theming pipeline so Tutor serves the hashed file automatically
  const logoUrl = `${getConfig().LMS_BASE_URL}/theming/assets/images/logo.png`;

  return (
    <div className="c-shell">
      <div className="c-card">
        <div className="c-card__inner">
          {/* Blue hero panel */}
          <aside className="c-card__hero" aria-label="Welcome">
            <div className="c-brand" aria-label="Cogens brand">
              <span className="c-brand__box" aria-hidden />
              <img className="c-brand__logo" src={logoUrl} alt="Cogens" />
            </div>

            <h3 className="c-card__title">
              Start<br />learning<br /><span className="accent">with Cogens</span>
            </h3>
            <p className="c-card__subtitle">High-quality courses, taught by experts.</p>

            {/* NOTE: hero CTAs removed on purpose */}
          </aside>

          {/* Form area */}
          <main className="c-card__form">
            {/* Hide any legacy tab header via CSS; render only the chosen mode */}
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
