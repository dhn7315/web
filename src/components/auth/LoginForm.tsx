'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import Link from 'next/link';

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <div className="e-card playing">
      <div className="wave" />
      <div className="wave" />
      <div className="wave" />

      <div className="relative z-10 flex flex-col gap-4 p-6 h-full text-foreground">
        <h1 className="text-3xl font-bold tracking-tighter title">Login</h1>
        <p className="message">Welcome back! Sign in to continue.</p>

        <form action={formAction} className="flex flex-col gap-4">
          <label>
            <input name="email" type="email" required className="input" placeholder=" " />
            <span>Email</span>
          </label>
          <label>
            <input name="password" type="password" required className="input" placeholder=" " />
            <span>Password</span>
          </label>
          
          {state?.error && <p className="text-destructive text-sm text-center">{state.error}</p>}
          
          <button type="submit" className="submit">Submit</button>
        </form>

        <div className="text-center">
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
        </div>
        
        <p className="signin mt-auto text-center">
          Don't have an account? <Link href="/register" className="font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
