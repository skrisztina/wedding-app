import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

  transform(value: string): string {
    if(!value) return value;

    const cleanValue = value.replace(/\D/g, '');

    // Ellenőrizzük, hogy a hossz helyes-e (10 vagy 11 karakter)
    if (cleanValue.length === 10) {
      // Formázzuk a telefonszámot a kívánt formátumra: 06 30 123 4567
      return cleanValue.replace(/(\d{2})(\d{2})(\d{7})/, '$1 $2 $3');
    } else if (cleanValue.length === 11 && cleanValue.startsWith('0')) {
      // Ha 11 karakter és a 0-val kezdődik (pl. +36 30...), akkor is formázzuk
      return cleanValue.replace(/(\d{2})(\d{2})(\d{7})/, '$1 $2 $3');
    }
    
    return value;
  }

}
