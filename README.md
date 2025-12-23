Step 1: Clone the Repository
git clone <repository-url>
cd <project-folder>

Step 2: Install Dependencies

Using npm:

npm install

Step 3: Environment Configuration

Locate the environment file:

.env.test

Rename it to:

.env

Open the .env file and add your OpenAI API key:

OPENAI_API_KEY=your_openai_api_key_her

Step 4 Execute the file

cd langchain
node ./example1.js