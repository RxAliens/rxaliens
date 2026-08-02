declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): {
      get(...args: unknown[]): any;
      all(...args: unknown[]): any[];
      run(...args: unknown[]): any;
    };
  }
}
