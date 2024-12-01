import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Auth Id is required' })
  auth_id: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'First name is required' })
  first_name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  phone_number: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'Postal code is required' })
  postal_code: string;

  @IsNotEmpty({ message: 'Unit number is required' })
  unit_number: string;

  profile_url?: string;

  @IsNotEmpty({ message: 'Accept marketing is required' })
  accept_marketing: boolean;
}
