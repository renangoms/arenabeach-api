module.exports = {
  apps: [{
    name: 'api_cigamweb',
    script: 'main.js',
    env: {
      DATABASE_URL: 'postgresql://supervisor:-9rstz4wNe2zHTRsSDrYEQ@sport-booking-app-14948.7tt.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
      JWT_SECRET: '16234',
      CHARGE_EXPIRES_IN: '300',
      RESET_PASSWORD_JWT_SECRET: 'resetpasswordbookingapp',
      FRONTEND_URL: 'arenabeachone.com.br',
      EMAIL_USER: 'arenabeachone01@gmail.com',
      EMAIL_PASSWORD: 'brgqzlvrazdregko',
      PAYMENT_AUTH_TOKEN: 'Q2xpZW50X0lkXzI0NTU3OWMyLTE0NzYtNGVlZi04NGM0LWQxNGZkM2FlMzY2MTpDbGllbnRfU2VjcmV0X0JsSXVjbEFCVXR0VFpVemJnTVErTXl5Qkd3UTFPeHpQRC9YdUJqSUN4TEE9',
    },
  }],
};
