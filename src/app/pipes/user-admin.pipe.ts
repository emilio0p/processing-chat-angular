import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'user':
        return 'Cliente';
      case 'admin':
        return 'Administrador';
      default:
        return value;
    }
  }
}
