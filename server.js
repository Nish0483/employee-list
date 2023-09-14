const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser'); // Add body-parser
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json()); // Use body-parser for JSON parsing

let employees = [
  { id: 1, name: 'Anil P', age: 30, salary: 50000 },
  { id: 2, name: 'Krishna Kumar', age: 28, salary: 55000 },
  { id: 3, name: 'Anjali S', age: 21, salary: 25000 },
  { id: 4, name: 'vysak KP', age: 25, salary: 25000 },
  { id: 5, name: 'Reshmi C', age: 28, salary: 35000 },
];
let idCounter = employees.length;

// Read (Get) all employees
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Create (Add) a new employee
app.post('/api/employees', (req, res) => {
  const newEmployee = req.body;
  newEmployee.id = idCounter + 1; // Assign a unique ID
  idCounter++;
 
  employees.push(newEmployee);
  res.json(newEmployee);
});

// Update (Edit) an employee
app.put('/api/employees/:id', (req, res) => {
  const employeeId = parseInt(req.params.id);
  const updatedEmployee = req.body;

  employees = employees.map((employee) => {
    if (employee.id === employeeId) {
      return { ...employee, ...updatedEmployee };
    }
    return employee;
  });

  res.json(updatedEmployee);
});

// Delete an employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeId = parseInt(req.params.id);
  employees = employees.filter((employee) => employee.id !== employeeId);
  res.json({ message: 'Employee deleted' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//
