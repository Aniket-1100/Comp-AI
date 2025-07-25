import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-card animate-gradient-move">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md p-8 shadow-xl border-border bg-card/90 backdrop-blur-md">
          <CardHeader className="mb-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in</h1>
            <p className="text-muted-foreground text-sm">Welcome back! Please login to your account.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="peer focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder=" "
                />
                <label className="absolute left-3 top-2 text-muted-foreground text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">Email</label>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="peer focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder=" "
                />
                <label className="absolute left-3 top-2 text-muted-foreground text-sm transition-all duration-200 pointer-events-none peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">Password</label>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">
                  {error}
                </motion.div>
              )}
              <Button type="submit" className="w-full" variant="electric">Login</Button>
            </form>
            <Button variant="link" className="mt-6 w-full text-primary underline-offset-4 hover:underline" onClick={() => navigate('/register')}>Register</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login; 