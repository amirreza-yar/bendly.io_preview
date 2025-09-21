// Re-export GraphQL authentication functions
export {
  graphqlLogin as apiLogin,
  graphqlRegister as apiCreateAccount,
  graphqlLogout as apiLogout,
  graphqlGetProfile as apiGetProfile,
  graphqlRefreshToken as apiRefreshToken,
  // Legacy functions that are not implemented in GraphQL yet
  apiCheckEmail,
  apiSendEmailCode,
  apiVerifyEmailCode,
  apiVerifyMobileCode,
  apiResendMobileCode,
} from '@/lib/graphql/auth'
