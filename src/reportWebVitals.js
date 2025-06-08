const reportWebVitals = onPerfEntry => {
  // Web Vitals disabled for deployment compatibility
  // Can be re-enabled later with proper configuration
  if (onPerfEntry && onPerfEntry instanceof Function) {
    console.log('Web Vitals reporting is available but disabled for deployment');
  }
};

export default reportWebVitals;
