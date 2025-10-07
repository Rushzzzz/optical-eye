// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,2}[\s\-\(]?[\d]{3}[\s\-\)]?[\d]{3}[\s\-]?[\d]{4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showAlert(message, type = 'info', containerId = 'alert-container') {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                type === 'error' ? 'exclamation-circle' : 
                type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    alert.innerHTML = `
        <i class="fas fa-${icon}"></i>
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Clear existing alerts
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Loading state helper
function setLoadingState(button, isLoading, loadingText = 'Loading...') {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<div class="loading"></div> ${loadingText}`;
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

// Auto-format phone input
function setupPhoneFormatting(inputId) {
    const phoneInput = document.getElementById(inputId);
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            // Limit to 10 digits for Indian mobile numbers
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            // No formatting - just allow 10 digits
            e.target.value = value;
        });
        
        // Add validation for Indian mobile numbers
        phoneInput.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length === 10 && /^[6-9]\d{9}$/.test(value)) {
                e.target.setCustomValidity('');
            } else if (value.length > 0) {
                e.target.setCustomValidity('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9');
            }
        });
    }
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup phone formatting for common phone input IDs
    setupPhoneFormatting('phone');
    setupPhoneFormatting('contactPhone');
    
    // Add loading animation CSS if not already present
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .alert {
                padding: 1rem 1.5rem;
                margin-bottom: 1rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                position: relative;
                animation: slideIn 0.3s ease-out;
            }
            
            .alert-success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .alert-error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .alert-warning {
                background-color: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }
            
            .alert-info {
                background-color: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            .alert-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                padding: 0.25rem;
                border-radius: 4px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .alert-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add smooth scroll behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle form submissions with better UX
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                // Add a small delay to show loading state
                setTimeout(() => {
                    if (submitBtn.disabled) {
                        setLoadingState(submitBtn, true, 'Processing...');
                    }
                }, 100);
            }
        });
    });
});

// Utility function to debounce search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        showAlert,
        setLoadingState,
        formatDate,
        formatPhoneNumber,
        setupPhoneFormatting,
        debounce
    };
}