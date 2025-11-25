<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import PostView from "./lib/PostView.svelte";
  import AltLogin from "./lib/AltLogin.svelte";
  import {
    auth,
    emailSignup,
    emailLogin,
    googleLogin,
    phoneLogin,
    verifyPhoneOtp,
    logout,
  } from "./login.js";

  let email = "";
  let password = "";
  let phoneNumber = "";
  let otpCode = "";
  let user = null;
  let loading = true;
  let errorMessage = "";
  let showOtpInput = false;

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
      loading = false;
    });

    return unsubscribe;
  });

  async function handleSignup() {
    errorMessage = "";
    const result = await emailSignup(email, password);
    if (!result.success) {
      errorMessage = result.error;
    }
  }

  async function handleLogin() {
    errorMessage = "";
    const result = await emailLogin(email, password);
    if (!result.success) {
      errorMessage = result.error;
    }
  }

  async function handlePhoneLogin() {
    errorMessage = "";
    const result = await phoneLogin(phoneNumber);
    if (result.success) {
      showOtpInput = true;
    } else {
      errorMessage = result.error;
    }
  }

  async function handleVerifyOtp() {
    errorMessage = "";
    const result = await verifyPhoneOtp(otpCode);
    if (!result.success) {
      errorMessage = result.error;
    } else {
      showOtpInput = false;
      otpCode = "";
      phoneNumber = "";
    }
  }

  function handleLogout() {
    logout();
  }
</script>

<main>
  <h1>Hello to the welcome page</h1>

  
  <AltLogin/>
</main>

<style>
</style>
