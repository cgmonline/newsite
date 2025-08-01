console.log('🔄 Processing Auth0 callback...');

window.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('callback-status');
    const spinnerEl = document.getElementById('loading-spinner');
    const errorActionsEl = document.getElementById('error-actions');
    
    function setStatus(message, isError = false, hideSpinner = false) {
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = isError ? 'status error' : 'status';
        }
        if (hideSpinner && spinnerEl) {
            spinnerEl.style.display = 'none';
        }
        if (isError && errorActionsEl) {
            errorActionsEl.style.display = 'block';
        }
    }

    try {
        // Wait for Auth0 to be ready
        const client = await window.auth0ClientPromise;
        
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('error')) {
            const error = urlParams.get('error_description') || urlParams.get('error') || 'Authentication failed';
            console.error('❌ Auth0 error:', error);
            setStatus(`Authentication failed: ${error}`, true, true);
            return;
        }
        
        if (urlParams.has('code') && urlParams.has('state')) {
            console.log('Processing authorization code...');
            setStatus('Completing sign in...');
            
            try {
                // Handle the callback
                await client.handleRedirectCallback();
                
                // Get user info
                const user = await client.getUser();
                console.log('✅ Authentication successful:', user?.email || user?.name);
                
                setStatus('Success! Redirecting...', false, true);
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Broadcast auth success event
                window.dispatchEvent(new CustomEvent('authStateChanged', { 
                    detail: { user, isAuthenticated: true } 
                }));
                
                // Redirect after short delay
                setTimeout(() => {
                    const returnTo = sessionStorage.getItem('auth0_return_to') || '/';
                    sessionStorage.removeItem('auth0_return_to');
                    window.location.replace(returnTo);
                }, 1500);
                
            } catch (callbackError) {
                console.error('❌ Callback processing failed:', callbackError);
                setStatus('Authentication processing failed. Please try again.', true, true);
            }
        } else {
            console.log('No valid callback parameters, redirecting home...');
            setStatus('Invalid callback parameters. Redirecting...', true, true);
            setTimeout(() => window.location.replace('/'), 2000);
        }
        
    } catch (error) {
        console.error('❌ Callback handler failed:', error);
        setStatus('Authentication service unavailable. Please try again.', true, true);
    }
});
