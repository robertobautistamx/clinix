// Hook/util simple para validar formularios por campos
export type FieldRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
};

export type ValidationRules = Record<string, FieldRule>;

export function validateFields(rules: ValidationRules, values: Record<string, any>) {
  const errors: Record<string, string> = {};

  for (const key of Object.keys(rules)) {
    const rule = rules[key];
    const val = values[key];

    if (rule.required) {
      const empty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
      if (empty) {
        errors[key] = rule.message || 'Campo obligatorio';
        continue;
      }
    }

    if (rule.minLength && typeof val === 'string') {
      if (val.trim().length < rule.minLength) {
        errors[key] = rule.message || `Mínimo ${rule.minLength} caracteres`;
        continue;
      }
    }

    if (rule.maxLength && typeof val === 'string') {
      if (val.trim().length > rule.maxLength) {
        errors[key] = rule.message || `Máximo ${rule.maxLength} caracteres`;
        continue;
      }
    }

    if (rule.pattern && typeof val === 'string') {
      if (!rule.pattern.test(val)) {
        errors[key] = rule.message || 'Formato inválido';
        continue;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors } as const;
}
