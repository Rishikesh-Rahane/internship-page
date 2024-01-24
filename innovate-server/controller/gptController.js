const OpenAI = require("../GptConnection.js");
const generator = async (req, res) => {
  try {
    const { subject, difficulty, topic, numQuestions } = req.body;

    const prompt = `Generate ${numQuestions} multiple-choice questions (MCQs) about ${subject} with a difficulty level of ${difficulty} and the topic of ${topic}. Provide the correct answer for each question.`;

    const response = await OpenAI.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    console.log(response.choices[0].message);
    const generatedMCQs = await formatQuestions(
      response.choices[0].message.content
    );
    // res.send({ data: response.choices[0].message.content, mcq: generatedMCQs });
    res.send({ mcq: generatedMCQs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating MCQs" });
  }
};

const formatQuestions = (inputString) => {
  const questions = inputString.split(/\d+\.\s+/).filter(Boolean);

  // Initialize an array to store the formatted questions
  const questionsArray = [];

  questions.forEach((questionText) => {
    const questionObj = {};
    const questionParts = questionText.split("\n\nCorrect Answer: ");

    const questionNumberContent = questionParts[0].split("?\n");
    questionObj.questionNumber = questionNumberContent[0];

    const optionsAndAnswer = questionParts[0]
      .split(/\n[a-d]\)\s+|Correct Answer:\s+/)
      .slice(1);
    questionObj.options = optionsAndAnswer
      .slice(0, -1)
      .map((option) => option.trim()); // Extract options
    questionObj.correctAnswer = optionsAndAnswer.slice(-1)[0].trim();
    const correctAnswerPart = questionObj.correctAnswer.split("\n\nCorrect");
    const correctAnswer = correctAnswerPart[correctAnswerPart.length - 1];
    questionObj.correctAnswer = correctAnswer;
    questionObj.options.push(correctAnswerPart[0]);

    questionsArray.push(questionObj);
  });

  return questionsArray;
};
module.exports = { generator };
