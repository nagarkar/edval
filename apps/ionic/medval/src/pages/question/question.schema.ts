export interface IQuestion {
  id     : string;
  text   : string;
  type   : 'Rating'
  answer ?: number
}