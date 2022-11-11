const username: string = 'Nicolas';
const sum = (a: number, b: number) => {
  return a + b;
}

sum(1, 3);

class Person {
  constructor(public age: number, public lastName: string) {}
}

const nico = new Person(36, 'Paggiola');
nico.age = 15;
