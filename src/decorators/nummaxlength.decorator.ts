import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function NumMaxLength(integer: number, decimal: number, options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NumMaxLength',
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [integerPart, decimalPart] = value.toString().split('.');
          if (decimalPart) {
            return integerPart.length <= integer && decimalPart.length <= decimal;
          } else {
            return integerPart.length <= integer;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe tener como máximo ${integer} digitos y ${decimal} decimales`;
        },
      },
    });
  };
}
