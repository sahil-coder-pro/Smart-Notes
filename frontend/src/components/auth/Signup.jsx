import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextInput, Alert } from 'flowbite-react';
import { Spinner } from 'flowbite-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    setLoading(true) ;
    e.preventDefault();
    try {
        await signup(name, email, password);
    } catch (err) {
        console.log(err) ;
        setError(err.response.data.message || 'Registration failed. Please try again.');
    }
    finally {
        setLoading(false) ;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-32 space-y-4">
      <TextInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      {error && <Alert className='text-center' color="failure">{error}</Alert>}
      <Button type="submit" className="w-full">{loading ? <Spinner/> : 'Sign up'}</Button>
    </form>
  );
}