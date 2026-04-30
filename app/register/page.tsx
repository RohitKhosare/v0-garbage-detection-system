'use client';

import { supabase } from '@/lib/supabaseClient';

const handleRegister = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) alert(error.message);
  else alert('Check your email for confirmation');
};