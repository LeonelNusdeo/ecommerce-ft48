import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function PasswordMatch(targetPropertyName: string, validationOptions?: ValidationOptions) { // decorator factory
  return function (object: Object, propertyName: string) { // el decorator, "object" es la clase CreateUserDto, "propertyName" es la propiedad decorada ("confirmPassword" en CreateUserDto)
    registerDecorator({
      name: 'PasswordMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [targetPropertyName], // "password" en CreateUserDto
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const targetValue = (args.object as any)[targetPropertyName]; // "args.object" representa CreateUserDto, accede a "password"
          return typeof value === 'string' && typeof targetValue === 'string' && value === targetValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `Los valores de ${args.property} y ${targetPropertyName} deben coincidir.`;
        },
      },
    });
  };
}
