export interface IloginForm {
  email: string;
  password: string;
}

export interface IregisterForm extends IloginForm {
  first_name: string;
  second_name: string;
}

export interface IresetPasswordConfirm {
  uid: string | string[];
  token: string | string[];
  new_password: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface ImessageResponse {
  message: string;
}
