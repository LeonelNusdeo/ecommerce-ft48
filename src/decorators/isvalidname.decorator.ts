import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^[A-Za-z\s\-'.]+$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage() {
          return `Formato de nombre inválido (debe contener letras en mayúscula/minúscula y caracteres especiales -'. )`;
        },
      },
    });
  };
}