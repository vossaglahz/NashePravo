import { ValidationError } from 'class-validator';

export const formatErrors = (errors: ValidationError[] | Error) => {
    const updatedErrors: { type: string; messages: string[] }[] = [];

    if (Array.isArray(errors)) {
        errors.forEach(e => {
            if (e.constraints) {
                const error = {
                    type: e.property,
                    messages: Object.values(e.constraints),
                };
                updatedErrors.push(error);
            }
        });
    } else if (errors instanceof Error) {
        updatedErrors.push({
            type: 'general',
            messages: [errors.message],
        });
    }

    return updatedErrors;
};
