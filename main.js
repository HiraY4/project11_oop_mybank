#!/usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import showBanner from "node-banner";
class customer {
    firstname;
    lastname;
    gender;
    age;
    mobileNumber;
    accountnumber;
    constructor(firstname, lastname, gender, age, mobileNumber, accountnumber) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.accountnumber = accountnumber;
    }
}
class bank {
    Customer = [];
    account = [];
    addCustomers(object) {
        this.Customer.push(object);
    }
    addAccount(object) {
        this.account.push(object);
    }
    transaction(object) {
        let newAccount = this.account.filter(account => account.accountnumber !== object.accountnumber);
        this.account = [...newAccount, object];
    }
}
(async () => {
    await showBanner("BANK", "OOP MY BANK", "red", "white");
})();
let mybank = new bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName();
    let lName = faker.person.lastName();
    let number = parseInt(faker.phone.number('92########'));
    let gender = faker.person.gender();
    let cus = new customer(fName, lName, gender, 20 * i, number, 1000 + i);
    mybank.addCustomers(cus);
    mybank.addAccount({ accountnumber: cus.accountnumber, accountbalance: 10000 * i });
}
async function bankservice(Bank) {
    do {
        let service = await inquirer.prompt([
            {
                name: "select",
                type: "list",
                choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
                message: chalk.yellow("Please select the following services to proceed:")
            }
        ]);
        if (service.select === "View Balance") {
            let response = await inquirer.prompt([
                {
                    name: "number",
                    type: "input",
                    message: chalk.blue("Please enter your account number: ")
                }
            ]);
            let account = mybank.account.find((account) => account.accountnumber == response.number);
            if (!account) {
                console.log(chalk.bold.red(`invalid input/account number!`));
            }
            if (account) {
                let name = mybank.Customer.find((item) => item.accountnumber == account?.accountnumber);
                console.log(chalk.bold.italic.green(`Dear ${name?.firstname} ${name?.lastname}, your account balance is ${account.accountbalance}`));
            }
        }
        if (service.select === "Cash Withdraw") {
            let response = await inquirer.prompt([
                {
                    name: "number",
                    type: "input",
                    message: chalk.blue("Please enter your account number:")
                }
            ]);
            let account = mybank.account.find((account) => account.accountnumber == response.number);
            if (!account) {
                console.log(chalk.red(`invalid input/account number!`));
            }
            if (account) {
                let answer = await inquirer.prompt([
                    {
                        name: "rupee",
                        type: "number",
                        message: chalk.blue("Enter your amount for withdrawal:")
                    }
                ]);
                if (answer.rupee > account.accountbalance) {
                    console.log(chalk.red(`You have insufficient balance`));
                }
                let newbalace = account.accountbalance - answer.rupee;
                Bank.transaction({ accountnumber: account.accountnumber, accountbalance: newbalace });
            }
        }
        if (service.select === "Cash Deposit") {
            let response = await inquirer.prompt([
                {
                    name: "number",
                    type: "input",
                    message: chalk.blue("Please enter your account number:")
                }
            ]);
            let account = mybank.account.find((account) => account.accountnumber == response.number);
            if (!account) {
                console.log(chalk.red(`invalid input/account number!`));
            }
            if (account) {
                let answer = await inquirer.prompt([
                    {
                        name: "rupee",
                        type: "number",
                        message: chalk.blue("Enter your amount for withdrawal:")
                    }
                ]);
                let newbalace = account.accountbalance + answer.rupee;
                Bank.transaction({ accountnumber: account.accountnumber, accountbalance: newbalace });
            }
        }
        if (service.select === "Exit") {
            console.log(chalk.yellow.italic(`Thank You for using our services`));
            return;
        }
    } while (true);
}
setTimeout(() => {
    bankservice(mybank);
}, 1000);
