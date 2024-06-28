import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions, isString } from 'class-validator';

@ValidatorConstraint({ name: 'isTimeFormat', async: false })
export class IsTimeFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!isString(value)) return false;
    
    // Regex para validar o formato de hora HH:mm
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'O valor deve estar no formato de hora HH:mm';
  }
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeFormatConstraint,
    });
  };
}
