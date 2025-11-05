// Note: This is a Next.js Page Component.
// It imports 'next/link' and server actions from other files.
// It is *expected* to fail compilation in a standalone
// React preview environment. This code is correct for its
// intended file path (app/login/page.tsx) in your Next.js project.


import AuthForm from '../components/AuthForm';

// Separate component for the submit button to use useFormStatus
export default function LoginPage() {
 return (
<AuthForm/>
  );
}

