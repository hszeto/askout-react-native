const INITIAL_STATE = {
  email: '',
  password: '',
  user: {email:""},
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'email_changed':
      return { ...state, email: action.payload, error: '' };
    case 'password_changed':
      return { ...state, password: action.payload };
    case 'clear_auth_fields':
      return { ...state, ...INITIAL_STATE };
    case 'login_user':
      return { ...state, loading: true, error: '' };
    case 'signup_user':
      return { ...state, loading: true, error: '' };
    case 'logout_user':
      return { ...state, ...INITIAL_STATE};
    case 'login_user_success':
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case 'login_user_fail':
      return { ...state, error: action.payload, password: '', loading: false };
    default:
      return state;
  }
};
