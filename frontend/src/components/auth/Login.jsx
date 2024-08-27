import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextInput, Alert } from 'flowbite-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-32 space-y-4">
      <TextInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <Alert color="failure">{error}</Alert>}
      <Button type="submit" className="w-full">Login</Button>
    </form>
  );
}