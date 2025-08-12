'use server';

import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';

export async function loginAction(
  previousState: { error: string | null },
  formData: FormData
) {
  if (!auth) {
    return { error: 'Firebase is not configured correctly.' };
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    if (e.code) {
      switch (e.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'An unknown error occurred. Please try again.' };
      }
    }
    return { error: 'An unknown error occurred. Please try again.' };
  }

  redirect('/');
}


export async function registerAction(
  previousState: { error: string | null },
  formData: FormData
) {
  if (!auth || !db) {
    return { error: 'Firebase is not configured correctly.' };
  }
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return { error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }
  
  if(password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }


  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    try {
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            createdAt: new Date(),
        });
    } catch (dbError) {
        console.error("Firestore Error: Failed to write user document.", dbError);
        // This part is crucial: we don't block the user from being created if firestore fails.
        // We just log the error. In a real-world app, you might want to add this to a retry queue.
    }

  } catch (e: any) {
    if (e.code) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          return { error: 'This email is already registered.' };
        case 'auth/invalid-email':
          return { error: 'Please enter a valid email address.' };
        case 'auth/weak-password':
          return { error: 'Password is too weak. Please choose a stronger one.' };
        default:
          return { error: 'An unknown error occurred during registration.' };
      }
    }
     return { error: 'An unknown error occurred. Please try again.' };
  }

  redirect('/');
}
