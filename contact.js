// Contact Form JavaScript with Validation and Local Storage
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successMessage = document.getElementById('successMessage');

    // Load saved data from localStorage when page loads
    loadSavedData();

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous error states
        hideAllErrors();
        
        // Get form values
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();
        
        // Validation flags
        let isValid = true;
        
        // Validate name (should not be empty)
        if (name === '') {
            showError(nameError, 'Please provide a name');
            isValid = false;
        }
        
        // Validate email (should not be empty and must contain @)
        if (email === '') {
            showError(emailError, 'Please provide an email address');
            isValid = false;
        } else if (!email.includes('@')) {
            showError(emailError, 'Please provide a valid email address with @');
            isValid = false;
        }
        
        // Validate message (should not be empty)
        if (message === '') {
            showError(messageError, 'Please provide a message');
            isValid = false;
        }
        
        // If all validations pass
        if (isValid) {
            // Save to localStorage
            saveToLocalStorage(name, email, message);
            
            // Show success message
            showSuccessMessage();
            
            // Clear form
            clearForm();
            
            // Log saved data (for debugging)
            console.log('Contact data saved:', getContactData());
        }
    });

    // Real-time validation on input blur
    nameField.addEventListener('blur', function() {
        const name = this.value.trim();
        if (name === '') {
            showError(nameError, 'Please provide a name');
        } else {
            hideError(nameError);
        }
    });

    emailField.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email === '') {
            showError(emailError, 'Please provide an email address');
        } else if (!email.includes('@')) {
            showError(emailError, 'Please provide a valid email address with @');
        } else {
            hideError(emailError);
        }
    });

    messageField.addEventListener('blur', function() {
        const message = this.value.trim();
        if (message === '') {
            showError(messageError, 'Please provide a message');
        } else {
            hideError(messageError);
        }
    });

    // Clear error messages when user starts typing
    nameField.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            hideError(nameError);
        }
    });

    emailField.addEventListener('input', function() {
        const email = this.value.trim();
        if (email !== '' && email.includes('@')) {
            hideError(emailError);
        }
    });

    messageField.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            hideError(messageError);
        }
    });

    // Helper function to show error message
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.parentNode.querySelector('input, textarea').style.borderColor = '#d63384';
    }

    // Helper function to hide error message
    function hideError(errorElement) {
        errorElement.style.display = 'none';
        errorElement.parentNode.querySelector('input, textarea').style.borderColor = '#e1ddd4';
    }

    // Helper function to hide all error messages
    function hideAllErrors() {
        hideError(nameError);
        hideError(emailError);
        hideError(messageError);
        successMessage.style.display = 'none';
    }

    // Helper function to show success message
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 5 seconds
        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 5000);
    }

    // Helper function to clear form
    function clearForm() {
        nameField.value = '';
        emailField.value = '';
        messageField.value = '';
    }

    // Save contact data to localStorage
    function saveToLocalStorage(name, email, message) {
        const contactData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            id: Date.now() // Simple ID based on timestamp
        };
        
        // Get existing contacts array or create new one
        let contacts = JSON.parse(localStorage.getItem('streetFoodContacts') || '[]');
        
        // Add new contact to beginning of array (most recent first)
        contacts.unshift(contactData);
        
        // Keep only last 10 contacts to avoid localStorage getting too large
        if (contacts.length > 10) {
            contacts = contacts.slice(0, 10);
        }
        
        // Save back to localStorage
        localStorage.setItem('streetFoodContacts', JSON.stringify(contacts));
        
        // Also save the latest contact data separately for easy access
        localStorage.setItem('streetFoodLatestContact', JSON.stringify(contactData));
    }

    // Load saved data from localStorage (loads the most recent contact)
    function loadSavedData() {
        try {
            const savedContact = localStorage.getItem('streetFoodLatestContact');
            if (savedContact) {
                const contactData = JSON.parse(savedContact);
                console.log('Last saved contact loaded:', contactData);
            }
        } catch (error) {
            console.error('Error loading saved contact data:', error);
        }
    }

    // Get all contact data from localStorage
    function getContactData() {
        try {
            return JSON.parse(localStorage.getItem('streetFoodContacts') || '[]');
        } catch (error) {
            console.error('Error retrieving contact data:', error);
            return [];
        }
    }

    // Get latest contact data from localStorage
    function getLatestContactData() {
        try {
            return JSON.parse(localStorage.getItem('streetFoodLatestContact'));
        } catch (error) {
            console.error('Error retrieving latest contact data:', error);
            return null;
        }
    }

    // Clear all contact data from localStorage
    function clearContactData() {
        localStorage.removeItem('streetFoodContacts');
        localStorage.removeItem('streetFoodLatestContact');
        console.log('All contact data cleared from localStorage');
    }

    // Make functions available globally for debugging/testing
    window.streetFoodContact = {
        getContactData: getContactData,
        getLatestContactData: getLatestContactData,
        clearContactData: clearContactData,
        loadSavedData: loadSavedData
    };

    // Display contact count in console
    const contactCount = getContactData().length;
    if (contactCount > 0) {
        console.log(`Found ${contactCount} saved contact(s) in localStorage`);
    }
});