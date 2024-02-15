import consola from 'consola';
import inquirer from 'inquirer';

enum Variant {
  success = 'success',
  error = 'error',
  info = 'info',
  warn = 'warn',
}

interface User {
  name: string;
  age: number;
}

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Edit = "edit",
  Quit = "quit"
}
type InquirerAnswers = {
  action: Action
}

class UsersData {
  data: User[] = [];

  public showAll(): void {
      consola.info('Users data');
    if (this.data.length > 0) {
      console.table(this.data);
    } else {
      consola.warn('No data...');
    }
  }

  public add(user: User): void {
    if (typeof user.age === 'number' && user.age > 0 && typeof user.name === 'string' && user.name.length > 0) {
      this.data.push(user);
      Message.showColorized(Variant.success, 'User has been successfully added!');
    } else {
      Message.showColorized(Variant.error, 'Wrong data!');
    }
  }

  public remove(userName: string): void {
    const index = this.data.findIndex(user => user.name === userName);
    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(Variant.success, 'User deleted!');
    } else {
      Message.showColorized(Variant.error, 'User not found...');
    }
  }

  public editUser(oldName: string, newName: string, newAge: number): void {
    const userIndex = this.data.findIndex(user => user.name.toLowerCase() === oldName.toLowerCase());
    if (userIndex !== -1) {
      this.data[userIndex] = { name: newName, age: newAge };
      Message.showColorized(Variant.success, 'User has been successfully edited!');
    } else {
      Message.showColorized(Variant.error, 'User not found...');
    }
  }
  

}

const users = new UsersData();

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    if (this.content.length > 0) {
      this.content = this.content[0].toUpperCase() + this.content.slice(1).toLowerCase();
    }
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  public static showColorized(variant: Variant, text: string): void {
    switch (variant) {
      case Variant.success:
        consola.success(text);
        break;
      case Variant.error:
        consola.error(text);
        break;
      case Variant.info:
        consola.info(text);
        break;
      case Variant.warn:
        consola.warn(text);
        break;
      default:
        consola.log(text);
    }
  }

}

console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Variant.info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("edit – edit an existing user");
console.log("quit – quit the app");
console.log("\n");

const startApp = async () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Edit:
        const { oldName } = await inquirer.prompt({
          name: 'oldName',
          type: 'input',
          message: 'Enter the name of the user you want to edit:',
        });
        const updates = await inquirer.prompt([
          {
            name: 'newName',
            type: 'input',
            message: 'Enter the new name of the user:',
          },
          {
            name: 'newAge',
            type: 'number',
            message: 'Enter the new age of the user:',
          }
        ]);
        users.editUser(oldName, updates.newName, updates.newAge);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(Variant.info, "Bye bye!");
        process.exit();
        break;
      default:
        Message.showColorized(Variant.warn, "Command not found. Available actions: list, add, remove, quit.");
        break;
    }
    startApp();
  });
}
startApp();