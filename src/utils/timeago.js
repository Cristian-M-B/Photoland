import { format, register } from 'timeago.js'

register('es_ES', (number, index, total_sec) => [
    ['Justo ahora', 'Ahora mismo'],
    ['Hace %s segundos', 'En %s segundos'],
    ['Hace 1 minuto', 'En 1 minuto'],
    ['Hace %s minutos', 'En %s minutos'],
    ['Hace 1 hora', 'En 1 hora'],
    ['Hace %s horas', 'En %s horas'],
    ['Hace 1 día', 'En 1 día'],
    ['Hace %s días', 'En %s días'],
    ['Hace 1 semana', 'En 1 semana'],
    ['Hace %s semanas', 'En %s semanas'],
    ['Hace 1 mes', 'En 1 mes'],
    ['Hace %s meses', 'En %s meses'],
    ['Hace 1 año', 'En 1 año'],
    ['Hace %s años', 'En %s años']
][index])

export default function getTime(date) {
    return format(date, 'es_ES')
}