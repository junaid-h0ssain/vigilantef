<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { onAuthStateChanged } from "firebase/auth";
    import PostView from "./postView.svelte";
    
    import {
        auth,
        emailSignup,
        emailLogin,
        googleLogin,
        phoneLogin,
        verifyPhoneOtp,
        logout,
        changePassword,
        recoverPassword,
    } from "../login.js";

    let email = "";
    let password = "";
    let phoneNumber = "";
    let otpCode = "";
    let user = null;
    let loading = true;
    let errorMessage = "";
    let successMessage = "";
    let showOtpInput = false;
    let showChangePassword = false;
    let showForgotPassword = false;
    let currentPassword = "";
    let newPassword = "";
    let recoveryEmail = "";

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

    async function handleChangePassword() {
        errorMessage = "";
        successMessage = "";
        const result = await changePassword(currentPassword, newPassword);
        if (result.success) {
            successMessage = result.message;
            currentPassword = "";
            newPassword = "";
            showChangePassword = false;
        } else {
            errorMessage = result.error;
        }
    }

    async function handleRecoverPassword() {
        errorMessage = "";
        successMessage = "";
        const result = await recoverPassword(recoveryEmail);
        if (result.success) {
            successMessage = result.message;
            recoveryEmail = "";
            showForgotPassword = false;
        } else {
            errorMessage = result.error;
        }
    }
</script>

<main>
    {#if loading}
        <p>Loading...</p>
    {:else if user}
        <h2>Welcome, {user.email || user.phoneNumber}!</h2>
        <p>You are logged in.</p>
        
        {#if errorMessage}
            <p style="color: red;">{errorMessage}</p>
        {/if}
        {#if successMessage}
            <p style="color: green;">{successMessage}</p>
        {/if}

        <PostView />

        {#if !showChangePassword}
            <button on:click={() => { showChangePassword = true; errorMessage = ""; successMessage = ""; }}>Change Password</button>
        {:else}
            <h3>Change Password</h3>
            <form on:submit|preventDefault={handleChangePassword}>
                <label for="current-password">Current Password:</label>
                <input type="password" id="current-password" bind:value={currentPassword} required />
                <br />
                <label for="new-password">New Password:</label>
                <input type="password" id="new-password" bind:value={newPassword} required />
                <br />
                <button type="submit">Update Password</button>
                <button type="button" on:click={() => { showChangePassword = false; currentPassword = ""; newPassword = ""; }}>Cancel</button>
            </form>
        {/if}

        <button on:click={handleLogout}>Logout</button>
    {:else}
        {#if errorMessage}
            <p style="color: red;">{errorMessage}</p>
        {/if}
        {#if successMessage}
            <p style="color: green;">{successMessage}</p>
        {/if}

        {#if showForgotPassword}
            <h2>Recover Password</h2>
            <form on:submit|preventDefault={handleRecoverPassword}>
                <label for="recovery-email">Email:</label>
                <input type="email" id="recovery-email" bind:value={recoveryEmail} required />
                <br />
                <button type="submit">Send Reset Email</button>
                <button type="button" on:click={() => { showForgotPassword = false; recoveryEmail = ""; }}>Back to Login</button>
            </form>
        {:else}

        <h2>Sign Up</h2>
        <form on:submit|preventDefault={handleSignup}>
            <label for="signup-email">Email:</label>
            <input type="email" id="signup-email" bind:value={email} required />
            <br />
            <label for="signup-password">Password:</label>
            <input
                type="password"
                id="signup-password"
                bind:value={password}
                required
            />
            <br />
            <button type="submit">Sign up with email</button>
        </form>

        <h2>Login</h2>
        <form on:submit|preventDefault={handleLogin}>
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" bind:value={email} required />
            <br />
            <label for="login-password">Password:</label>
            <input
                type="password"
                id="login-password"
                bind:value={password}
                required
            />
            <br />
            <button type="submit">Login with email</button>
        </form>
        <button type="button" on:click={() => { showForgotPassword = true; errorMessage = ""; successMessage = ""; }}>Forgot Password?</button>

        <h2>Or</h2>
        <button on:click={() => googleLogin()}>Sign in with Google</button>

        <h2>Phone Login</h2>
        {#if !showOtpInput}
            <form on:submit|preventDefault={handlePhoneLogin}>
                <label for="phone-number"
                    >Enter your number +880 1234567890</label
                >
                <input
                    type="tel"
                    id="phone-number"
                    bind:value={phoneNumber}
                    placeholder="+1234567890"
                    required
                />
                <br />
                <button type="submit">Send OTP</button>
            </form>
            <div id="recaptcha-container"></div>
        {:else}
            <form on:submit|preventDefault={handleVerifyOtp}>
                <label for="otp-code">Enter OTP Code:</label>
                <input
                    type="text"
                    id="otp-code"
                    bind:value={otpCode}
                    placeholder="000000"
                    maxlength="6"
                    required
                />
                <br />
                <button type="submit">Verify OTP</button>
                <button
                    type="button"
                    on:click={() => {
                        showOtpInput = false;
                        otpCode = "";
                    }}>Back</button
                >
            </form>
        {/if}
        {/if}
    {/if}
    
</main>
