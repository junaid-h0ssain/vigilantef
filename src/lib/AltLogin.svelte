<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { fireApp } from '../../firebase-config.js';
    import { getAuth } from 'firebase/auth';

    let auth;
    let ui;
    let loading = true;

    onMount(() => {
        // Initialize Firebase Auth
        auth = getAuth(fireApp);

        // Load Firebase compat version first
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
        firebaseScript.async = true;
        firebaseScript.onload = () => {
            // Initialize compat Firebase app
            firebase.initializeApp(firebaseConfig);

            // Load Firebase Auth compat
            const authScript = document.createElement('script');
            authScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js';
            authScript.async = true;
            authScript.onload = () => {
                // Load FirebaseUI
                const uiScript = document.createElement('script');
                uiScript.src = 'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js';
                uiScript.async = true;
                uiScript.onload = () => {
                    initializeFirebaseUI();
                };
                document.head.appendChild(uiScript);
            };
            document.head.appendChild(authScript);
        };
        document.head.appendChild(firebaseScript);

        return () => {
            // Cleanup
            if (ui) {
                ui.delete();
            }
        };
    });

    function initializeFirebaseUI() {
        // Initialize the FirebaseUI Widget with compat Firebase
        ui = new firebaseui.auth.AuthUI(firebase.auth());

        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in
                    console.log('User signed in:', authResult.user);
                    return false; // Don't redirect automatically
                },
                uiShown: function() {
                    // The widget is rendered
                    loading = false;
                }
            },
            signInFlow: 'popup',
            signInOptions: [
                // Email/Password
                {provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: false},
                // Google
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Phone Number
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: 'image',
                        size: 'normal',
                        badge: 'bottomleft'
                    },
                    defaultCountry: 'US'
                }
            ],
            tosUrl: '<your-tos-url>',
            privacyPolicyUrl: '<your-privacy-policy-url>'
        };

        // Start the UI
        ui.start('#firebaseui-auth-container', uiConfig);
    }
</script>

<svelte:head>
    <link
        type="text/css"
        rel="stylesheet"
        href="https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.css"
    />
</svelte:head>

<main>
    {#if loading}
        <div id="loader">Loading authentication...</div>
    {/if}
    <div id="firebaseui-auth-container"></div>
</main>

<style>
    main {
        padding: 2rem;
    }

    #loader {
        text-align: center;
        padding: 2rem;
        font-size: 1.1rem;
    }
</style>
