const INITIAL_STATE = {
  email: '',
  password: '',
  code: '',
  user: {email:""},
  message: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'email_changed':
      return { ...state, email: action.payload, message: '' };
    case 'password_changed':
      return { ...state, password: action.payload };
    case 'code_changed':
      return{ ...state, code: action.payload };
    case 'clear_auth_fields':
      return { ...state, ...INITIAL_STATE };
    case 'start_loading':
      return { ...state, loading: true };
    case 'stop_loading':
      return { ...state, loading: false };
    case 'signin_user':
      return { ...state, loading: true, message: '' };
    case 'signup_user':
      return { ...state, loading: true, message: '' };
    case 'signout_user':
      return { ...state, ...INITIAL_STATE, message: action.payload };
    case 'login_user_success':
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case 'auth_fail':
      return { ...state, ...INITIAL_STATE, message: action.payload };
    default:
      return state;
  }
};
