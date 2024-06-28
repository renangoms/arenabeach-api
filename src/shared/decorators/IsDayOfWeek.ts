import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDayOfWeek(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isWeekDay',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'number' && value >= 0 && value <= 6;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um dia da semana válido (0 a 6)`;
        },
      },
    });
  };
}
