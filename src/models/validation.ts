/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import userSchema from './userSchema'

//validação de campos
export function validationMiddleware(request: any, response: any, next: any): void {
    const { error } = userSchema.validate(request.body);
    const valid = error == null;

    if (valid) {
        next();
    } else {
        const details: any  = error?.details;
        const message = details.map((i: { message: any; }) => i.message).join(',');

        // eslint-disable-next-line no-undef
        console.log("error", message);
        response.status(422).json({ error: message });
    }
}

export default validationMiddleware