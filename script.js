// Make updateSelectedLength available globally
function updateSelectedLength() {
    const selectedInput = document.querySelector('input[name="length"]:checked');
    document.getElementById('selectedLength').textContent = selectedInput.value;
}

document.addEventListener('DOMContentLoaded', function() {
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const lengthInputs = document.querySelectorAll('input[name="length"]');

    const numbers = '0123456789';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const special = '!@#$%^&*';

    function showMessage(element, duration = 2000) {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, duration);
    }

    function generatePassword() {
        // Get selected length
        const length = document.querySelector('input[name="length"]:checked').value;

        // Get selected character types
        const useNumbers = document.getElementById('numbers').checked;
        const useUppercase = document.getElementById('uppercase').checked;
        const useLowercase = document.getElementById('lowercase').checked;
        const useSpecial = document.getElementById('special').checked;

        // Validate at least one type is selected
        if (!useNumbers && !useUppercase && !useLowercase && !useSpecial) {
            showMessage(errorMessage);
            return;
        }

        // Build character pool
        let chars = '';
        if (useNumbers) chars += numbers;
        if (useUppercase) chars += uppercase;
        if (useLowercase) chars += lowercase;
        if (useSpecial) chars += special;

        // Generate password
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        // Ensure at least one character from each selected type
        if (useNumbers && !/\d/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      numbers[Math.floor(Math.random() * numbers.length)] + 
                      password.substring(pos + 1);
        }
        if (useUppercase && !/[A-Z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      uppercase[Math.floor(Math.random() * uppercase.length)] + 
                      password.substring(pos + 1);
        }
        if (useLowercase && !/[a-z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      lowercase[Math.floor(Math.random() * lowercase.length)] + 
                      password.substring(pos + 1);
        }
        if (useSpecial && !/[!@#$%^&*]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = password.substring(0, pos) + 
                      special[Math.floor(Math.random() * special.length)] + 
                      password.substring(pos + 1);
        }

        passwordOutput.value = password;
        updateSelectedLength(); // Update length indicator after generating password
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(passwordOutput.value);
            showMessage(successMessage);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyToClipboard);

    // Add change event listener to length options container (event delegation)
    document.getElementById('lengthOptions').addEventListener('change', function(e) {
        if (e.target.name === 'length') {
            document.getElementById('selectedLength').textContent = e.target.value;
        }
    });

    // Initialize with default values
    generatePassword();
    document.getElementById('selectedLength').textContent = document.querySelector('input[name="length"]:checked').value;
});
