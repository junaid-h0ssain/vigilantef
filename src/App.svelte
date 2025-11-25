<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import {auth, emailSignup, emailLogin, googleLogin, logout} from './login.js';

  let email = '';
  let password = '';
  let user = null;
  let loading = true;
  let errorMessage = '';

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
      loading = false;
    });

    return unsubscribe;
  });

  async function handleSignup(event) {
    event.preventDefault();
    errorMessage = '';
    const result = await emailSignup(email, password);
    if (!result.success) {
      errorMessage = result.error;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    errorMessage = '';
    const result = await emailLogin(email, password);
    if (!result.success) {
      errorMessage = result.error;
    }
  }

  function handleLogout() {
    logout();
  }
  
</script>

<main>
    <h1>Hello to the welcome page</h1>

    {#if loading}
      <p>Loading...</p>
    {:else if user}
      <h2>Welcome, {user.email}!</h2>
      <p>You are logged in.</p>
      <button on:click={handleLogout}>Logout</button>
    {:else}
      {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
      {/if}

      <h2>Sign Up</h2>
      <form on:submit={handleSignup}>
        <label for="signup-email">Email:</label>
        <input type="email" id="signup-email" bind:value={email} required>
        <br>
        <label for="signup-password">Password:</label>
        <input type="password" id="signup-password" bind:value={password} required>
        <br>
        <button type="submit">Sign up with email</button>
      </form>

      <h2>Login</h2>
      <form on:submit={handleLogin}>
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" bind:value={email} required>
        <br>
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" bind:value={password} required>
        <br>
        <button type="submit">Login with email</button>
      </form>

      <h2>Or</h2>
      <button on:click={() => googleLogin()}>Sign in with Google</button>
    {/if}
    </main>

    <style>

    </style>
