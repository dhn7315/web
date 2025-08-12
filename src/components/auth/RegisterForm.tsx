'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { registerAction } from './actions';

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, { error: null });

  return (
    <div className="e-card playing">
      <div className="wave" />
      <div className="wave" />
      <div className="wave" />

      <div className="relative z-10 flex flex-col gap-4 p-6 h-full text-foreground">
        <h1 className="text-3xl font-bold tracking-tighter title">Register</h1>
        <p className="message">Enroll now and get full access to our app.</p>
        
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <label className="w-full">
              <input name="firstName" required className="input" type="text" placeholder=" " />
              <span>Firstname</span>
            </label>
            <label className="w-full">
              <input name="lastName" required className="input" type="text" placeholder=" " />
              <span>Lastname</span>
            </label>
          </div>
          <label>
            <input name="email" type="email" required className="input" placeholder=" "/>
            <span>Email</span>
          </label>
          <label>
            <input name="password" type="password" required className="input" placeholder=" "/>
            <span>Password</span>
          </label>
          <label>
            <input name="confirmPassword" type="password" required className="input" placeholder=" "/>
            <span>Confirm Password</span>
          </label>
          
          {state.error && <p className="text-destructive text-sm text-center">{state.error}</p>}
          
          <button type="submit" className="submit">Submit</button>
        </form>
        
        <p className="signin mt-auto">
          Already have an account? <Link href="/login" className="font-semibold hover:underline">Signin</Link>
        </p>
      </div>
    </div>
  );
}
