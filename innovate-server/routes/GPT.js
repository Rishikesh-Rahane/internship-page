const Express = require("express");
const { generator } = require("../controller/gptController.js");
const gptRouter = Express.Router();

gptRouter.post("/questions", generator);

module.exports = gptRouter;

// {
//     "mcq": [
//         {
//             "questionNumber": "Which SQL keyword is used to update data in a database",
//             "options": [
//                 "SELECT",
//                 "UPDATE",
//                 "INSERT",
//                 "DELETE"
//             ],
//             "correctAnswer": " answer: b) UPDATE"
//         },
//         {
//             "questionNumber": "Which SQL clause is used to filter data based on specific conditions",
//             "options": [
//                 "ORDER BY",
//                 "GROUP BY",
//                 "WHERE",
//                 "HAVING"
//             ],
//             "correctAnswer": " answer: c) WHERE"
//         },
//         {
//             "questionNumber": "What is the purpose of the SQL GROUP BY clause",
//             "options": [
//                 "To sort the result set in ascending order",
//                 "To group rows based on a specified column",
//                 "To specify conditions while joining multiple tables",
//                 "To limit the number of rows returned"
//             ],
//             "correctAnswer": " answer: b) To group rows based on a specified column"
//         },
//         {
//             "questionNumber": "Which keyword is used in SQL to retrieve data from multiple tables simultaneously",
//             "options": [
//                 "JOIN",
//                 "UNION",
//                 "MERGE",
//                 "INTERSECT"
//             ],
//             "correctAnswer": " answer: a) JOIN"
//         },
//         {
//             "questionNumber": "Which SQL function can be used to calculate the average of a numeric column",
//             "options": [
//                 "COUNT",
//                 "SUM",
//                 "AVG",
//                 "MAX"
//             ],
//             "correctAnswer": " answer: c) AVG"
//         }
//     ]
// }
