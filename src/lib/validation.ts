export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validatePhone = (phone: string): boolean => {
  // Colombian phone number validation (basic)
  const phoneRegex = /^(\+57)?[3][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateForm = (data: Record<string, any>, rules: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];
    
    if (rule.required) {
      const requiredError = validateRequired(value, rule.label || field);
      if (requiredError) {
        errors[field] = requiredError;
        return;
      }
    }
    
    if (value && rule.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Email no válido';
    }
    
    if (value && rule.type === 'password') {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        errors[field] = passwordValidation.errors[0];
      }
    }
    
    if (value && rule.type === 'phone' && !validatePhone(value)) {
      errors[field] = 'Número de teléfono no válido';
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} debe tener al menos ${rule.minLength} caracteres`;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} no puede tener más de ${rule.maxLength} caracteres`;
    }
  });
  
  return errors;
};